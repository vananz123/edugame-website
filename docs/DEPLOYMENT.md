# DEPLOYMENT — Triển khai EduGame Website

> Mục tiêu: GitHub + Vercel + Supabase Free tier. Chỉ đánh dấu "đã deploy" khi thực sự thực hiện.

## 1. Điều kiện trước khi deploy

- [ ] Code Phase 2–4 hoàn thành, `lint` + `tsc` + `build` pass.
- [ ] Supabase đã có schema + RLS + Storage policy (Phase 3).
- [ ] Đã tạo tài khoản admin trong Supabase Auth.
- [ ] Có tài khoản Vercel và (tùy chọn) tên miền.

## 2. Supabase production

1. **Auth redirect URLs** (Authentication → URL Configuration):
   - Site URL: `https://<domain-cua-ban>`
   - Redirect URLs thêm:
     - `https://<domain-cua-ban>/admin`
     - `https://<domain-cua-ban>/admin/**`
     - `http://localhost:3000/admin` (cho dev)
2. **Storage**: bucket `media` public read; policy upload/sửa/xóa chỉ admin.
3. **RLS**: xác nhận public chỉ đọc published; admin ghi. Test bằng publishable key.
4. Không expose service-role key; nếu dùng, chỉ đặt ở env server-only trên Vercel.

## 3. Vercel

1. Import repo `vananz123/edugame-website` vào Vercel.
2. Framework preset: **Next.js** (tự nhận diện).
3. Environment Variables (Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - (chỉ khi cần) `SUPABASE_SERVICE_ROLE_KEY` — đánh dấu server-only, không prefix `NEXT_PUBLIC_`.
4. Deploy. Build command mặc định `next build`.
5. Sau khi có domain: quay lại bước 2.1 cập nhật redirect URLs theo domain thật.

## 4. Biến môi trường — bảng tham chiếu

| Biến | Local (`.env.local`) | Vercel | Ghi chú |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | ✅ | public |
| `SUPABASE_SERVICE_ROLE_KEY` | chỉ khi cần | chỉ khi cần | server-only, không commit |

## 5. Sau deploy (smoke test)

- [ ] `/vi` và `/en` render đúng, language switcher hoạt động.
- [ ] `/admin/login` đăng nhập được; route `/admin/*` chặn người chưa đăng nhập.
- [ ] Sửa content → publish → trang public cập nhật (revalidate) không cần deploy lại.
- [ ] Upload ảnh hiển thị; link tải Windows đúng.
- [ ] Kiểm tra không lộ secret trong bundle client / response.

## 6. Rollback

- Vercel: redeploy deployment trước đó (Deployments → Promote to Production).
- DB: migration có version; rollback bằng migration ngược, **phải được duyệt** trước khi chạy.

## 7. Trạng thái

- ⬜ Chưa deploy (tính tới 2026-10-31). Repo mới có `.gitignore` + `docs/`.