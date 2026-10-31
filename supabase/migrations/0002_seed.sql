-- ============================================================
-- EduGame Website — Phase 3 seed (placeholder content)
-- Chạy SAU 0001_init.sql. Idempotent (on conflict do nothing).
-- Nội dung là PLACEHOLDER có đánh dấu, không phải dữ liệu thật.
-- ============================================================

-- ---------- site_content ----------
insert into public.site_content (key, content, status) values
('hero', $json${
  "vi": {"badge":"Ứng dụng Windows dành cho giáo viên","title":"Biến bài giảng thành trải nghiệm học tập tương tác","description":"EduGame Studio giúp giáo viên tạo game giáo dục từ giáo án và học liệu, với AI hỗ trợ soạn câu hỏi và hoạt động offline ngay trên lớp.","ctaPrimary":"Tải EduGame Studio","ctaSecondary":"Khám phá ứng dụng"},
  "en": {"badge":"A Windows app for teachers","title":"Turn lessons into interactive learning experiences","description":"EduGame Studio helps teachers create educational games from lesson plans and teaching materials, with AI-assisted question generation and an offline-first workflow.","ctaPrimary":"Download EduGame Studio","ctaSecondary":"Explore the app"}
}$json$::jsonb, 'published'),
('about', $json${
  "vi": {"name":"[Tên của bạn]","role":"Nhà giáo dục STEM & AI · Lập trình viên phần mềm","bio":"[Placeholder: Giới thiệu ngắn về nền tảng và kinh nghiệm của bạn trong giáo dục STEM/AI và phát triển phần mềm.]","motivation":"[Placeholder: Động lực xây dựng EduGame Studio — mong muốn giúp giáo viên tạo bài học tương tác dễ dàng hơn.]"},
  "en": {"name":"[Your name]","role":"STEM & AI educator · Software developer","bio":"[Placeholder: A short introduction about your background and experience in STEM/AI education and software development.]","motivation":"[Placeholder: Your motivation for building EduGame Studio — helping teachers create interactive lessons more easily.]"}
}$json$::jsonb, 'published'),
('product', $json${
  "vi": {"heading":"EduGame Studio là gì?","description":"Ứng dụng desktop Windows giúp giáo viên tạo game giáo dục từ bài giảng một cách nhanh chóng.","points":["Tạo game giáo dục từ giáo án và học liệu","AI hỗ trợ sinh câu hỏi","AI cục bộ, ưu tiên hoạt động offline","Ứng dụng desktop Windows","Trình chiếu trên lớp và chơi tương tác"]},
  "en": {"heading":"What is EduGame Studio?","description":"A Windows desktop app that helps teachers quickly create educational games from their lessons.","points":["Create educational games from lesson plans and materials","AI-assisted question generation","Local AI, offline-first workflow","Windows desktop application","Classroom presentation and interactive gameplay"]}
}$json$::jsonb, 'published'),
('features', $json${
  "vi": {"heading":"Tính năng nổi bật","items":[{"title":"Tạo game từ bài giảng","description":"Biến giáo án và học liệu thành game giáo dục."},{"title":"Soạn câu hỏi thủ công & AI","description":"Tự soạn câu hỏi hoặc để AI gợi ý nhanh chóng."},{"title":"Chơi tương tác trên lớp","description":"Tổ chức gameplay tương tác, trình chiếu trực tiếp."},{"title":"Hỗ trợ AI cục bộ","description":"Chạy AI ngay trên máy, không phụ thuộc đám mây."},{"title":"Thiết kế ưu tiên offline","description":"Hoạt động ổn định ngay cả khi không có mạng."},{"title":"Quy trình thân thiện với giáo viên","description":"Thao tác đơn giản, phù hợp giáo viên không chuyên kỹ thuật."}]},
  "en": {"heading":"Key features","items":[{"title":"Lesson-based game creation","description":"Turn lesson plans and materials into educational games."},{"title":"Manual & AI question creation","description":"Write questions yourself or let AI suggest them quickly."},{"title":"Interactive classroom gameplay","description":"Run interactive gameplay and present live in class."},{"title":"Local AI support","description":"Run AI on your own machine, no cloud dependency."},{"title":"Offline-first design","description":"Works reliably even without an internet connection."},{"title":"Teacher-friendly workflow","description":"Simple steps suited to non-technical teachers."}]}
}$json$::jsonb, 'published'),
('contact', $json${
  "vi": {"github":"https://github.com/vananz123","email":"[email@example.com]"},
  "en": {"github":"https://github.com/vananz123","email":"[email@example.com]"}
}$json$::jsonb, 'published')
on conflict (key) do nothing;

-- ---------- games (5 placeholder) ----------
insert into public.games (slug, title, description, sort_order, published) values
('game-1', $json${"vi":"[Game 1]","en":"[Game 1]"}$json$::jsonb, $json${"vi":"[Mô tả placeholder cho loại game thứ nhất.]","en":"[Placeholder description for the first game type.]"}$json$::jsonb, 1, true),
('game-2', $json${"vi":"[Game 2]","en":"[Game 2]"}$json$::jsonb, $json${"vi":"[Mô tả placeholder cho loại game thứ hai.]","en":"[Placeholder description for the second game type.]"}$json$::jsonb, 2, true),
('game-3', $json${"vi":"[Game 3]","en":"[Game 3]"}$json$::jsonb, $json${"vi":"[Mô tả placeholder cho loại game thứ ba.]","en":"[Placeholder description for the third game type.]"}$json$::jsonb, 3, true),
('game-4', $json${"vi":"[Game 4]","en":"[Game 4]"}$json$::jsonb, $json${"vi":"[Mô tả placeholder cho loại game thứ tư.]","en":"[Placeholder description for the fourth game type.]"}$json$::jsonb, 4, true),
('game-5', $json${"vi":"[Game 5]","en":"[Game 5]"}$json$::jsonb, $json${"vi":"[Mô tả placeholder cho loại game thứ năm.]","en":"[Placeholder description for the fifth game type.]"}$json$::jsonb, 5, true)
on conflict (slug) do nothing;

-- ---------- downloads (1 current, placeholder) ----------
insert into public.downloads (version, windows_url, file_size, system_requirements, release_notes, trial_url, published)
select '', '', '',
  $json${"vi":"[Placeholder: Windows 10/11 64-bit, dung lượng trống, RAM...]","en":"[Placeholder: Windows 10/11 64-bit, disk space, RAM...]"}$json$::jsonb,
  $json${"vi":"[Placeholder: nội dung changelog của phiên bản.]","en":"[Placeholder: changelog for this version.]"}$json$::jsonb,
  '', true
where not exists (select 1 from public.downloads);