# ARCHITECTURE — EduGame Website

> Tài liệu mô tả kiến trúc **dự kiến** (giai đoạn hiện tại repo chưa có code ứng dụng). Cập nhật file này khi kiến trúc thực tế thay đổi.

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
│   │   ├── [locale]/         # Public: /vi, /en
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx      # Landing single-page
│   │   └── admin/            # Admin (không nằm trong [locale])
│   │       ├── login/
│   │       ├── content/
│   │       ├── games/
│   │       ├── downloads/
│   │       └── settings/
│   ├── components/
│   │   ├── public/           # Navbar, Hero, GameShowcase, ...
│   │   ├── admin/            # Forms, tables, dialogs
│   │   └── ui/               # shadcn/ui
│   ├── lib/
│   │   ├── supabase/         # client.ts (browser), server.ts (RSC/actions)
│   │   ├── data/             # Data access functions (server-only)
│   │   └── auth.ts           # Kiểm tra admin server-side
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
| `key` | text PK | vd: `hero`, `about`, `overview`, `features`, `contact` |
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

> Không thêm bảng/quan hệ phức tạp. Mọi thay đổi schema đi qua `supabase/migrations/` và phải được duyệt trước khi áp dụng.

## 6. RLS & Security

- Bật RLS trên **tất cả** bảng public-facing.
- Policy đọc: `published = true` (hoặc `status = 'published'`) cho `anon` + `authenticated`.
- Policy ghi (insert/update/delete): chỉ admin. Cách xác định admin dự kiến: allowlist email trong bảng `admin_users` hoặc `app_metadata.role = 'admin'` — chốt khi làm Phase 3, không hardcode phía client.
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
6. Root layout nằm ở `src/app/[locale]/layout.tsx` (render `<html>`); không có `app/layout.tsx`. Khi thêm Admin (Phase 4) cần tái cấu trúc mixed-routing (xem AGENT_GUIDE).