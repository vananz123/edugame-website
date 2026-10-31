# ROADMAP — EduGame Website

Cập nhật lần cuối: **2026-10-31**

Trạng thái ký hiệu: ✅ xong · 🔄 đang làm · ⬜ chưa bắt đầu · ⛔ bị chặn

## Tổng quan giai đoạn (theo PROJECT_BRIEF §12)

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| Phase 1 | Kiểm tra môi trường (Git, Supabase, stack) | ✅ xong |
| Phase 2 | Website công khai song ngữ | ✅ xong |
| Phase 3 | Supabase schema + RLS + data access | ⬜ |
| Phase 4 | Admin dashboard | ⬜ |
| Phase 5 | Kiểm thử tổng thể + triển khai | ⬜ |

## Phase 1 — Environment Inspection

- ✅ Git repo khởi tạo, remote `origin` = `github.com/vananz123/edugame-website`
- ✅ Commit đầu tiên `7772e28` (`.gitignore`), đã push lên `origin/main`
- ✅ `.env.local` có `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, đã được gitignore
- ✅ Supabase project `kosieqrqabcrvmvzbemt` phản hồi tốt (Auth 200, Storage 200, publishable key hợp lệ)
- ⬜ Schema `public` hiện **trống** — chưa có bảng nào
- ✅ Node.js v26.13.0 + npm 11.20.0 đã cài (winget `OpenJS.NodeJS.LTS`); PATH: `C:\Program Files\nodejs`
- ✅ Next.js 16.4.3 + TypeScript + Tailwind v4 + shadcn/ui (base-nova) + next-intl 4 + lucide-react 1 đã khởi tạo
- ⬜ Supabase MCP: chỉ có tool `search_docs` (plugin supabase) — **không có** MCP quản trị DB; migration sẽ chạy thủ công qua SQL Editor hoặc CLI (xem ENVIRONMENT.md)
- ✅ Bộ tài liệu chuyển giao `docs/` đã tạo

## Phase 2 — Public Website

- ✅ Khởi tạo Next.js App Router + TypeScript + Tailwind + shadcn/ui + next-intl + lucide-react
- ✅ Routing `/vi` (mặc định) và `/en`, language switcher (đã test trong browser)
- ✅ Các section: Navbar, Hero, About, Product Overview, Game Showcase (5 game), Features, Download, Footer
- ✅ SEO metadata song ngữ, sitemap, robots.txt
- ✅ Ảnh placeholder cho screenshot (chưa có asset thật)
- ✅ Verify: `typecheck` + `lint` + `build` pass; console sạch; mobile menu + switcher hoạt động

## Phase 3 — Supabase

- ⬜ Thiết kế schema tối giản: `site_content`, `games`, `downloads`, `media` (xem ARCHITECTURE.md)
- ⬜ Viết migration SQL có version trong `supabase/migrations/`
- ⬜ Bật RLS: public chỉ đọc nội dung published; admin ghi
- ⬜ Storage bucket `media` + policy chỉ admin upload
- ⬜ Data access functions (server-only) + kết nối trang public với nội dung published
- ⬜ Seed nội dung placeholder (không bịa thông tin cá nhân / link tải thật)

## Phase 4 — Admin Dashboard

- ⬜ `/admin/login` — Supabase Auth (email + password)
- ⬜ Bảo vệ server-side mọi route `/admin/*` và server actions (không chỉ client)
- ⬜ `/admin/content` — sửa hero, intro, overview, features, contact (vi + en)
- ⬜ `/admin/games` — CRUD + sắp xếp + publish/ẩn + upload screenshot
- ⬜ `/admin/downloads` — version, URL, file size, release notes, trial
- ⬜ `/admin/settings` — link mạng xã hội, cấu hình chung
- ⬜ Media management: upload/preview/replace/delete, validate type + size
- ⬜ Draft → preview → publish + revalidate trang public

## Phase 5 — Final Verification & Deployment

- ⬜ `lint` + `tsc --noEmit` + `next build` pass
- ⬜ Test route `/vi`, `/en`, admin auth, CRUD, upload, publish
- ⬜ Kiểm tra không lộ secret
- ⬜ Deploy Vercel + cấu hình env production + Supabase redirect URLs (xem DEPLOYMENT.md)
- ⬜ Cập nhật HANDOVER.md với trạng thái cuối

## Việc cần chủ dự án cung cấp / quyết định

| Việc | Cần cho | Trạng thái |
|---|---|---|
| Thông tin cá nhân thật (tên, bio, link GitHub, contact) | Phase 2 | ⬜ đang dùng placeholder |
| Tên + mô tả + screenshot 5 game types | Phase 2/3 | ⬜ |
| Link tải Windows thật + version + release notes | Phase 2/3 | ⬜ (brief cấm bịa) |
| Tài khoản admin Supabase Auth (email) | Phase 4 | ⬜ |
| Tài khoản Vercel + tên miền mong muốn | Phase 5 | ⬜ |
| Duyệt migration SQL trước khi áp dụng | Phase 3 | ⬜ |