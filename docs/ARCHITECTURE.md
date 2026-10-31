# ARCHITECTURE — EduGame Website

> Tài liệu mô tả kiến trúc **đã triển khai** (Phase 2–6). Cập nhật file này khi kiến trúc thực tế thay đổi.

## 1. Tech stack

| Lớp | Công nghệ | Ghi chú |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Server Components mặc định |
| UI | Tailwind CSS + shadcn/ui + lucide-react | Light theme, accent xanh/tím nhẹ |
| i18n | next-intl | `/vi` mặc định, `/en` |
| Database | Supabase PostgreSQL | Free tier |
| Auth | Supabase Auth | Chỉ admin, email + password |
| Storage | Supabase Storage | Bucket `media` cho ảnh |
| Hosting | Vercel | Free tier |
| Source control | GitHub | `vananz123/edugame-website` |

## 2. Cấu trúc thư mục dự kiến

```
edugame-website/
├── docs/                     # Tài liệu chuyển giao (bắt buộc cập nhật)
├── messages/
│   ├── vi.json               # UI strings tiếng Việt
│   └── en.json               # UI strings tiếng Anh
├── supabase/
│   └── migrations/           # SQL migration có version (nguồn sự thật schema)
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root <html lang> duy nhất (getLocale)
│   │   ├── [locale]/         # Public: /vi, /en
│   │   │   ├── layout.tsx    # NextIntlClientProvider (không <html>)
│   │   │   ├── page.tsx      # Landing single-page
│   │   │   └── docs/         # Danh sách + chi tiết hướng dẫn (Markdown)
│   │   ├── admin/
│   │   │   ├── login/        # Ngoài guard
│   │   │   └── (dashboard)/  # layout gọi requireAdmin()
│   │   │       ├── page.tsx  # Overview
│   │   │       ├── content/
│   │   │       ├── games/
│   │   │       ├── guides/
│   │   │       ├── downloads/
│   │   │       └── settings/
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── public/           # Navbar, Hero, GameShowcase, Markdown, ...
│   │   └── ui/               # shadcn/ui (Base UI)
│   ├── lib/
│   │   ├── supabase/         # public.ts, server.ts, client.ts
│   │   ├── data/             # types.ts, public.ts, guides.ts
│   │   ├── admin/            # revalidate.ts
│   │   ├── video.ts          # URL embed YouTube/Vimeo/Drive
│   │   └── auth.ts           # requireAdmin() server-side
│   └── proxy.ts              # next-intl locale (Next 16 "proxy", thay middleware)
├── .env.example              # Placeholder, được commit
├── .env.local                # Secret local, KHÔNG commit
└── AGENTS.md                 # Con trỏ tới docs/AGENT_GUIDE.md
```

## 3. i18n & routing

- `next-intl` với locale prefix: `/vi` (default), `/en`.
- UI strings tĩnh → `messages/{locale}.json`.
- Nội dung động (hero, games, downloads) → lưu DB dạng JSONB `{ "vi": ..., "en": ... }`.
- SEO: `generateMetadata` theo locale, `alternates.languages` cho hreflang, sitemap + robots.txt.

## 4. Data flow

```
Public visitor ──> RSC (static + revalidate) ──> lib/data (server Supabase client, publishable key)
                                                    │  RLS: chỉ đọc row published
Admin ──> /admin/* (server auth check) ──> server actions ──> Supabase (session user)
                                                    │  RLS: chỉ admin được ghi
                                              publish ──> revalidatePath/revalidateTag
```

- Không gọi DB mỗi page view: dùng static rendering + `revalidate` (ISR) và revalidate theo tag khi publish.
- Không cần backend server riêng; không dùng service-role key ở client. Chỉ dùng server-only env khi thật sự cần.

## 5. Schema Supabase (dự kiến, tối giản)

### `site_content`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| `key` | text PK | `hero`, `about`, `product`, `features`, `contact` |
| `content` | jsonb | `{ "vi": {...}, "en": {...} }` |
| `status` | text | `draft` \| `published` |
| `updated_at` | timestamptz | |

### `games`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | uuid PK | |
| `slug` | text unique | |
| `title` | jsonb | `{vi, en}` |
| `description` | jsonb | `{vi, en}` |
| `screenshot_path` | text | path trong bucket `media` |
| `video_url` | text null | demo video (optional) |
| `sort_order` | int | sắp xếp showcase |
| `published` | boolean | |
| `updated_at` | timestamptz | |

