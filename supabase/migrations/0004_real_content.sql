-- ============================================================
-- EduGame Website — Phase 8: NỘI DUNG THẬT (thay placeholder)
-- Chạy SAU 0001_init.sql + 0002_seed.sql + 0003_guides.sql
-- trong Supabase SQL Editor, project kosieqrqabcrvmvzbemt.
--
-- PHẢI được chủ dự án duyệt trước khi áp dụng (AGENTS.md #4).
--
-- An toàn: CHỈ ghi thêm / cập nội dung, KHÔNG xoá row, KHÔNG đổi schema.
--   - site_content: upsert 3 khoá hero / product / features
--     (ghi đè chữ đang có của đúng 3 khoá này; `about` và `contact` giữ nguyên).
--   - games: upsert theo slug game-1..game-5, chỉ đổi title/description
--     (giữ nguyên screenshot_path, video_url, sort_order, published đang có).
--   - downloads: cập nhật row mới nhất; nếu bảng trống thì chèn 1 row.
--     windows_url KHÔNG bị ghi đè — chủ dự án dán link tải thật vào /admin
--     khi bản phát hànhpublic sẵn sàng.
--   - guides: upsert 2 bài hướng dẫn theo slug.
--
-- Nguồn sự thật: tài liệu dự án EduGame Studio (STATUS/ROADMAP/ARCHITECTURE/
-- DECISIONS/BENCHMARKS/PROJECT_MAP/implementation-plan, cập nhật 2026-11-04).
-- Không bịa số liệu: model sizes, RAM, dung lượng bộ cài đều lấy từ docs.
-- ============================================================

-- ---------- site_content ----------
insert into public.site_content (key, content, status) values
('hero', $json${
  "vi": {"badge":"Ứng dụng Windows dành cho giáo viên","title":"Biến giáo án thành trò chơi tương tác ngay trên lớp","description":"EduGame Studio đọc giáo án và học liệu của bạn, gợi ý câu hỏi bằng AI chạy ngay trên máy, rồi dựng thành năm loại trò chơi — vẫn chơi được khi lớp không có mạng.","ctaPrimary":"Tải EduGame Studio","ctaSecondary":"Khám phá ứng dụng"},
  "en": {"badge":"A Windows app for teachers","title":"Turn lesson plans into interactive games your class can play","description":"EduGame Studio reads your lesson plans and teaching materials, drafts questions with AI running on your own machine, and builds five kinds of games that keep working when the classroom has no internet.","ctaPrimary":"Download EduGame Studio","ctaSecondary":"Explore the app"}
}$json$::jsonb, 'published'),
('product', $json${
  "vi": {"heading":"EduGame Studio là gì?","description":"Ứng dụng desktop Windows giúp giáo viên biến giáo án và học liệu thành trò chơi chơi được ngay trên lớp — kể cả khi không có mạng.","points":["Đọc giáo án từ file DOCX, PDF, PPTX, TXT, MD hoặc dán trực tiếp","Năm loại trò chơi dựng sẵn, màn chơi toàn màn hình, có hình 3D","AI cục bộ chạy bằng llama.cpp — không cần tài khoản, không gửi bài học đi xa","Game và lịch sử lưu trong SQLite trên máy, xuất ra file .egame để chép qua USB","Trình chiếu ra màn hình thứ hai và cho học sinh trả lời trên điện thoại qua LAN"]},
  "en": {"heading":"What is EduGame Studio?","description":"A Windows desktop app that turns lesson plans and teaching materials into games your class can play — even without internet.","points":["Reads lesson plans from DOCX, PDF, PPTX, TXT or MD files, or pasted text","Five ready-made game types with fullscreen play and 3D visuals","Local AI on llama.cpp — no account needed, your lesson never leaves the machine","Games and history stored in SQLite, exported as .egame files you can move by USB","Presents to a second screen and lets students answer on their phones over LAN"]}
}$json$::jsonb, 'published'),
('features', $json${
  "vi": {"heading":"Tính năng nổi bật","items":[{"title":"Tạo game theo năm bước","description":"Hướng dẫn từng bước từ giáo án thô đến bản nháp trò chơi; đổi loại game mà không phải sinh lại nội dung."},{"title":"AI chạy ngay trên máy","description":"llama.cpp với Qwen3.5 bản 2B hoặc 4B tự tải, kiểm tra SHA-256 và chỉ lắng nghe 127.0.0.1 — nội dung bài học không rời khỏi máy."},{"title":"Sân chơi cho cả lớp","description":"Màn chơi toàn màn hình, trình chiếu ra màn hình thứ hai, thi đấu theo đội và học sinh trả lời trên điện thoại qua mạng LAN."},{"title":"Soạn câu hỏi theo cách của bạn","description":"Tự viết, nhập CSV/XLSX, dán văn bản (bảy dạng câu, phát hiện câu trùng) hoặc để AI gợi ý — cả đường cục bộ lẫn đám mây."},{"title":"Ưu tiên offline","description":"Tạo, chơi, chấm điểm và xem lại lịch sử đều chạy khi mất mạng; game lưu trong SQLite và xuất được ra file .egame."},{"title":"Hồ sơ phong cách riêng","description":"Giọng điệu, độ hài hước, mỹ thuật và ví dụ yêu thích của giáo viên được AI dùng làm mặc định khi sinh câu hỏi."}]},
  "en": {"heading":"Key features","items":[{"title":"Five-step game creation","description":"Guided steps from a raw lesson plan to a drafted game; switch game type without regenerating the content."},{"title":"AI on your own machine","description":"llama.cpp with Qwen3.5 2B or 4B, downloaded automatically, verified by SHA-256 and bound to 127.0.0.1 — lesson text never leaves the computer."},{"title":"Built for the whole class","description":"Fullscreen gameplay, output to a second screen, team battles, and students answering on their phones over the LAN."},{"title":"Author questions your way","description":"Write them yourself, import CSV/XLSX, paste text (seven question types, duplicate detection) or let AI draft them — locally or in the cloud."},{"title":"Offline-first","description":"Creating, playing, scoring and reviewing history all work without a connection; games live in SQLite and export to .egame."},{"title":"Your personal teaching style","description":"Tone, humour, art preferences and favourite examples are stored per teacher and used as AI defaults when generating questions."}]}
}$json$::jsonb, 'published')
on conflict (key) do update
  set content = excluded.content,
      status  = 'published',
      updated_at = now();

-- ---------- games: 5 thể loại thật ----------
insert into public.games (slug, title, description, sort_order, published) values
('game-1',
 $json${"vi":"Đấu trường tri thức","en":"Knowledge Arena"}$json$::jsonb,
 $json${"vi":"Hỏi đáp nhiều phương án, phản hồi đúng/sai kèm giải thích. Năm cách tính điểm: cơ bản, tốc độ, theo độ khó, thi đấu đội (2–6 đội) và luyện tập; khi toàn màn hình có thêm chế độ Xây nhà.","en":"Multiple-choice questions with right/wrong feedback and explanations. Five scoring modes: basic, speed, by difficulty, team battle (2–6 teams) and practice; fullscreen play adds the House Building mode."}$json$::jsonb,
 1, true),
('game-2',
 $json${"vi":"Thử thách tình huống","en":"Scenario Challenge"}$json$::jsonb,
 $json${"vi":"Câu chuyện phân nhánh: mỗi lựa chọn có hậu quả và ảnh hưởng các tình huống sau. Chấm theo chất lượng quyết định hoặc đúng/sai, kèm câu hỏi thảo luận.","en":"A branching story where each choice has consequences and affects later situations. Scored on decision quality or simple right/wrong, with discussion questions."}$json$::jsonb,
 2, true),
('game-3',
 $json${"vi":"Ghép cặp kiến thức","en":"Knowledge Matching"}$json$::jsonb,
 $json${"vi":"Bốn cách chơi: ghép hai cột, lật thẻ ghi nhớ, phân loại kiến thức và “Chòm sao tri thức” — bảng sao 3D, kéo thẻ đáp án vào đúng ngôi sao.","en":"Four ways to play: two-column matching, memory flip cards, categorising, and “Knowledge Constellation” — a 3D star board where students drag answer cards onto the right star."}$json$::jsonb,
 3, true),
('game-4',
 $json${"vi":"Truy tìm kho báu","en":"Treasure Hunt"}$json$::jsonb,
 $json${"vi":"Hành trình nhiều chặng: câu đố, nhiệm vụ rồi thử thách tổng kết, có bản đồ tiến trình, gợi ý khi trả lời sai, nhánh lựa chọn và nhiều kết thúc.","en":"A multi-stage journey: puzzles, missions and a final challenge, with a progress map, hints after wrong answers, branch choices and several endings."}$json$::jsonb,
 4, true),
('game-5',
 $json${"vi":"Đường đua tri thức","en":"Learning Race"}$json$::jsonb,
 $json${"vi":"Các đội lần lượt trả lời để tiến trên đường đua: dễ +1, trung bình +2, khó +3, cùng ô tăng tốc, ô may mắn và ô thử thách; tính kèm điểm kiến thức.","en":"Teams take turns answering to advance on a race track: easy +1, medium +2, hard +3, plus boost, lucky and challenge cells, alongside knowledge points."}$json$::jsonb,
 5, true)
on conflict (slug) do update
  set title       = excluded.title,
      description = excluded.description;

-- ---------- downloads: 0.4.0 ----------
-- Chủ dự án dán windows_url thật qua /admin khi có link tải công khai.
update public.downloads
set version      = '0.4.0',
    file_size    = '87,9 MB (92.241.504 byte)',
    release_date = date '2026-11-04',
    system_requirements = jsonb_build_object(
      'vi', 'Windows 10 hoặc 11, bản 64-bit (x64) — chưa có bản ARM64. Bộ cài ~88 MB. Muốn dùng AI cục bộ: máy tối thiểu 4 GB RAM cho model 2B hoặc 8 GB cho model 4B, cộng vài GB dung lượng trống (Qwen3.5-2B ~1,2 GB + runtime ~19 MB). Bộ cài chưa được ký số nên SmartScreen có thể cảnh báo; hãy đối chiếu SHA-256 trước khi chạy.',
      'en', 'Windows 10 or 11, 64-bit (x64) — no ARM64 build yet. The installer is about 88 MB. For local AI: 4 GB RAM minimum for the 2B model or 8 GB for the 4B model, plus a few GB of free disk (Qwen3.5-2B ~1.2 GB + runtime ~19 MB). The installer is not code-signed, so SmartScreen may warn; verify the SHA-256 before running it.'
    ),
    release_notes = jsonb_build_object(
      'vi', '0.4.0 (04/11/2026): logo mới cho bộ cài, shortcut và cửa sổ; trang Giáo án chia hai cột với khung chat trả lời kèm trích dẫn nguồn; “Chòm sao tri thức” — bảng sao 3D kéo thả cho Ghép cặp kiến thức; cỡ chữ và màu bị khoá sàn (tối thiểu 11 px, tương phản 4,5:1) ở cả giao diện sáng và tối. Bản đóng gói này chưa được cài thử trên máy sạch.',
      'en', '0.4.0 (Nov 4, 2026): new logo across installer, shortcut and window; the Lessons page split into two columns with a chat panel that answers with source citations; “Knowledge Constellation” — a draggable 3D star board for Knowledge Matching; type size and colour contrast floored at 11 px and 4.5:1 in both light and dark themes. This packaged build has not been installed on a clean machine yet.'
    ),
    updated_at = now()
where id = (select id from public.downloads order by updated_at desc limit 1);

insert into public.downloads (version, windows_url, file_size, release_date, system_requirements, release_notes, published)
select '0.4.0', '', '87,9 MB (92.241.504 byte)', date '2026-11-04',
  jsonb_build_object(
    'vi', 'Windows 10 hoặc 11, bản 64-bit (x64) — chưa có bản ARM64. Bộ cài ~88 MB. Muốn dùng AI cục bộ: máy tối thiểu 4 GB RAM cho model 2B hoặc 8 GB cho model 4B, cộng vài GB dung lượng trống (Qwen3.5-2B ~1,2 GB + runtime ~19 MB). Bộ cài chưa được ký số nên SmartScreen có thể cảnh báo; hãy đối chiếu SHA-256 trước khi chạy.',
    'en', 'Windows 10 or 11, 64-bit (x64) — no ARM64 build yet. The installer is about 88 MB. For local AI: 4 GB RAM minimum for the 2B model or 8 GB for the 4B model, plus a few GB of free disk (Qwen3.5-2B ~1.2 GB + runtime ~19 MB). The installer is not code-signed, so SmartScreen may warn; verify the SHA-256 before running it.'
  ),
  jsonb_build_object(
    'vi', '0.4.0 (04/11/2026): logo mới cho bộ cài, shortcut và cửa sổ; trang Giáo án chia hai cột với khung chat trả lời kèm trích dẫn nguồn; “Chòm sao tri thức” — bảng sao 3D kéo thả cho Ghép cặp kiến thức; cỡ chữ và màu bị khoá sàn (tối thiểu 11 px, tương phản 4,5:1) ở cả giao diện sáng và tối. Bản đóng gói này chưa được cài thử trên máy sạch.',
    'en', '0.4.0 (Nov 4, 2026): new logo across installer, shortcut and window; the Lessons page split into two columns with a chat panel that answers with source citations; “Knowledge Constellation” — a draggable 3D star board for Knowledge Matching; type size and colour contrast floored at 11 px and 4.5:1 in both light and dark themes. This packaged build has not been installed on a clean machine yet.'
  ),
  true
where not exists (select 1 from public.downloads);

-- ---------- guides: 2 bài hướng dẫn thật ----------
insert into public.guides (slug, title, summary, body_md, category, sort_order, published) values
(
  'tao-game-dau-tien',
  jsonb_build_object(
    'vi', 'Tạo game đầu tiên từ giáo án',
    'en', 'Creating your first game from a lesson plan'
  ),
  jsonb_build_object(
    'vi', 'Năm bước đi từ một file giáo án đến trò chơi chiếu được trước lớp, kèm cách nhập câu hỏi có sẵn.',
    'en', 'The five steps from a lesson file to a game you can run in class, plus how to import questions you already have.'
  ),
  jsonb_build_object(
    'vi', $mdvi_a$## Bạn cần gì

EduGame Studio chạy trên Windows 10 hoặc 11, bản 64-bit. Chưa có bản ARM64.

## Năm bước tạo game

1. **Nạp tài liệu.** Ứng dụng đọc được DOCX, PDF, PPTX, TXT, MD — bạn cũng có thể dán văn bản trực tiếp. Nếu bạn dán *ngân hàng câu hỏi* hoặc *dàn ý bài giảng* thay vì giáo án, ứng dụng tự nhận diện loại đầu vào và đi đường tương ứng.
2. **Bóc cấu trúc.** Bài học được chia chương/mục để phần sau chỉ gửi cho AI những đoạn liên quan, thay vì cả tài liệu.
3. **Phân tích và gợi ý.** AI tóm tắt, tách mục tiêu và khái niệm, rồi gợi ý loại trò chơi. Việc *chọn loại game không gọi model lần hai* — đổi thể loại chỉ dựng lại từ bản nháp đã có, nên không mất nội dung.
4. **Cấu hình câu hỏi.** Sửa phương án, đáp án, lời giải thích, độ khó và điểm. Đây là bước bắt buộc: **giáo viên phải duyệt lại tính chính xác trước khi dùng trên lớp**.
5. **Xem trước và lưu.** Game được kiểm tra theo schema của từng thể loại rồi lưu vào thư viện trên máy.

## Nhập câu hỏi bạn đã có

Tải lên CSV hoặc XLSX, hoặc dán thẳng văn bản. Ứng dụng hiểu bảy dạng câu (trắc nghiệm, đúng/sai, điền từ, trả lời ngắn, và các dạng dùng cho ghép cặp / tình huống), làm sạch ký hiệu thừa, báo khi có câu trùng và gợi ý thể loại game phù hợp với dữ liệu bạn vừa nhập. Cảnh báo trùng lặp là *tư vấn*, không chặn bạn lưu.

## Mang vào lớp

- **Toàn màn hình** cho màn chơi, **trình chiếu ra màn hình thứ hai** cho học sinh nhìn theo.
- **Thi đấu theo đội** (2–6 đội) và chế độ **chơi qua mạng LAN**: học sinh trả lời trên điện thoại, máy giáo viên làm trọng tài.
- Muốn chuyển game sang máy khác: **xuất file `.egame`**, chép qua USB, nhập ở máy kia. File này không phụ thuộc vào cơ sở dữ liệu của ứng dụng.
$mdvi_a$,
    'en', $mden_a$## What you need

EduGame Studio runs on Windows 10 or 11, 64-bit. There is no ARM64 build yet.

## The five steps

1. **Load the material.** The app reads DOCX, PDF, PPTX, TXT and MD — you can also paste text. If you paste a *question bank* or a *lesson outline* instead of a full plan, the app detects the input type and takes the matching path.
2. **Structure the document.** The lesson is split into sections so later steps only send the relevant parts to the model, not the whole file.
3. **Analyse and recommend.** The AI summarises, extracts objectives and concepts, then suggests game types. **Switching genre does not call the model again** — it rebuilds from the draft you already have, so nothing is lost.
4. **Configure the questions.** Edit options, answers, explanations, difficulty and points. This step is mandatory: **teachers must review educational accuracy before using the game in class**.
5. **Preview and save.** The game is validated against its type schema, then stored in your local library.

## Import questions you already have

Upload a CSV or XLSX file, or paste plain text. The app understands seven question types (multiple choice, true/false, fill-in, short answer, plus the formats used by matching and scenarios), cleans stray symbols, flags duplicates and suggests which game type fits what you pasted. Duplicate warnings are advice — they never block saving.

## Bringing it to class

- **Fullscreen** gameplay, with **presentation output to a second screen** for students to follow.
- **Team battles** (2–6 teams) and **LAN play**: students answer on their phones while the teacher's machine runs the game.
- Moving a game to another computer: **export a `.egame` file**, copy it over USB and import it on the other machine. That file does not depend on the app database.
$mden_a$
  ),
  'bat-dau', 1, true
),
(
  'ai-cuc-bo-tren-may',
  jsonb_build_object(
    'vi', 'AI cục bộ chạy trên máy bạn như thế nào',
    'en', 'How the on-device AI works'
  ),
  jsonb_build_object(
    'vi', 'Chọn model nào, máy cần bao nhiêu RAM, dữ liệu bài học đi đâu — và điều gì xảy ra khi AI local chậm.',
    'en', 'Which model to pick, how much RAM you need, where your lesson text goes, and what happens when local AI is slow.'
  ),
  jsonb_build_object(
    'vi', $mdvi_b$## Ba đường, chọn theo hoàn cảnh

- **AI cục bộ**: model chạy ngay trên máy bằng llama.cpp. Không cần tài khoản, không cần internet sau khi đã tải model.
- **AI đám mây bằng khoá của bạn**: Gemini, OpenAI hoặc một endpoint tương thích OpenAI. Bạn tự trả phí, tự quản lý khoá.
- **Không gọi model**: ứng dụng vẫn soạn câu hỏi theo luật và cho phép bạn tự viết tay.

## Chọn model nào

| Model | RAM tối thiểu | Ghi chú |
| --- | --- | --- |
| Qwen3.5 **2B** | 4 GB | mặc định, hợp với máy văn phòng |
| Qwen3.5 **4B** | 8 GB | chất lượng tốt hơn, chậm hơn |
| Gemma 4 E2B | — | **chỉ chọn tay**, không phải mặc định |

Gemma nằm ở cuối là có lý do: trên máy đo thử, nó **chậm hơn cả bản 2B**, và khuôn chat của nó mở một khối *suy nghĩ* — với cửa sổ sinh ngắn, bạn nhận về lý luận chứ không phải đáp án. Vì vậy trình cài đặt chạy lần đầu không bao giờ tự chọn nó.

## Máy cần gì

Số đo thật trên một máy văn phòng (Intel Core i5 dòng U, 4 nhân / 8 luồng, 16 GB RAM, không GPU rời, runtime llama.cpp bản CPU):

- Qwen3.5-2B bản lượng tử hoá Q4_0 chiếm **~1,21 GB**, runtime **~19 MB**.
- Bộ đọc hiểu giáo án (MiniLM) thêm **~216 MB**; cả hai model chạy cùng lúc tốn **~2,3 GB** RAM.
- Tốc độ sinh chữ trên CPU chỉ **6–11 token/giây**, nên một lượt phân tích bài ngắn mất khoảng **1 phút** và sinh 4 câu khoảng **1 phút rưỡi**.

Đó là máy đã đo; máy của bạn có thể khác. Ứng dụng hiển thị RAM khả dụng và số nhân CPU khi bạn chọn model, nhưng đó là **ước lượng để tham khảo**, không phải cam kết tương thích.

## Chạy kiểu gì

- Model được tải xuống theo phiên bản và SHA-256 đã khoá trước, rồi lưu vào thư mục dữ liệu của ứng dụng — **không ghi vào Program Files**. Gỡ app chỉ xoá thư mục AI đã tải, giữ nguyên giáo án, thư viện game và lịch sử.
- Server AI chỉ lắng nghe ở **127.0.0.1**: nội dung bài học không đi ra khỏi máy ở chế độ cục bộ.
- Một lúc chỉ chạy **một** model; server bật lên khi bạn gọi AI lần đầu và tắt khi đóng ứng dụng.
- Mặc định là bản **CPU**. Bản Vulkan cho GPU tích hợp chỉ dành cho ai tự chọn; trên máy đo thử nó **chậm hơn CPU**. Nếu đúng tên backend không khả dụng, ứng dụng ghi log và chạy tiếp trên CPU thay vì thất bại.

## Khi AI local chậm hoặc treo

Nếu lượt gọi vượt quá thời gian cho phép, ứng dụng huỷ yêu cầu, dừng runtime nghi treo và bật lại đúng model đó một lần trước khi báo lỗi. Lần bật lại cũng thất bại thì bạn tự khởi động lại AI cục bộ trong phần Cài đặt.

## Điều ứng dụng không hứa

- Chất lượng sư phạm của câu hỏi do AI sinh ra **chưa được đánh giá bởi hội đồng chuyên môn** — giáo viên vẫn là người duyệt.
- Chế độ *suy nghĩ sâu* không dùng được trên CPU nên không có trong app.
$mdvi_b$,
    'en', $mden_b$## Three paths, pick by situation

- **Local AI**: the model runs on your machine through llama.cpp. No account, and no internet once the model is downloaded.
- **Cloud AI with your own key**: Gemini, OpenAI, or any OpenAI-compatible endpoint. You pay and manage the key yourself.
- **No model at all**: the app still drafts questions by fixed rules and lets you write everything by hand.

## Which model

| Model | Minimum RAM | Notes |
| --- | --- | --- |
| Qwen3.5 **2B** | 4 GB | default, fine for an office laptop |
| Qwen3.5 **4B** | 8 GB | better quality, slower |
| Gemma 4 E2B | — | **manual choice only**, never auto-selected |

Gemma is last for a reason: on the test machine it was **slower than 2B**, and its chat template opens a *thinking* block — with a short generation window you get reasoning back instead of an answer. So first-run setup never picks it for you.

## What your machine needs

Measured on one office-class machine (Intel Core i5 U-series, 4 cores / 8 threads, 16 GB RAM, no discrete GPU, CPU build of llama.cpp):

- Qwen3.5-2B at Q4_0 takes **~1.21 GB**, the runtime **~19 MB**.
- The lesson reader (MiniLM) adds **~216 MB**; both models together use **~2.3 GB** of RAM.
- CPU generation runs at **6–11 tokens/second**, so analysing a short lesson takes about **a minute** and four generated questions about **a minute and a half**.

That is one measured machine; yours may differ. The app shows available RAM and logical CPU count when you choose a model, but those are **estimates to guide you**, not a compatibility promise.

## How it runs

- Models are pinned to a specific revision and SHA-256, verified after download, then stored in the app's data folder — **never in Program Files**. Uninstalling removes only the downloaded AI folder and keeps your lessons, game library and history.
- The AI server binds to **127.0.0.1 only**: in local mode your lesson text never leaves the machine.
- **One model at a time**; the server starts on your first AI request and stops when you close the app.
- The default runtime is the **CPU** build. A Vulkan build for integrated GPUs is an advanced, opt-in choice and measured **slower than CPU** on the test machine. If the installed runtime does not match the backend you asked for, the app logs it and continues on CPU instead of failing to start.

## When local AI is slow or hangs

If a request exceeds its timeout, the app aborts it, stops the runtime that may be stuck and starts the same model again before reporting the timeout. If that restart also fails, you restart local AI manually from Settings.

## What the app does not promise

- The pedagogical quality of AI-generated questions **has not been reviewed by a subject-matter panel** — the teacher is still the reviewer.
- A "deep thinking" mode is unavailable on CPU, so it is not offered in the app.
$mden_b$
  ),
  'ai', 2, true
)
on conflict (slug) do update
  set title     = excluded.title,
      summary   = excluded.summary,
      body_md   = excluded.body_md,
      category  = excluded.category,
      sort_order = excluded.sort_order,
      published = true;
