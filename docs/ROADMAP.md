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
| Phase 5 | Kiểm thử tổng thể + triển khai | ✅ test + deploy Vercel xong (còn kiểm tra login production) |
| Phase 6 | Docs/Hướng dẫn (bổ sung ngoài brief) | ✅ xong (migration 0003 đã áp dụng + đã test browser) |
| Phase 7 | Tách trang + làm mới giao diện + trắng–đen (bổ sung ngoài brief) | ✅ xong (`0f504d3`, đã push + đã deploy) |

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
- ✅ Deploy Vercel qua Git integration — production: `https://edugame-website-one.vercel.app` (mục 3 DEPLOYMENT.md)
- ✅ Env production + preview: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (khớp `.env.local`, trỏ đúng project `kosieqrqabcrvmvzbemt`), `NEXT_PUBLIC_SITE_URL` = domain Vercel
- ✅ Smoke test production: `/vi`, `/en`, `/vi/games`, `/vi/about`, `/en/features`, `/vi/docs` = 200; `/admin` → 307 `/admin/login`; sitemap + robots dùng domain thật; client bundle không chứa JWT/service-role key
- ⬜ Chủ dự án tự đăng nhập `/admin/login` trên production (cần mật khẩu) — Supabase Auth không bắt redirect URL cho email+password
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

## Phase 7 — Tách trang + làm mới giao diện (bổ sung ngoài brief)

- ✅ Tách landing single-page thành: trang chủ + `/about`, `/games`, `/features`, `/download` (docs đã có từ Phase 6)
- ✅ Navbar/footer chuyển sang route trang, có active state; sitemap + metadata/hreflang cho từng trang
- ✅ Giao diện trắng–đen tối giản: bảng xám trung tính (bỏ token màu thương hiệu), nền mesh/grid nhạt, reveal khi cuộn, card hover lift nhẹ, CTA dải đen, logo tile đen
- ✅ Trang chủ mới: hero 2 cột + stats + highlights + preview game/tính năng + CTA
- ✅ `lint` + `typecheck` + `build` pass (24 trang); browser test `/vi`, `/en` và 4 trang con: 200, nav active đúng, canonical đúng, chuyển ngôn ngữ giữ đúng route (kể cả `/download`), console sạch
- ✅ Sửa lỗi `<html lang>` không cập nhật khi chuyển ngôn ngữ client-side (`LocaleLangSync`)
- ✅ Commit + push code Phase 7 — `0f504d3` trên `origin/main`

## Phase 8 — Nội dung thật lọc từ tài liệu sản phẩm (bổ sung ngoài brief)

