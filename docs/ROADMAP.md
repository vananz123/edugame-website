# ROADMAP — EduGame Website

Cập nhật lần cuối: **2026-10-31**

Trạng thái ký hiệu: ✅ xong · 🔄 đang làm · ⬜ chưa bắt đầu · ⛔ bị chặn

## Tổng quan giai đoạn (theo PROJECT_BRIEF §12)

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| Phase 1 | Kiểm tra môi trường (Git, Supabase, stack) | ✅ xong |
| Phase 2 | Website công khai song ngữ | ✅ xong |
| Phase 3 | Supabase schema + RLS + data access | ✅ xong (migration đã áp dụng) |
| Phase 4 | Admin dashboard | ✅ xong (đã test CRUD trong browser) |
| Phase 5 | Kiểm thử tổng thể + triển khai | 🔄 test admin xong; còn deploy |
| Phase 6 | Docs/Hướng dẫn (bổ sung ngoài brief) | ✅ xong (migration 0003 đã áp dụng + đã test browser) |

## Phase 1 — Environment Inspection

- ✅ Git repo khởi tạo, remote `origin` = `github.com/vananz123/edugame-website`
- ✅ Commit đầu tiên `7772e28` (`.gitignore`), đã push lên `origin/main`
- ✅ `.env.local` có `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, đã được gitignore
- ✅ Supabase project `kosieqrqabcrvmvzbemt` phản hồi tốt (Auth 200, Storage 200, publishable key hợp lệ)
- ✅ Schema `public` đã có 5 bảng sau khi áp migration (2026-10-31)
- ✅ Node.js v26.13.0 + npm 11.20.0 đã cài (winget `OpenJS.NodeJS.LTS`); PATH: `C:\Program Files\nodejs`
- ✅ Next.js 16.4.3 + TypeScript + Tailwind v4 + shadcn/ui (base-nova) + next-intl 4 + lucide-react 1 đã khởi tạo
- ✅ Supabase MCP: chỉ có tool `search_docs` (plugin supabase) — không có MCP quản trị DB; migration đã chạy thủ công qua SQL Editor (xem ENVIRONMENT.md)
- ✅ Bộ tài liệu chuyển giao `docs/` đã tạo

## Phase 2 — Public Website

- ✅ Khởi tạo Next.js App Router + TypeScript + Tailwind + shadcn/ui + next-intl + lucide-react
- ✅ Routing `/vi` (mặc định) và `/en`, language switcher (đã test trong browser)
- ✅ Các section: Navbar, Hero, About, Product Overview, Game Showcase (5 game), Features, Download, Footer
- ✅ SEO metadata song ngữ, sitemap, robots.txt
- ✅ Ảnh placeholder cho screenshot (chưa có asset thật)
- ✅ Verify: `typecheck` + `lint` + `build` pass; console sạch; mobile menu + switcher hoạt động

## Phase 3 — Supabase

- ✅ Schema tối giản: `site_content`, `games`, `downloads`, `media` + `admin_users` (xem ARCHITECTURE.md)
- ✅ Migration SQL có version: `supabase/migrations/0001_init.sql` (schema + RLS + storage), `0002_seed.sql` (placeholder)
- ✅ RLS: public chỉ đọc nội dung published; admin ghi qua `is_admin()` (SECURITY DEFINER, allowlist `admin_users`)
- ✅ Storage bucket `media` public read + policy insert/update/delete chỉ admin
- ✅ Data access server-only (`src/lib/data/public.ts`) + trang public đọc nội dung published, fallback về `messages` khi DB trống
- ✅ Seed placeholder (không bịa thông tin cá nhân / link tải thật)
- ✅ Migration **đã áp dụng** vào project `kosieqrqabcrvmvzbemt` (schema + RLS + bucket `media` + seed)

## Phase 4 — Admin Dashboard

- ✅ `/admin/login` — Supabase Auth (email + password), Server Action + `useActionState`
- ✅ Bảo vệ server-side mọi route `/admin/*` (route group `(dashboard)` gọi `requireAdmin()`) và mọi server action
- ✅ `/admin` — overview thống kê published/total + quick links
- ✅ `/admin/content` — editor song ngữ hero/about/product/features/contact (schema-driven), draft/publish
- ✅ `/admin/games` — CRUD + sắp xếp (move up/down) + publish/ẩn + upload screenshot (validate type + size ≤5MB)
- ✅ `/admin/downloads` — version, URL, file size, release date, requirements, release notes, trial
- ✅ `/admin/settings` — contact (GitHub/email) + thông tin tài khoản admin
- ✅ Media upload qua Storage + ghi row `media`; preview + nút Remove; deleteGame/upload-thay-thế tự dọn ảnh cũ
- ✅ Draft → publish + `revalidatePath("/vi")`/`("/en")` sau mỗi lần lưu
- ✅ Đã test CRUD trong browser (sau khi áp migration + tạo admin) — xem Phase 5

## Phase 5 — Final Verification & Deployment

- ✅ `lint` + `tsc --noEmit` + `next build` pass (16 routes sau Phase 6)
- ✅ Browser: `/vi` 200, `/admin` → 307 → `/admin/login`, login render sạch, console sạch
- ✅ Browser admin (đã áp migration + admin): login OK; overview stats đúng; content sửa+publish→public cập nhật (revalidate); games create/reorder/delete + upload screenshot (Storage public read) + Remove; downloads save→public cập nhật; settings render; console sạch
- ✅ Media cleanup: Remove xóa storage+media; deleteGame/upload-thay-thế tự dọn ảnh cũ; toaster top-right không che Save
- ✅ Commit + push bản sửa follow-up (media cleanup, toaster, docs) — `bccc684`
- ✅ Dọn 2 orphan media object/row còn lại từ lúc test (storage + bảng `media`, xác minh còn 0)
- ✅ Dọn game test ẩn `[Test2]` (row + ảnh) — còn đúng 5 game seed
- ⬜ Kiểm tra không lộ secret (đã grep src: không có service-role/key)
- ⬜ Deploy Vercel + cấu hình env production + Supabase redirect URLs (xem DEPLOYMENT.md)
- ✅ Cập nhật HANDOVER.md với trạng thái cuối

## Phase 6 — Docs / Hướng dẫn (bổ sung ngoài brief)

- ✅ Migration `0003_guides.sql`: bảng `guides` + RLS (public đọc published, admin ghi) + index
- ✅ Public `/[locale]/docs` + `/[locale]/docs/[slug]`: danh sách dạng card, chi tiết; Markdown (`react-markdown` + `remark-gfm`, không raw HTML), ảnh, video YouTube/Vimeo/Drive
- ✅ Nav/Footer có link "Hướng dẫn"; sitemap gồm docs + từng bài; i18n vi/en
- ✅ Admin `/admin/guides`: CRUD, cover upload + Copy snippet Markdown, video URL, draft/publish, sắp xếp; dọn cover cũ khi thay/xóa; quick link ở overview
- ✅ `typecheck` + `lint` + `build` pass; browser xác nhận `/vi/docs`, `/en/docs` render empty state, `/admin/guides` render
- ✅ Migration `0003_guides.sql` **đã áp dụng** (bảng `guides` + RLS + index tồn tại, REST 200)
- ✅ Browser test đầy đủ: tạo + publish guide (Markdown vi/en + video YouTube) → `/vi/docs`, `/en/docs` render; sửa title → public cập nhật (revalidate); upload cover → hiện trên trang chi tiết; xóa guide → public 404, storage object + row `media` được dọn sạch (kiểm tra `media` = 0)
- ✅ Dọn guide test sau khi kiểm thử; DB guides = 0, media = 0 (nội dung thật chờ chủ dự án)
- ✅ Commit + push code Phase 6 — `7555931` trên `origin/main`

## Việc cần chủ dự án cung cấp / quyết định

| Việc | Cần cho | Trạng thái |
|---|---|---|
| Thông tin cá nhân thật (tên, bio, link GitHub, contact) | Phase 2 | ⬜ đang dùng placeholder |
| Tên + mô tả + screenshot 5 game types | Phase 2/3 | ⬜ |
| Link tải Windows thật + version + release notes | Phase 2/3 | ⬜ (brief cấm bịa) |
| Tài khoản admin Supabase Auth (email) + insert `admin_users` | Phase 4 | ✅ `dovanan.bth2017@gmail.com` |
| Tài khoản Vercel + tên miền mong muốn | Phase 5 | ⬜ |
| Duyệt migration SQL trước khi áp dụng | Phase 3 | ✅ đã duyệt + đã áp dụng |
| Duyệt commit + push code Phase 3/4 | Phase 3/4 | ✅ đã commit `cb419ed` + `bccc684`, đã push `origin/main` |
| Duyệt + áp migration `0003_guides.sql` | Phase 6 | ✅ đã duyệt + đã áp dụng |
| Duyệt commit + push code Phase 6 | Phase 6 | ✅ `7555931`, đã push `origin/main` |
| Nội dung hướng dẫn thật (bài viết, ảnh, video) | Phase 6 | ⬜ (guide test đã dọn, DB trống) |