# HANDOVER — Checklist bàn giao dự án

Cập nhật: 2026-10-31. Người tiếp nhận đọc file này + [README.md](./README.md) là nắm được toàn bộ.

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

## 4. Trạng thái hiện tại (2026-10-31)

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

**Chưa làm / blocker:**
- Code Phase 7 **chưa commit** (chờ duyệt).
- Chưa deploy Vercel (Phase 5).
- Chưa có thông tin cá nhân thật, asset 5 game, link tải thật, nội dung guide thật (đang chờ chủ dự án — xem ROADMAP).

## 5. Việc cần làm tiếp (theo thứ tự)

1. Duyệt commit + push code Phase 7 (kèm docs).
2. Điền thông tin thật (tên/bio/contact, 5 game, link tải) qua dashboard `/admin`.
3. Viết guide thật (Markdown + ảnh + video) qua `/admin/guides`.
4. Kiểm thử tổng thể + deploy Vercel (Phase 5, DEPLOYMENT.md).

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