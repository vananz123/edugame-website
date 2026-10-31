# ENVIRONMENT — Môi trường & biến cấu hình

Cập nhật: 2026-10-31

## 1. Biến môi trường

| Biến | Phạm vi | Bắt buộc | Mô tả |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public (client) | ✅ | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public (client) | ✅ | Publishable key (anon) — an toàn cho client, vẫn không commit |
| `NEXT_PUBLIC_SITE_URL` | public (client) | ❌ | URL công khai cho SEO/sitemap; mặc định `http://localhost:3000` |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only | ❌ chỉ khi thật cần | Key đặc quyền; KHÔNG bao giờ đưa vào client / commit |

- File local: `.env.local` (đã gitignore).
- File mẫu commit được: `.env.example` (chỉ placeholder).
- Trên Vercel: khai báo trong Project Settings → Environment Variables (xem DEPLOYMENT.md).

## 2. Thông tin Supabase hiện tại

| Mục | Giá trị |
|---|---|
| Project ref | `kosieqrqabcrvmvzbemt` |
| URL | `https://kosieqrqabcrvmvzbemt.supabase.co` |
| Auth service | ✅ hoạt động (`/auth/v1/health` → 200) |
| Storage | ✅ truy cập được (`/storage/v1/bucket` → 200) |
| Publishable key | ✅ hợp lệ (REST không trả 401) |
| Schema `public` | ✅ migration `0001_init.sql` + `0002_seed.sql` **đã áp dụng** (2026-10-31): 5 bảng, RLS, bucket `media` |
| Admin | ✅ Auth user + allowlist `admin_users` đã tạo (`dovanan.bth2017@gmail.com`) |
| MCP quản trị DB | ❌ không có; chỉ có `supabase:search_docs` → thao tác SQL qua Dashboard |

> Trang public vẫn có fallback `messages` khi bảng rỗng. Admin CRUD cần cả migration + email trong `admin_users` (§3).

## 3. Chạy migration thủ công (khi chưa có MCP DB)

> Project hiện tại **đã áp dụng** cả 2 migration. Phần dưới dùng khi dựng project Supabase mới (staging/prod) hoặc reset.

Cách A — Supabase Dashboard:
1. Mở project → SQL Editor.
2. Dán nội dung file trong `supabase/migrations/` theo thứ tự version.
3. Review SQL → Run. (Phải được chủ dự án duyệt trước.)

Cách B — Supabase CLI (nếu cài):
```bash
supabase link --project-ref kosieqrqabcrvmvzbemt
supabase db push
```

Thứ tự: `0001_init.sql` (schema + RLS + storage) → `0002_seed.sql` (placeholder, idempotent).

### Tạo tài khoản admin (bắt buộc để vào dashboard)

1. Supabase Dashboard → **Authentication → Users → Add user**: nhập email + password admin (chọn "Auto Confirm User" nếu có).
2. SQL Editor, chạy (thay email thật):
   ```sql
   insert into public.admin_users (email) values ('your-admin@email.com')
   on conflict (email) do nothing;
   ```
3. Vào `/admin/login`, đăng nhập bằng email/password đó. `requireAdmin()` gọi `rpc("is_admin")` → khớp allowlist mới cho qua.

> Chỉ email trong `admin_users` mới là admin. Tạo user Auth mà quên insert allowlist thì vẫn bị chặn. Không dùng service-role key để bypass.

## 4. Chạy local

> Node.js **v26.13.0** + npm 11.20.0 đã cài tại `C:\Program Files\nodejs`. Trong Git Bash có thể cần `export PATH="/c/Program Files/nodejs:$PATH"` trước khi chạy lệnh node/npm.

```bash
npm install
cp .env.example .env.local   # rồi điền giá trị thật
npm run dev                  # http://localhost:3000  (/ → /vi)
```

Lệnh kiểm tra:
```bash
npm run lint
npm run typecheck
npm run build
```

## 5. Git

| Mục | Giá trị |
|---|---|
| Remote `origin` | `https://github.com/vananz123/edugame-website.git` |
| Nhánh chính | `main` (đã track `origin/main`) |
| Danh tính (local repo) | `vananz123 <vananz123@users.noreply.github.com>` |
| `gh` CLI | chưa cài |

Quy tắc: không commit/push khi chưa được duyệt; không commit `.env.local`.