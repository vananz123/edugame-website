# AGENTS.md — EduGame Website

Dự án: website thương hiệu cá nhân + EduGame Studio, song ngữ `/vi` (mặc định) và `/en`, kèm Admin dashboard. Stack: Next.js App Router, TypeScript, Tailwind, shadcn/ui, next-intl, Supabase, Vercel.

## Đọc trước khi làm việc

Toàn bộ tài liệu chuyển giao nằm trong [`docs/`](./docs/README.md):
- [`docs/PROJECT_BRIEF.md`](./docs/PROJECT_BRIEF.md) — đặc tả gốc (nguồn sự thật yêu cầu)
- [`docs/AGENT_GUIDE.md`](./docs/AGENT_GUIDE.md) — quy tắc bắt buộc
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — lộ trình + trạng thái
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — kiến trúc & schema
- [`docs/ENVIRONMENT.md`](./docs/ENVIRONMENT.md) — env & Supabase
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — triển khai
- [`docs/HANDOVER.md`](./docs/HANDOVER.md) — bàn giao

## Quy tắc tối quan trọng

1. **Không commit / push khi chưa được chủ dự án duyệt rõ ràng.**
2. **Không commit secret** (`.env.local`, key, token). `.env.local` phải luôn trong `.gitignore`.
3. **Không lộ service-role key** ra client / log / response.
4. **Không thay đổi DB phá hủy** khi chưa duyệt; migration phải được review trước.
5. **Không bịa** thông tin cá nhân, link tải thật, thống kê — dùng placeholder.
6. Cập nhật tài liệu `docs/` cùng commit với thay đổi.
7. Chỉ làm việc trên Supabase project `kosieqrqabcrvmvzbemt`.