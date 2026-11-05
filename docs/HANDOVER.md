# HANDOVER — Checklist bàn giao dự án

Cập nhật: 2026-11-04. Người tiếp nhận đọc file này + [README.md](./README.md) là nắm được toàn bộ.

## 1. Dự án là gì

Website thương hiệu cá nhân + giới thiệu **EduGame Studio** (app Windows tạo game giáo dục cho giáo viên), song ngữ Việt/Anh, kèm Admin dashboard quản trị nội dung không cần sửa code. Chi tiết: [PROJECT_BRIEF.md](./PROJECT_BRIEF.md).

## 2. Tài khoản & quyền truy cập cần bàn giao

| Tài khoản | Định danh | Trạng thái | Ghi chú |
|---|---|---|---|
| GitHub | `vananz123/edugame-website` | ✅ repo tồn tại, đã push `main` | Cần cấp quyền collaborator cho người mới |
| Supabase | project `kosieqrqabcrvmvzbemt` | ✅ hoạt động | Cần invite thành viên vào organization/project |
| Vercel | — | ⬜ chưa tạo | Tạo khi deploy (Phase 5) |
| Admin Auth (Supabase) | `dovanan.bth2017@gmail.com` | ✅ đã tạo + đã trong `admin_users` | Đăng nhập `/admin/login`; thêm admin khác: Auth user + `insert into admin_users` (ENVIRONMENT.md §3). Mật khẩu do chủ dự án giữ, không ghi vào repo |

> Mật khẩu / key **không** ghi trong tài liệu. Bàn giao qua kênh an toàn (password manager, invite trực tiếp).

## 3. Secret ở đâu

| Secret | Vị trí | Lưu ý |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` (local) + Vercel env | public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `.env.local` + Vercel env | public, không commit |
| `SUPABASE_SERVICE_ROLE_KEY` | chỉ env server-only khi cần | tuyệt đối không commit / client |
| Git identity | config local repo | `vananz123 <...noreply.github.com>` |

`.env.local` đã được gitignore. `.env.example` (placeholder) là file được commit.

## 4. Trạng thái hiện tại (2026-11-05)

**Đã xong:**
- Git repo + remote; commit `7772e28` (`.gitignore`), `903fd57` (Phase 2 + docs), `cb419ed` (Phase 3–4), `bccc684` (dọn media + Toaster + docs), `ef71e8e` (đồng bộ docs trạng thái), `7555931` (Phase 6 — docs/guides), đã push `origin/main`.
- `.env.local` với Supabase URL + publishable key (đã kiểm tra hợp lệ), đã gitignore.
- Supabase project sống (Auth/Storage OK).
- Bộ tài liệu `docs/` đầy đủ.
- **Phase 2**: Next.js 16 + landing song ngữ `/vi`,`/en` (đủ 8 section), SEO/sitemap/robots, đã test browser, build/lint/typecheck pass.
- **Phase 3**: migration `0001_init.sql` (schema + RLS + bucket `media`) và `0002_seed.sql` (placeholder) **đã áp dụng** vào project `kosieqrqabcrvmvzbemt`; Supabase clients (public/server/browser); `getPublicData()` đọc published + fallback `messages`.
- **Phase 4**: `/admin/login` (Auth) + guard server-side `requireAdmin()` cho route group `(dashboard)` và mọi server action; overview/content/games/downloads/settings; upload screenshot (+ preview, nút Remove, dọn ảnh cũ khi thay/xóa game); draft/publish + revalidate. Tài khoản admin `dovanan.bth2017@gmail.com` đã tạo và nằm trong `admin_users`.
- **Đã test trong browser**: đăng nhập, overview stats, sửa content → publish → trang public cập nhật, đổi thứ tự game, tạo/xóa game kèm upload screenshot, xóa screenshot (storage + row `media`), lưu downloads, settings render; console sạch.
- **Dọn dữ liệu test**: 2 orphan media (storage + row) và game test ẩn `[Test2]` đã xóa; DB còn đúng 5 game seed, `media` = 0.
- **Phase 6 (bổ sung)**: module Docs/Hướng dẫn — migration `0003_guides.sql` (**đã áp dụng**: bảng `guides` + RLS + index), public `/[locale]/docs` + `/[locale]/docs/[slug]` (Markdown không raw HTML, ảnh, video YouTube/Vimeo/Drive qua allowlist), admin `/admin/guides` (CRUD, cover upload + xóa cover cũ, draft/publish, sắp xếp), nav/footer/sitemap/i18n.
- **Đã test Phase 6 trong browser**: tạo + publish guide (Markdown vi/en + video) → hiện ở `/vi/docs` và `/en/docs`; sửa title → public cập nhật (revalidate); upload cover → hiện trên trang chi tiết; xóa guide → public 404 và storage object + row `media` được dọn sạch. Guide test đã xóa, DB guides = 0 (chờ nội dung thật).
- **Phase 7 (bổ sung)**: tách landing single-page thành nhiều trang (`/[locale]` trang chủ, `/about`, `/games`, `/features`, `/download`; `/docs` có từ Phase 6), navbar/footer/sitemap/metadata theo trang; làm mới giao diện theo hướng trắng–đen tối giản (bảng xám trung tính, bỏ token màu thương hiệu; nền mesh/grid nhạt, reveal khi cuộn, card hover lift nhẹ, CTA dải đen). Đã test browser vi/en + chuyển ngôn ngữ; sửa đồng bộ `<html lang>`.
- Build/lint/typecheck pass (24 trang).
- Phase 7 đã commit + push — `0f504d3` trên `origin/main`.
- **Phase 5 (deploy)**: đã deploy Vercel — `https://edugame-website-one.vercel.app` (project `vananz123s-projects/edugame-website`, Git integration bật nên `git push` tự deploy). Env `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `NEXT_PUBLIC_SITE_URL` đã set cho Production + Preview và đã đối chiếu khớp `.env.local`. Chi tiết + lệnh CLI: [DEPLOYMENT.md](./DEPLOYMENT.md) §3, [ENVIRONMENT.md](./ENVIRONMENT.md) §6.
- **Phase 8 (nội dung thật)**: chữ placeholder **về sản phẩm** trên site đã được thay bằng sự kiện lọc từ tài liệu dự án EduGame Studio (5 thể loại game đúng tên trong app, wizard 5 bước, AI cục bộ llama.cpp + Qwen3.5, trình chiếu màn 2, chơi LAN, SQLite + `.egame`, bộ cài 0.4.1 · 88,2 MB · 05/11/2026, yêu cầu RAM 4/8 GB, chưa ký số). Riêng tên/bio/email tác giả và nhãn "screenshot (placeholder)" **giữ nguyên** vì tài liệu không chứa thông tin đó — không bịa. Nội dung nằm ở `messages/vi.json` + `messages/en.json` (fallback) **và** `supabase/migrations/0004_real_content.sql` (DB = nguồn của production) kèm 2 bài guide Markdown vi/en. `release_date` format theo locale. **Migration 0004 đã chủ dự án duyệt + áp ngày 05/11/2026** → production (`/vi`, `/vi/download`, `/vi/docs`, `/en/docs`) đã hiển thị nội dung thật.
- **Link tải thật (Phase 8 bổ sung)**: repo `https://github.com/vananz123/edu-game-ai` **đã có GitHub Releases** `v0.4.0` + `v0.4.1` kèm bộ cài, không cần upload thêm. Site trỏ thẳng asset đã kiểm chứng: `https://github.com/vananz123/edu-game-ai/releases/download/v0.4.1/EduGame-Studio-Setup-0.4.1.exe` (92.496.890 byte, SHA-256 `636bc0042611516987c3fbfc48c61f1d65df0935ab5a17f31fb39fb80fe81741` — đã tải về và tính lại). Ghi rõ trên trang: chưa ký số → SmartScreen cảnh báo, chưa cài thử trên máy sạch ngắt mạng.

