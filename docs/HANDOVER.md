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
| Admin Auth (Supabase) | email admin | ⬜ chưa tạo | Tạo ở Phase 4 |

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
- Git repo + remote, commit đầu `7772e28` (`.gitignore`), push `origin/main`.
- `.env.local` với Supabase URL + publishable key (đã kiểm tra hợp lệ).
- Supabase project sống (Auth/Storage OK), schema `public` còn trống.
- Bộ tài liệu `docs/` đầy đủ.
- **Phase 2 xong**: Next.js 16 + landing song ngữ `/vi`,`/en` (đủ 8 section), SEO/sitemap/robots, đã test browser (switcher + mobile menu), build/lint/typecheck pass. Node.js v26 đã cài.

**Chưa làm:**
- Code Phase 2 **chưa commit** (chờ chủ dự án duyệt).
- Chưa có schema/migration (Phase 3).
- Chưa có Admin dashboard (Phase 4).
- Chưa deploy (Phase 5).
- Chưa có thông tin cá nhân thật, asset 5 game, link tải thật (đang chờ chủ dự án — xem ROADMAP).

## 5. Việc cần làm tiếp (theo thứ tự)

1. Khởi tạo Next.js + stack, dựng landing song ngữ (Phase 2).
2. Thiết kế + duyệt migration, bật RLS/Storage policy (Phase 3).
3. Admin dashboard + auth server-side (Phase 4).
4. Kiểm thử + deploy Vercel (Phase 5).

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