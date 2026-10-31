# DEPLOYMENT — Triển khai EduGame Website

> Mục tiêu: GitHub + Vercel + Supabase Free tier. Chỉ đánh dấu "đã deploy" khi thực sự thực hiện.

## 1. Điều kiện trước khi deploy

- [x] Code Phase 2–6 hoàn thành, `lint` + `tsc` + `build` pass.
- [x] Supabase đã có schema + RLS + Storage policy (migration `0001_init.sql` + `0002_seed.sql` + `0003_guides.sql` **đã áp dụng** trong project `kosieqrqabcrvmvzbemt`).
- [x] Đã tạo tài khoản admin trong Supabase Auth + insert `admin_users` (✅ `dovanan.bth2017@gmail.com`).
- [x] Có tài khoản Vercel (`vananz123`, scope `vananz123s-projects`) và domain mặc định `edugame-website-one.vercel.app`. Tên miền riêng: chưa dùng.

## 2. Supabase production

1. **Auth redirect URLs** (Authentication → URL Configuration):
   - Admin đăng nhập bằng **email + password** (`signInWithPassword`, `src/app/admin/login/actions.ts`) → **không** cần Site URL/Redirect URL để login hoạt động.
   - Nếu sau này dùng OAuth / magic link thì mới cấu hình:
     - Site URL: `https://edugame-website-one.vercel.app`
     - Redirect URLs: `https://edugame-website-one.vercel.app/admin`, `https://edugame-website-one.vercel.app/admin/**`, `http://localhost:3000/admin`
2. **Storage**: bucket `media` public read; policy upload/sửa/xóa chỉ admin. ✅
3. **RLS**: xác nhận public chỉ đọc published; admin ghi. ✅ (test Phase 3–4)
4. Không expose service-role key; nếu dùng, chỉ đặt ở env server-only trên Vercel. ✅ project này không dùng service-role key.

## 3. Vercel — TRẠNG THÁI THỰC TẾ (đã deploy 2026-10-31)

1. Project: `vananz123s-projects/edugame-website` (id `prj_WEOJfzQYw6zlBtJYqmH6DFKzqYnZ`), preset **Next.js**, Node.js 26.x, region `iad1`.
2. **Git integration đã bật** cho `vananz123/edugame-website` (`vercel git connect` báo "already connected") → **mỗi `git push` lên `main` tự build + deploy production**, không cần lệnh thủ công.
3. Environment Variables đã set cho **Production + Preview** (kiểm chứng bằng `vercel env pull` rồi so với `.env.local` — khớp):
   - `NEXT_PUBLIC_SUPABASE_URL` → `https://kosieqrqabcrvmvzbemt.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → same value as local (không in ra docs/log)
   - `NEXT_PUBLIC_SITE_URL` → `https://edugame-website-one.vercel.app`
4. Project còn có env của **Vercel Storage for Postgres** (`POSTGRES_*`, `SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`) do tích hợp cũ tạo. **Code ứng dụng không đọc các biến này** (chỉ dùng `NEXT_PUBLIC_SUPABASE_*`), nên không ảnh hưởng; có thể xóa trong Dashboard nếu muốn gọn.
5. URL production: `https://edugame-website-one.vercel.app` (alias khác: `edugame-website-vananz123s-projects.vercel.app`).
6. Cách chạy CLI khi cần (Git Bash không có `vercel` trên PATH):
   `"/c/Program Files/nodejs/node.exe" "$APPDATA/npm/node_modules/vercel/dist/vc.js" <command>`
   Lệnh hay dùng: `vercel ls`, `vercel inspect <url>`, `vercel env ls`, `vercel redeploy <url>`.
   Lưu ý: `vercel env pull <file>` **mặc định ghi vào `.env.local`** — luôn truyền tên file tạm rồi xóa, không in giá trị secret ra output.
7. Nếu gắn domain riêng: thêm domain ở Vercel → DNS → cập nhật `NEXT_PUBLIC_SITE_URL` sang domain mới → redeploy.

## 4. Biến môi trường — bảng tham chiếu

| Biến | Local (`.env.local`) | Vercel | Ghi chú |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | ✅ | public |
| `NEXT_PUBLIC_SITE_URL` | ❌ (dev dùng localhost) | ✅ | domain production, cho sitemap/robots/canonical |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ không dùng | ❌ không dùng | project này không cần |

## 5. Sau deploy (smoke test)

- [x] `/vi` và `/en` render đúng (200); `/vi/games`, `/vi/about`, `/en/features`, `/vi/docs` = 200. Language switcher đã test local (client-side) và route được giữ nguyên khi đổi ngôn ngữ.
- [x] `/admin` trên production → 307 `/admin/login`; trang login render 200. ⬜ Đăng nhập thật trên production cần chủ dự án nhập mật khẩu.
- [ ] Sửa content → publish → trang public cập nhật (revalidate) không cần deploy lại. (đã xác minh local, chưa chạy lại trên production)
- [ ] Upload ảnh hiển thị; link tải Windows đúng — chờ nội dung thật.
- [x] `/vi/docs`, `/en/docs` render; hành vi tạo/xóa guide đã test ở Phase 6.
- [x] Không lộ secret: `grep` source không có service-role key; client bundle production không chứa chuỗi JWT/`service_role`.

## 6. Rollback

- Vercel: redeploy deployment trước đó (Deployments → Promote to Production).
- DB: migration có version; rollback bằng migration ngược, **phải được duyệt** trước khi chạy.

## 7. Trạng thái

- ✅ **ĐÃ DEPLOY** (2026-10-31): production `https://edugame-website-one.vercel.app`, code `0f504d3` (Phase 7, tách trang + giao diện trắng–đen), build qua Git integration.
- ✅ Env production/preview đã cấu hình + smoke test (mục 3, 5).
- ⬜ Việc còn lại: chủ dự án đăng nhập `/admin/login` trên production để xác minh, điền nội dung thật qua `/admin`, (tùy chọn) gắn domain riêng.