### `downloads`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | uuid PK | thường chỉ 1 row "current" |
| `version` | text | |
| `windows_url` | text | configurable, không hardcode |
| `file_size` | text | |
| `release_date` | date | |
| `system_requirements` | jsonb | `{vi, en}` |
| `release_notes` | jsonb | `{vi, en}` |
| `trial_url` | text null | |
| `published` | boolean | |

### `media`
| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | uuid PK | |
| `bucket` | text | mặc định `media` |
| `path` | text | |
| `alt` | jsonb | `{vi, en}` |
| `created_at` | timestamptz | |

### `guides` (Phase 6)
| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | uuid PK | |
| `slug` | text unique | dùng chung cho 2 locale |
| `title` | jsonb | `{vi, en}` |
| `summary` | jsonb | `{vi, en}` |
| `body_md` | jsonb | Markdown `{vi, en}` |
| `cover_path` | text null | path bucket `media` (prefix `guides/`) |
| `video_url` | text null | link YouTube/Vimeo/Google Drive |
| `category` | text null | nhóm hiển thị dạng badge |
| `sort_order` | int | thứ tự danh sách |
| `published` | boolean | |
| `updated_at` | timestamptz | |

> Không thêm bảng/quan hệ phức tạp. Mọi thay đổi schema đi qua `supabase/migrations/` và phải được duyệt trước khi áp dụng.

## 6. RLS & Security

- Bật RLS trên **tất cả** bảng public-facing.
- Policy đọc: `published = true` (hoặc `status = 'published'`) cho `anon` + `authenticated`.
- Policy ghi (insert/update/delete): chỉ admin. **Đã chốt:** allowlist email trong bảng `admin_users` (RLS bật, KHÔNG có policy select public) + hàm `public.is_admin()` `SECURITY DEFINER` so sánh `auth.jwt()->>'email'`. Policy ghi dùng `public.is_admin()`. App gọi `supabase.rpc("is_admin")` để kiểm tra (không select trực tiếp `admin_users` vì bị RLS chặn).
- Storage bucket `media`: public read; insert/update/delete chỉ admin.
- Server actions `/admin/*` luôn kiểm tra session + quyền admin phía server (middleware chỉ là lớp phụ).
- Service-role key (nếu cần) chỉ tồn tại trong env server-only, không bao giờ commit / lộ ra client.

## 7. Performance & SEO

- Server Components mặc định; Client Components chỉ khi cần tương tác.
- `next/image` cho ảnh; fallback khi media lỗi.
- Metadata + Open Graph song ngữ, sitemap, robots.txt.
- Tránh query DB thừa; cache + revalidate theo tag.

## 8. Lưu ý triển khai thực tế (cập nhật Phase 2)

Phiên bản thực tế đã cài:
- Next.js **16.4.3** (Turbopack), React **19.3.0**, Tailwind **v4**, TypeScript 5.
- shadcn/ui style **base-nova** → dùng **Base UI** (`@base-ui/react`), KHÔNG phải Radix.
- next-intl **4.x**, lucide-react **1.x**.
- Node.js **v26.13.0**, npm 11.20.

Gotcha bắt buộc nhớ khi code UI:
1. **Base UI không có `asChild`.** Dùng prop `render`: `<Button render={<a href="..." />}>...</Button>`.
2. Khi `Button` render thành phần tử không phải `<button>` (vd `<a>`), phải thêm `nativeButton={false}` nếu không Base UI báo lỗi console.
3. **lucide-react v1 đã bỏ icon thương hiệu** (`Github`, `Twitter`...). Dùng icon thay thế (`Code2`, `ExternalLink`...).
4. Next 16: file `middleware.ts` đã deprecated → dùng **`src/proxy.ts`** (đã đổi).
5. `next.config.ts` KHÔNG bật `cacheComponents`/`partialPrefetching` (giữ App Router chuẩn để ISR/revalidate đơn giản).
6. **Mixed routing (public có locale + admin không locale):** root layout duy nhất ở `src/app/layout.tsx` render `<html lang={await getLocale()}>` + fonts + globals.css. `src/app/[locale]/layout.tsx` chỉ bọc `NextIntlClientProvider` (KHÔNG render `<html>`). Admin nằm trong route group `src/app/admin/(dashboard)/` — `layout.tsx` của group gọi `await requireAdmin()`; `/admin/login` nằm ngoài group nên không bị guard. `src/proxy.ts` matcher loại trừ `admin` để next-intl không can thiệp route admin.