Nguồn: thư mục tài liệu dự án EduGame Studio (`STATUS.md`, `ROADMAP.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `BENCHMARKS.md`, `PROJECT_MAP.md`, `implementation-plan.md`, cập nhật 2026-11-04). Chỉ đăng sự kiện có dòng chứng minh trong docs; mọi chỗ chưa có nguồn giữ nguyên placeholder.

- ✅ `messages/vi.json` + `messages/en.json`: hero, `home.stats`/`home.highlights`, product, 5 thể loại game (tên thật trong app), 6 tính năng, khối download (0.4.1 · 88,2 MB · 05/11/2026 · yêu cầu máy · release notes · SHA-256) — thay toàn bộ chữ placeholder
- ✅ `supabase/migrations/0004_real_content.sql`: cùng nội dung trên cho DB (nguồn thật của trang production) + 2 bài guide `tao-game-dau-tien`, `ai-cuc-bo-tren-may` — **UPDATE-only, không xoá row, không đổi schema, không đụng `screenshot_path`/`video_url`/`about`/`contact`**
- ✅ Chủ dự án duyệt + dán vào Supabase SQL Editor → đã áp (đối chiếu DB: `site_content` hero/product/features + `games` 5 dòng + `downloads` 0.4.1 + `guides` 2 bài published, cùng timestamp 05/11/2026 11:40 giờ máy)
- ✅ `release_date` format theo locale (`vi-VN` → `05/11/2026`, `en-US` → `11/05/2026`) trong `src/lib/data/public.ts`
- ✅ `lint` + `typecheck` + `build` pass (24 trang); render thử `/vi` + `/en` (fallback messages, DB tắt): hero/stats/highlights/5 game/6 tính năng/download 200, đúng chữ mới
- Không bịa: tên/bio/email tác giả vẫn placeholder vì tài liệu sản phẩm không có thông tin cá nhân; screenshot từng game vẫn trống. **Link tải không phải bịa** — lấy từ GitHub Releases `v0.4.1` có thật của repo `vananz123/edu-game-ai`, đã tải asset về kiểm dung lượng + SHA-256
- ✅ Commit + push code Phase 8 — `6061c7b` trên `origin/main`, Vercel tự build → Ready (`https://edugame-website-one.vercel.app`, `/vi` + `/en/download` + `/vi/docs` đều 200)
- ✅ Đối chiếu production sau khi áp `0004`: `/vi` hiện tên game thật; `/vi/download` (200) hiện `0.4.1` · `88,2 MB (92.496.890 byte)` · `05/11/2026` · SHA-256 và nút tải trỏ thẳng asset release; `/vi/docs` + `/en/docs` hiện 2 bài guide. `games.screenshot_path` của game-1 vẫn nguyên — migration không đụng ảnh.

## Phase 9 — Logo chính thức cho website

- ✅ Nguồn: file logo do chủ dự án cung cấp (mũ cử chương + sách mở + vòng chòm sao, 2 màu `#1800ad` / `#38b6ff`, 2000×2000)
- ✅ Xử lý asset: ảnh gốc là **nền trắng opaque**, không trong suốt → flood-fill chỉ từ biên để xoá nền trắng mà vẫn giữ trang sách trắng; cắt theo bounding box nội dung, lưu `public/brand/edugame-logo.png` (1024px, PNG palette ~64 KB)
- ✅ Icon: `src/app/icon.png` (512px) + `src/app/apple-icon.png` (180px) theo file convention của Next; **xoá `src/app/favicon.ico` mặc định** (logo Vercel) — HTML public nay nhả `<link rel="icon" href="/icon.png" sizes="512x512">` + `apple-touch-icon`
- ✅ `src/components/brand-mark.tsx` (`next/image`, intrinsic 72px, `priority`) thay icon `GraduationCap` ở navbar, footer, sidebar admin và trang `/admin/login`
- ✅ `lint` + `typecheck` + `build` pass; chạy production server local: 2 ảnh logo render 36×36 (`natural=96`, qua `/_next/image`), `/admin/login` 200, console sạch
- Ghi chú: logo màu xanh là chỗ duy nhất còn màu ngoài giao diện trắng–đen — xem [ARCHITECTURE.md](./ARCHITECTURE.md) §11

## Việc cần chủ dự án cung cấp / quyết định

| Việc | Cần cho | Trạng thái |
|---|---|---|
| Thông tin cá nhân thật (tên, bio, link GitHub, contact) | Phase 2 | ⬜ đang dùng placeholder — tài liệu sản phẩm không có thông tin tác giả |
| Tên + mô tả + screenshot 5 game types | Phase 2/3 | ✅ tên + mô tả thật đã lọc từ docs, **đã áp vào DB**; ⬜ screenshot từng game vẫn trống (chờ ảnh thật) |
| Link tải Windows thật + version + release notes | Phase 2/3 | ✅ version 0.4.1 + dung lượng + ngày + release notes + **link tải** là asset GitHub Release `vananz123/edu-game-ai` (SHA-256 đã kiểm chứng bằng cách tải về) |
| Tài khoản admin Supabase Auth (email) + insert `admin_users` | Phase 4 | ✅ `dovanan.bth2017@gmail.com` |
| Tài khoản Vercel + tên miền mong muốn | Phase 5 | ✅ đã deploy `https://edugame-website-one.vercel.app`; domain riêng (tùy chọn) chưa có |
| Duyệt migration SQL trước khi áp dụng | Phase 3 | ✅ đã duyệt + đã áp dụng |
| Duyệt commit + push code Phase 3/4 | Phase 3/4 | ✅ đã commit `cb419ed` + `bccc684`, đã push `origin/main` |
| Duyệt + áp migration `0003_guides.sql` | Phase 6 | ✅ đã duyệt + đã áp dụng |
| Duyệt commit + push code Phase 6 | Phase 6 | ✅ `7555931`, đã push `origin/main` |
| Duyệt commit + push code Phase 7 | Phase 7 | ✅ `0f504d3`, đã push `origin/main` |
| Nội dung hướng dẫn thật (bài viết, ảnh, video) | Phase 6 | ✅ 2 bài Markdown vi/en đã publish trong DB; ⬜ chưa có ảnh/video minh họa |
| **Duyệt + áp migration `0004_real_content.sql`** | Phase 8 | ✅ chủ dự án đã duyệt + áp 05/11/2026 (`site_content`/`games`/`downloads`/`guides` đã có nội dung thật) |
| Duyệt commit + push code Phase 8 | Phase 8 | ✅ `6061c7b` + `8191e7c` + `6712495` (bản 0.4.1: link tải + docs), đã push `origin/main` |
| File logo chính thức | Phase 9 | ✅ chủ dự án đã cung cấp (PNG 2000×2000) |
| Duyệt commit + push code Phase 9 | Phase 9 | ⬜ chờ chủ dự án duyệt |