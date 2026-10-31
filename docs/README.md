# Tài liệu dự án — EduGame Website

Thư mục này là **trung tâm tài liệu chuyển giao** của dự án. Mọi người (hoặc AI agent) tiếp nhận dự án chỉ cần đọc từ đây là nắm được toàn bộ bối cảnh, quyết định và việc cần làm.

## Mục lục

| Tài liệu | Nội dung |
|---|---|
| [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) | Đặc tả gốc đầy đủ của dự án (nguồn sự thật về yêu cầu) |
| [ROADMAP.md](./ROADMAP.md) | Lộ trình 5 giai đoạn + trạng thái hiện tại |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack, cấu trúc thư mục, i18n, schema Supabase, RLS |
| [AGENT_GUIDE.md](./AGENT_GUIDE.md) | Quy tắc bắt buộc cho AI agent / lập trình viên khi làm việc trên repo |
| [ENVIRONMENT.md](./ENVIRONMENT.md) | Biến môi trường, thông tin Supabase, cách chạy local |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Hướng dẫn triển khai Vercel + cấu hình Supabase production |
| [HANDOVER.md](./HANDOVER.md) | Checklist bàn giao: tài khoản, quyền truy cập, việc còn dở |

## Quy ước bảo trì tài liệu

- Khi thay đổi kiến trúc, schema, hoặc quy trình → cập nhật tài liệu tương ứng **trong cùng commit**.
- Khi hoàn thành / bắt đầu một giai đoạn → cập nhật [ROADMAP.md](./ROADMAP.md).
- Không lưu secret (key, token, mật khẩu) vào bất kỳ file nào trong `docs/`.
- Tài liệu viết bằng tiếng Việt; đặc tả gốc giữ nguyên tiếng Anh.

## Bắt đầu nhanh cho người mới

1. Đọc [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) để hiểu mục tiêu.
2. Đọc [HANDOVER.md](./HANDOVER.md) để biết trạng thái và quyền truy cập.
3. Đọc [AGENT_GUIDE.md](./AGENT_GUIDE.md) trước khi sửa code.
4. Xem [ROADMAP.md](./ROADMAP.md) để chọn việc tiếp theo.