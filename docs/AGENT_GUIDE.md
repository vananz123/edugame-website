# AGENT GUIDE — Quy tắc làm việc trên repo EduGame Website

Dành cho AI agent và lập trình viên. Đọc trước khi sửa bất kỳ thứ gì. Nguồn yêu cầu đầy đủ: [PROJECT_BRIEF.md](./PROJECT_BRIEF.md).

## 1. Quy tắc bắt buộc (KHÔNG được vi phạm)

1. **Không commit / push khi chưa được chủ dự án duyệt rõ ràng.** Luôn hỏi trước.
2. **Không commit secret**: `.env.local`, key, token, mật khẩu. `.env.local` phải luôn nằm trong `.gitignore`. Chỉ commit `.env.example` với placeholder.
3. **Không lộ service-role key** ra client code, log, hay response.
4. **Không thay đổi database mang tính phá hủy** (drop, truncate, xóa dữ liệu) khi chưa được duyệt. Migration SQL phải được review trước khi áp dụng.
5. **Không bịa** thông tin cá nhân, testimonial, số lượt tải, thống kê sản phẩm, link tải thật. Dùng placeholder và ghi rõ trong ROADMAP.
6. **Không tự tạo backend server riêng**, payment, analytics, hay CMS phức tạp. Giữ dự án nhẹ, một người bảo trì được.
7. **Giữ lịch sử Git**, không overwrite repo, chạy `git status` trước khi sửa file.
8. **Không động vào project Supabase khác** — chỉ project `kosieqrqabcrvmvzbemt`.

## 2. Quy trình làm việc

1. Đọc [ROADMAP.md](./ROADMAP.md) → chọn việc đúng giai đoạn hiện tại.
2. Kiểm tra môi trường theo [ENVIRONMENT.md](./ENVIRONMENT.md) (Git, Supabase, env).
3. Làm việc incremental, giữ code hiện có, không recreate tùy tiện.
4. Thay đổi schema → viết migration trong `supabase/migrations/`, trình duyệt SQL, chờ duyệt.
5. Cập nhật tài liệu trong `docs/` **cùng commit** với thay đổi (kiến trúc, roadmap, env, deployment).
6. Báo cáo: việc đã xong, việc còn lại, bước triển khai. Chỉ tuyên bố "đã deploy" khi thực sự đã deploy.

## 3. Tiêu chuẩn code

- Next.js App Router + TypeScript; Server Components mặc định, Client Components chỉ khi cần tương tác.
- Tailwind + shadcn/ui + lucide-react; light theme, tối giản, không gradient/animation nặng.
- i18n bằng next-intl; mọi text public phải có cả `vi` và `en`; tiếng Việt là mặc định.
- Bảo vệ admin phía **server** (layout/action), không chỉ client middleware.
- RLS bật trên mọi bảng public-facing; public chỉ đọc published.
- Validate input ở ranh giới hệ thống (form, upload); không thêm validation thừa cho internal code.
- Ưu tiên sửa file có sẵn; không thêm abstraction/dependency khi không cần.
- **UI gotcha (Base UI / shadcn base-nova):** không có `asChild` → dùng `render`; Button render `<a>` phải kèm `nativeButton={false}`; lucide v1 không còn icon thương hiệu (`Github`...); Next 16 dùng `src/proxy.ts` thay `middleware.ts`. Chi tiết: [ARCHITECTURE.md §8](./ARCHITECTURE.md).

## 4. Supabase MCP

- Hiện chỉ có plugin `supabase:search_docs` (tra cứu tài liệu) — **không có** MCP quản trị DB/schema.
- Vì vậy: viết migration SQL có version, hướng dẫn chạy thủ công qua Supabase SQL Editor hoặc `supabase` CLI, và chờ chủ dự án duyệt/ap dụng.
- Trước khi thay đổi DB: inspect schema hiện tại; không đoán.

## 5. Kiểm thử trước khi báo hoàn thành

- `npm run lint` và `tsc --noEmit` pass.
- `npm run build` (production) pass.
- Test tay route `/vi`, `/en`, admin login, CRUD, upload, publish (xem Phase 5 trong ROADMAP).
- Với UI: chạy dev server và thao tác thật trong browser; nếu không test được UI thì nói rõ, không tuyên bố thành công.

## 6. Bản đồ tài liệu

Xem [README.md](./README.md) để biết mục lục đầy đủ. Khi thêm tài liệu mới, cập nhật mục lục trong README.