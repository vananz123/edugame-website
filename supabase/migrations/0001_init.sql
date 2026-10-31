-- ============================================================
-- EduGame Website — Phase 3 schema
-- Chạy trong Supabase SQL Editor (project kosieqrqabcrvmvzbemt).
-- PHẢI được chủ dự án duyệt trước khi áp dụng.
-- Idempotent: dùng IF NOT EXISTS / OR REPLACE để chạy lại an toàn.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Admin allowlist ----------
create table if not exists public.admin_users (
  email text primary key
);
alter table public.admin_users enable row level security;
-- Không có policy public: chỉ hàm is_admin() (security definer) đọc được.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users a
    where a.email = coalesce(auth.jwt() ->> 'email', '')
  );
$$;

-- ---------- site_content ----------
create table if not exists public.site_content (
  key        text primary key,
  content    jsonb not null default '{}'::jsonb,
  status     text  not null default 'draft' check (status in ('draft','published')),
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
drop policy if exists "public read published site_content" on public.site_content;
create policy "public read published site_content" on public.site_content
  for select using (status = 'published');
drop policy if exists "admin write site_content" on public.site_content;
create policy "admin write site_content" on public.site_content
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- games ----------
create table if not exists public.games (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           jsonb not null default '{}'::jsonb,
  description     jsonb not null default '{}'::jsonb,
  screenshot_path text,
  video_url       text,
  sort_order      int  not null default 0,
  published       boolean not null default false,
  updated_at      timestamptz not null default now()
);
alter table public.games enable row level security;
drop policy if exists "public read published games" on public.games;
create policy "public read published games" on public.games
  for select using (published);
drop policy if exists "admin write games" on public.games;
create policy "admin write games" on public.games
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- downloads ----------
create table if not exists public.downloads (
  id                  uuid primary key default gen_random_uuid(),
  version             text not null default '',
  windows_url         text not null default '',
  file_size           text not null default '',
  release_date        date,
  system_requirements jsonb not null default '{}'::jsonb,
  release_notes       jsonb not null default '{}'::jsonb,
  trial_url           text,
  published           boolean not null default false,
  updated_at          timestamptz not null default now()
);
alter table public.downloads enable row level security;
drop policy if exists "public read published downloads" on public.downloads;
create policy "public read published downloads" on public.downloads
  for select using (published);
drop policy if exists "admin write downloads" on public.downloads;
create policy "admin write downloads" on public.downloads
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- media ----------
create table if not exists public.media (
  id         uuid primary key default gen_random_uuid(),
  bucket     text not null default 'media',
  path       text not null,
  alt        jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.media enable row level security;
drop policy if exists "public read media" on public.media;
create policy "public read media" on public.media
  for select using (true);
drop policy if exists "admin write media" on public.media;
create policy "admin write media" on public.media
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Storage bucket + policies ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media objects" on storage.objects;
create policy "public read media objects" on storage.objects
  for select using (bucket_id = 'media');
drop policy if exists "admin insert media objects" on storage.objects;
create policy "admin insert media objects" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin update media objects" on storage.objects;
create policy "admin update media objects" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());
drop policy if exists "admin delete media objects" on storage.objects;
create policy "admin delete media objects" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- ---------- Bootstrap admin (CHỦ DỰ ÁN TỰ ĐIỀN EMAIL) ----------
-- Sau khi tạo user trong Authentication, chạy:
--   insert into public.admin_users (email) values ('your-admin@email.com')
--   on conflict (email) do nothing;