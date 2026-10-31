# PROJECT BRIEF — Build Personal Branding & EduGame Studio Website

> Đây là đặc tả gốc của dự án (nguồn sự thật về yêu cầu). Giữ nguyên nội dung; mọi thay đổi yêu cầu phải được chủ dự án duyệt và ghi chú ở cuối file.

## 1. Project Goal

Build a lightweight, modern, bilingual personal website to introduce the creator and promote EduGame Studio, a Windows desktop educational game creation application for teachers.

The website should be inspired by the clean, minimal, product-focused design of https://qoder.com/ without copying its branding or exact layout.

Primary goals:
- Personal branding for a STEM/AI educator and software developer.
- Promote EduGame Studio and its features.
- Allow visitors to download the Windows application and access trial/demo information.
- Provide a secure Admin dashboard to manage website content without editing code.
- Keep the project simple, lightweight, maintainable, and free-tier friendly.

## 2. Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- next-intl for Vietnamese and English
- Supabase PostgreSQL for content data
- Supabase Auth for Admin authentication
- Supabase Storage for images
- Vercel for hosting
- GitHub for source control

Use the existing project if one is already initialized. Do not unnecessarily recreate or replace the current codebase.

## 3. Bilingual Website

Create localized routes:
- `/vi`
- `/en`

Requirements:
- Vietnamese is the default language.
- Provide a language switcher in the navbar.
- Use shared components and localized content.
- Keep SEO metadata localized.
- Support localized page titles, descriptions, navigation and CTA labels.

## 4. Public Landing Page

Create a single-page landing website with the following sections:

### Navbar
- Personal/product logo
- About
- EduGame Studio
- Features
- Download
- Language switcher
- Responsive mobile menu

### Hero
- Strong headline about transforming lessons into interactive learning experiences.
- Short product description.
- Primary CTA: Download EduGame Studio.
- Secondary CTA: Explore the application.
- Large application screenshot or product mockup.

### Personal Introduction
- Introduce the creator as a STEM and AI educator and software developer.
- Brief background and motivation for building EduGame Studio.
- Links to GitHub and contact information.

### Product Overview
Explain EduGame Studio:
- Create educational games from lesson plans and teaching materials.
- AI-assisted question generation.
- Local AI and offline-first workflow.
- Windows desktop application.
- Classroom presentation and interactive gameplay.

### Game Showcase
- Showcase the five existing game types.
- Each game has a title, description, screenshot and optional demo video.
- Use responsive cards or a clean visual gallery.
- Make it easy to add more game types later.

### Features
- Lesson-based game creation.
- Manual and AI-assisted question creation.
- Interactive classroom gameplay.
- Local AI support.
- Offline-first design.
- Teacher-friendly workflow.

### Download Section
- Windows download button.
- Version number.
- File size.
- System requirements.
- Release notes/changelog.
- Trial/demo information.
- Use configurable download URLs.
- Do not invent actual download links or release metadata.

### Footer
- Personal links.
- Contact information.
- Product links.
- Copyright.

## 5. Admin Dashboard

Create a separate Admin interface within the same Next.js project.

Routes:
- `/admin/login`
- `/admin`
- `/admin/content`
- `/admin/games`
- `/admin/downloads`
- `/admin/settings`

Admin requirements:
- Secure authentication using Supabase Auth.
- Only authorized administrator accounts can access the dashboard.
- Protect all Admin pages and server-side actions.
- Do not rely only on client-side route protection.
- Use a separate Admin layout and navigation.
- Use shadcn/ui forms, tables, dialogs, buttons and notifications.

### Content Management
Allow the administrator to edit:
- Hero title, description and CTA labels.
- Personal introduction.
- Product overview.
- Features.
- Contact and social links.
- Vietnamese and English content.

### Game Management
Allow the administrator to:
- Create, edit, delete and reorder game entries.
- Manage game titles and descriptions in both languages.
- Upload and replace screenshots.
- Add optional demo video URLs.
- Publish or hide individual games.

### Download Management
Allow the administrator to:
- Update the current version.
- Set Windows download URL.
- Set file size and release date.
- Edit system requirements.
- Manage release notes.
- Set trial/demo URLs.
- Publish or hide download information.

### Media Management
- Upload images to Supabase Storage.
- Preview uploaded images.
- Replace or delete media.
- Validate file type and size.
- Use optimized images on the public website.

### Publishing
- Provide a preview of content before publishing.
- Save draft and publish changes.
- Revalidate public pages after publishing.
- Do not require a new deployment for normal content updates.

## 6. Supabase Architecture

Use Supabase for:
- PostgreSQL content database.
- Admin authentication.
- Image storage.

Create a simple, maintainable schema, for example:
- `site_content`
- `games`
- `downloads`
- `media`

