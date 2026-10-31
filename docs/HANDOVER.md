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
| Admin Auth (Supabase) | email admin | ⬜ chưa tạo | Tạo thủ công: Auth user + insert `admin_users` (ENVIRONMENT.md §3) |

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
- Git repo + remote; commit `7772e28` (`.gitignore`) + `903fd57` (Phase 2 + docs), đã push `origin/main`.
- `.env.local` với Supabase URL + publishable key (đã kiểm tra hợp lệ), đã gitignore.
- Supabase project sống (Auth/Storage OK).
- Bộ tài liệu `docs/` đầy đủ.
- **Phase 2**: Next.js 16 + landing song ngữ `/vi`,`/en` (đủ 8 section), SEO/sitemap/robots, đã test browser, build/lint/typecheck pass.
- **Phase 3 (code)**: migration `0001_init.sql` (schema + RLS + storage `media`) + `0002_seed.sql` (placeholder); Supabase clients (public/server/browser); `getPublicData()` đọc published + fallback `messages`.
- **Phase 4 (code)**: `/admin/login` (Auth), guard server-side `requireAdmin()` cho route group `(dashboard)` + mọi server action; overview/content/games/downloads/settings; upload screenshot; draft/publish + revalidate. Build/lint/typecheck pass; browser xác nhận `/vi` 200, `/admin`→`/admin/login`, login render sạch.

**Chưa làm / blocker:**
- Code Phase 3/4 **chưa commit** (chờ chủ dự án duyệt).
- Migration **chưa áp dụng** → schema `public` vẫn trống (chờ duyệt SQL + chạy SQL Editor).
- Tài khoản admin **chưa tạo** (Auth user + insert `admin_users`) → chưa test CRUD/upload/publish trong browser.
- Chưa deploy Vercel (Phase 5).
- Chưa có thông tin cá nhân thật, asset 5 game, link tải thật (đang chờ chủ dự án — xem ROADMAP).

## 5. Việc cần làm tiếp (theo thứ tự)

1. **Duyệt + áp migration** `0001_init.sql` rồi `0002_seed.sql` trong Supabase SQL Editor (ENVIRONMENT.md §3).
2. **Tạo tài khoản admin**: Authentication user + `insert into admin_users(email)` (ENVIRONMENT.md §3).
3. **Test admin**: đăng nhập `/admin/login`, CRUD content/games/downloads, upload screenshot, publish → kiểm tra trang public cập nhật.
4. **Duyệt commit + push** code Phase 3/4 (kèm docs).
5. Điền thông tin thật (tên/bio/contact, 5 game, link tải) qua dashboard.
6. Kiểm thử tổng thể + deploy Vercel (Phase 5, DEPLOYMENT.md).

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