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
| Schema `public` | ⚠️ trống — chưa có bảng (kiểm tra 2026-10-31) |
| MCP quản trị DB | ❌ không có; chỉ có `supabase:search_docs` |

> Kiểm tra lại trạng thái schema trước khi làm Phase 3; có thể chủ dự án đã tạo bảng sau thời điểm kiểm tra.

## 3. Chạy migration thủ công (khi chưa có MCP DB)

Cách A — Supabase Dashboard:
1. Mở project → SQL Editor.
2. Dán nội dung file trong `supabase/migrations/` theo thứ tự version.
3. Review SQL → Run. (Phải được chủ dự án duyệt trước.)

Cách B — Supabase CLI (nếu cài):
```bash
supabase link --project-ref kosieqrqabcrvmvzbemt
supabase db push
```

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