-- ============================================================
-- EduGame Website — Phase 6: tài liệu hướng dẫn (docs/guides)
-- Chạy trong Supabase SQL Editor (project kosieqrqabcrvmvzbemt).
-- PHẢI được chủ dự án duyệt trước khi áp dụng.
-- Idempotent: dùng IF NOT EXISTS / OR REPLACE để chạy lại an toàn.
-- ============================================================

create table if not exists public.guides (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  title      jsonb not null default '{}'::jsonb,
  summary    jsonb not null default '{}'::jsonb,
  body_md    jsonb not null default '{}'::jsonb,
  cover_path text,
  video_url  text,
  category   text,
  sort_order int  not null default 0,
  published  boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.guides enable row level security;

drop policy if exists "public read published guides" on public.guides;
create policy "public read published guides" on public.guides
  for select using (published);

drop policy if exists "admin write guides" on public.guides;
create policy "admin write guides" on public.guides
  for all using (public.is_admin()) with check (public.is_admin());

create index if not exists guides_published_order_idx
  on public.guides (published, sort_order);
