# DEPLOYMENT — Triển khai EduGame Website

> Mục tiêu: GitHub + Vercel + Supabase Free tier. Chỉ đánh dấu "đã deploy" khi thực sự thực hiện.

## 1. Điều kiện trước khi deploy

- [x] Code Phase 2–6 hoàn thành, `lint` + `tsc` + `build` pass.
- [x] Supabase đã có schema + RLS + Storage policy (migration `0001_init.sql` + `0002_seed.sql` + `0003_guides.sql` **đã áp dụng** trong project `kosieqrqabcrvmvzbemt`).
- [x] Đã tạo tài khoản admin trong Supabase Auth + insert `admin_users` (✅ `dovanan.bth2017@gmail.com`).
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
- [ ] `/vi/docs`, `/en/docs` render; tạo guide published → hiện trên public, xóa → 404.
- [ ] Kiểm tra không lộ secret trong bundle client / response.

## 6. Rollback

- Vercel: redeploy deployment trước đó (Deployments → Promote to Production).
- DB: migration có version; rollback bằng migration ngược, **phải được duyệt** trước khi chạy.

## 7. Trạng thái

- ⬜ Chưa deploy (tính tới 2026-10-31). Code Phase 2–5 đã commit + push (mới nhất `ef71e8e`); code Phase 6 (Docs) đã test xong nhưng **chờ duyệt commit**. DB đã sẵn sàng (schema đầy đủ + admin + đã test CRUD), chỉ còn điền nội dung thật rồi deploy.