## 9. Phase 3–4 đã triển khai

**Supabase clients** (`src/lib/supabase/`):
- `public.ts`: `getPublicClient()` (anon, trả `null` nếu thiếu env) + `getPublicMediaUrl(path)`. Dùng cho RSC public, không đọc cookie.
- `server.ts`: `getServerClient()` — `createServerClient` (@supabase/ssr) với `cookies.getAll/setAll` (try/catch vì RSC không set được cookie). Dùng cho admin RSC + server actions.
- `client.ts`: `getBrowserClient()` — `createBrowserClient`.

**Data access** (`src/lib/data/`):
- `types.ts`: `Locale`, `HeroData`, `AboutData`, `ProductData`, `FeaturesData`, `GamesData`, `DownloadData`, `PublicData`.
- `public.ts`: `getPublicData(locale)` query song song `site_content`(published) + `games`(published, sort) + `downloads`(published, limit 1). Merge nội dung DB localized đè lên fallback `messages/{locale}.json` → trang public vẫn chạy khi DB trống/chưa áp migration.

**Auth** (`src/lib/auth.ts`): `getSessionUser()`; `requireAdmin()` → `redirect("/admin/login")` nếu không có user hoặc `rpc("is_admin")` lỗi/false. Mọi server action admin gọi `requireAdmin()` đầu tiên.

**Server actions + revalidate**: mỗi khu vực có `actions.ts` ("use server"); sau khi lưu gọi `revalidatePublic()` (`src/lib/admin/revalidate.ts`) = `revalidatePath("/vi")` + `("/en")`. Kết quả trả `{error?, ok?, path?}`; client dùng `sonner` toast + `router.refresh()`.

**Admin UI**:
- `content/`: `schemas.ts` (định nghĩa field theo key: text/textarea/list/items), `content-editor.tsx` (editor song ngữ schema-driven, Switch published, submit `content_json`), `content-manager.tsx` (chọn key), `page.tsx`.
- `games/`: `game-manager.tsx` (Table + Dialog form, upload screenshot, move up/down, delete), `actions.ts` (saveGame/deleteGame/moveGame/uploadScreenshot — validate PNG/JPEG/WEBP/GIF ≤5MB, path `games/<uuid>.<ext>`, ghi row `media`).
- `downloads/`: `download-form.tsx` + `actions.ts`.
- `settings/page.tsx`: tái dùng `ContentEditor` cho key `contact` + card thông tin admin (allowlist `admin_users` không sửa từ dashboard để tránh tự khóa).

> Media management: upload + preview trong form game; nút **Remove** xóa screenshot (storage object + row `media`); `deleteGame` và upload thay thế tự dọn ảnh cũ qua `removeMedia()` để không orphan. Chưa có trang duyệt media riêng — bổ sung nếu cần.
> Toaster admin đặt `position="top-right"` để không che nút Save ở cuối form.

## 10. Phase 6 — Docs / Hướng dẫn

Tính năng bổ sung ngoài brief gốc (2026-10-31): cho phép đăng tài liệu hướng dẫn dạng nhiều bài, song ngữ, có ảnh và video.

- Schema: bảng `guides` trong migration `0003_guides.sql` (RLS public đọc published + admin ghi qua `is_admin()`).
- Public: `/[locale]/docs` (danh sách) và `/[locale]/docs/[slug]` (chi tiết); SEO metadata + hreflang; có trong sitemap.
- Nội dung: Markdown (`react-markdown` + `remark-gfm`), **không** bật raw HTML → tránh XSS. Ảnh chèn bằng URL public của bucket `media` (admin upload sẵn để lấy URL).
- Video: nhận link YouTube / Vimeo / Google Drive, `src/lib/video.ts` trích ID và dựng URL embed; không nhận iframe thô.
- Admin `/admin/guides`: CRUD, cover upload (`guides/<uuid>.<ext>`), nút Copy snippet Markdown ảnh, draft/publish, sắp xếp; cover cũ tự dọn khi thay/xóa.
- Revalidate sau khi lưu: `revalidatePublic()` + `revalidatePath("/vi/docs", "layout")` / `("/en/docs", "layout")` (hàm `revalidateDocs()` trong `guides/actions.ts`).
- Khi bảng `guides` chưa tồn tại: trang public hiển thị empty state, admin hiển thị bảng rỗng (query lỗi được bỏ qua) — không crash.