**Chưa làm / blocker:**
- Chưa xác minh đăng nhập `/admin/login` trên production (cần mật khẩu admin — chỉ chủ dự án làm được).
- Chưa commit các sửa đổi 0.4.1 (`messages/vi.json`, `messages/en.json`, `0004_real_content.sql`, `docs/`) — chờ chủ dự án duyệt (AGENTS.md #1). SQL 0004 bản 0.4.1 **đã được áp vào DB** nên production đã đúng, chỉ repo chưa được commit.
- ✅ Link tải đã có và đã dán vào DB: `downloads.windows_url` = asset release `v0.4.1` trên `github.com/vananz123/edu-game-ai`. Còn lại: theo dõi release mới và cập nhật version/URL/SHA-256 qua `/admin/downloads` khi đóng gói bản khác.
- Chưa có thông tin cá nhân thật (tên/bio/email), screenshot 5 game, ảnh/video cho guide — tài liệu sản phẩm không chứa các mục này, không được bịa.

## 5. Việc cần làm tiếp (theo thứ tự)

1. Duyệt commit + push các thay đổi 0.4.1 (`messages/*.json`, `0004_real_content.sql`, `docs/`) → Vercel tự deploy. Nội dung production đã đúng từ trước đó vì DB đã áp `0004`; bước này chỉ làm repo khớp với DB.
2. Đăng nhập `https://edugame-website-one.vercel.app/admin/login` để xác nhận auth hoạt động trên production.
3. Bổ sung qua `/admin`: tên/bio/email thật, screenshot từng game, ảnh/video trong `/admin/guides`.
4. Khi đóng gói bản mới: upload release lên `github.com/vananz123/edu-game-ai` rồi cập nhật `version` / `windows_url` / `file_size` / `release_date` / SHA-256 trong `/admin/downloads` (không cần đụng code).
5. (Tùy chọn) gắn domain riêng → cập nhật `NEXT_PUBLIC_SITE_URL` trên Vercel rồi redeploy.

Chi tiết từng giai đoạn: [ROADMAP.md](./ROADMAP.md).

## 6. Quy tắc sống còn khi tiếp nhận

- Không commit/push khi chưa được duyệt.
- Không commit secret; không lộ service-role key.
- Không bịa thông tin cá nhân / link tải / thống kê.
- Không thay đổi DB phá hủy khi chưa duyệt.
- Cập nhật `docs/` cùng commit với thay đổi.

Đầy đủ: [AGENT_GUIDE.md](./AGENT_GUIDE.md).

## 7. Liên hệ

| Vai trò | Thông tin |
|---|---|
| Chủ dự án / creator | _(placeholder — bổ sung tên, email, GitHub)_ |
| GitHub | https://github.com/vananz123 |

> Chủ dự án cần điền thông tin liên hệ thật trước khi bàn giao chính thức.