Use JSONB or structured localized fields for Vietnamese and English content where appropriate.

Requirements:
- Use database migrations for schema changes.
- Enable Row Level Security on tables exposed through Supabase.
- Public visitors can read published content only.
- Only authorized Admin users can create, update or delete content.
- Restrict Storage uploads and modifications to authorized Admin users.
- Never expose the Supabase service-role key in client-side code.
- Use environment variables for all credentials.
- Do not create unnecessary tables or complex relationships.

## 7. GitHub and Environment

- Work within the existing Git repository.
- Preserve existing Git history and configuration.
- Do not overwrite an existing repository.
- Check Git status before modifying files.
- Never commit `.env.local`, credentials, tokens or secrets.
- Ensure `.env.local` is included in `.gitignore`.
- Use environment variables for Supabase configuration.
- Provide an `.env.example` containing placeholder values only.

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Use server-only environment variables for privileged operations only when strictly necessary.

## 8. Supabase MCP Usage

If Supabase MCP is available:
- Verify that it is connected to the intended Supabase project.
- Inspect existing project metadata and database tables before making changes.
- Prefer version-controlled SQL migrations for schema changes.
- Review migration SQL before applying it.
- Do not modify unrelated projects or data.
- Do not expose secrets in logs or responses.

If MCP is unavailable, prepare migration files and clearly explain the manual steps required.

## 9. Design Requirements

- Minimal, premium, modern technology aesthetic.
- Inspired by Qoder's whitespace, typography and product-focused presentation.
- Light theme by default.
- Neutral background with restrained blue or violet accents.
- Large readable headings and concise copy.
- Subtle animations and hover effects.
- Avoid excessive gradients, heavy animations and unnecessary dependencies.
- Responsive on desktop, tablet and mobile.
- Accessible contrast and keyboard navigation.
- Keep the public website fast and lightweight.

## 10. Performance and SEO

- Use Next.js Server Components by default.
- Use Client Components only when interaction requires them.
- Use static rendering and revalidation for public pages.
- Optimize images with Next.js Image where appropriate.
- Avoid unnecessary database queries on every page view.
- Add metadata, Open Graph tags, sitemap and robots.txt.
- Add localized SEO metadata for Vietnamese and English.
- Ensure public pages remain accessible if optional media fails to load.

## 11. Deployment

Prepare the project for:
- GitHub source control.
- Vercel deployment.
- Supabase Free tier.

Requirements:
- Provide deployment instructions.
- Document required environment variables.
- Configure Supabase redirect URLs for Admin authentication.
- Ensure production environment variables are not committed.
- Do not claim deployment is complete unless it has actually been performed.

## 12. Implementation Workflow

### Phase 1 — Environment Inspection
- Inspect the current project structure.
- Verify Next.js, Tailwind CSS and shadcn/ui setup.
- Check Git repository and remote.
- Verify Supabase configuration and MCP availability.
- Report missing credentials or setup steps.
- Do not expose secret values.

### Phase 2 — Public Website
- Implement the bilingual landing page.
- Build reusable sections and responsive layouts.
- Use realistic placeholder screenshots only where actual assets are unavailable.
- Keep content configurable.

### Phase 3 — Supabase
- Design and create the minimal database schema.
- Add migration files.
- Configure RLS and Storage policies.
- Implement data access functions.
- Connect public pages to published content.

### Phase 4 — Admin Dashboard
- Implement authentication and server-side authorization.
- Build content, game, download and media management.
- Add draft/publish workflow.
- Add validation and error handling.

### Phase 5 — Final Verification
- Run linting and TypeScript checks.
- Run the production build.
- Test Vietnamese and English routes.
- Test Admin authentication and authorization.
- Test content editing and publishing.
- Test image upload and download links.
- Verify that secrets are not exposed.
- Fix all errors before completion.

## Important Constraints

- Do not fabricate personal information, testimonials, download counts or product statistics.
- Use placeholders for unknown personal details and actual download URLs.
- Do not build a separate backend server unless genuinely necessary.
- Do not add payment systems, analytics or unnecessary features.
- Do not introduce complex CMS architecture.
- Do not make destructive database changes without approval.
- Do not commit or push code without explicit approval.
- Keep the project easy for one person to maintain.

Implement the actual website and Admin dashboard, not just a mockup. Work incrementally, preserve existing code, and report completed work, remaining tasks and deployment instructions.

---

## Ghi chú thay đổi yêu cầu

| Ngày | Thay đổi | Người duyệt |
|---|---|---|
| 2026-10-31 | Lưu đặc tả gốc vào `docs/PROJECT_BRIEF.md`; bổ sung yêu cầu thư mục `docs/` phục vụ chuyển giao | Chủ dự án |