# CLAUDE.md — HiepD5.com Landing Page

## Dự án

Landing page cinematic cho **Vương Đắc Hiệp** tại HiepD5.com.  
Dự án hiện tại: **Campus trường học** — kiến trúc curved terracotta arches, sân track xanh, atrium đa tầng.  
Scroll chuột điều khiển toàn bộ — **ảnh tĩnh zoom+pan xen kẽ frame-scrubbing AI transition**.  
Thiết kế theo phong cách **Fall Line House** — full-screen, dark, architectural. Vòng lặp vô hạn.

## Thông tin chủ sở hữu

| | |
|---|---|
| Tên | Vương Đắc Hiệp |
| SĐT | 0979 591 156 |
| YouTube | https://www.youtube.com/channel/UCXD97eRzqP_7T9-wLg75MyQ |
| Facebook | https://www.facebook.com/vuongdachiep |

## Stack

Vanilla HTML + CSS + JavaScript — không framework, không thư viện ngoài.

## Rules chi tiết

| Rule | Nội dung |
|------|----------|
| [01-architecture](.claude/rules/01-architecture.md) | Kiến trúc: ảnh tĩnh + frame-scrubbing transition + layout Fall Line House |
| [02-scroll-engine](.claude/rules/02-scroll-engine.md) | Virtual scroll, lerp, wrap loop, image/frames render, scheduleRender() |
| [03-fog-effect](.claude/rules/03-fog-effect.md) | CSS fog/vignette/grain — thông số layer, class mới |
| [04-file-structure](.claude/rules/04-file-structure.md) | Cây thư mục, CONFIG object, quy cách asset, frames pipeline |
| [05-technical-constraints](.claude/rules/05-technical-constraints.md) | Ràng buộc kỹ thuật, performance, cross-browser |
| [06-deploy](.claude/rules/06-deploy.md) | Vercel + R2 CDN, ASSET_BASE, GitHub repo, domain setup |
| [reviewer](.claude/rules/reviewer.md) | Rubric chấm điểm, checklist trước launch |

## Trạng thái hiện tại

### ✅ Session 1
- Xây lại toàn bộ từ đầu theo layout Fall Line House — full-screen dark `#0a0a0a`
- Left info panel, top nav, right panel (GPS dọc), bottom bar (progress + CTA)
- `updateInfoPanel()` theo dominant opacity scene, nav links click-to-jump

### ✅ Session 2
- Phân tích 6 ảnh render — chọn 5 scene, đổi tên chuẩn `scene-01.jpg` → `scene-05.jpg`
- Sequence: Toàn cảnh → Sân vận động → Arcade vòm → Atrium → Walkway tầng cao
- Chuyển `type:'video'` → `type:'frames'` — canvas scrub 0 lag
- 5 transitions AI hoàn chỉnh, tổng 752 frames
- Vòng lặp vô hạn wrap (modulo), TRANS_WIDTH: 700px

### ✅ Session 3
- Code review 74/100, fix 5 vấn đề: getContext cache, resize redraw, duplicate calc, dead code, lazy load
- Lazy loading frames — init chỉ load t-01-02, lazy load kề khi scroll
- `ASSET_BASE` constant — 1 dòng switch local↔CDN
- Kiến trúc deploy: Vercel (code) + Cloudflare R2 (assets)
- Upload R2 bucket `hiepd5`: t-01-02 xong (56MB)

### ✅ Session 4 (session này)
- **Upload R2 hoàn tất** — tất cả frames + images đã lên R2
- **Custom domain `assets.hiepd5.com`** — gắn vào R2 bucket `hiepd5`, status Active
- **ASSET_BASE** đổi sang `https://assets.hiepd5.com/hiepd5-assets/` (key có prefix `hiepd5-assets/`)
- **GitHub repo mới** — `hiepd5/hiepd5-landing` trên account jeamin2811
- **Deploy Vercel** — account jeamin2811, project `hiepd5-landing`, framework Other
- **Domain swap** — xóa `hiepd5.com` khỏi Vercel cũ (arcvuongdachiep), gắn vào project mới
- **DNS Cloudflare** — A record `76.76.21.21`, CNAME www `cname.vercel-dns.com`, TXT `_vercel` verify 2 record
- **Nút AI PROMPT 2.0** — gradient vàng→đỏ trên nav, link Google AI Studio
- **TOUCH_MULTIPLIER: 2.8** — tăng từ 1.6, mobile vuốt nhanh hơn
- **Scene-05 hiển thị đầu** — init scroll tại `CONFIG.scenes[8].start + CROSSFADE`
- **Fix load tối đen** — init `currentScroll = targetScroll = CONFIG.scenes[8].start + CROSSFADE`
- **Hiệu ứng nghệ thuật scene-05** — 3 lớp: fog (sương xám lạnh) + vignette (viền tối) + film grain (hạt phim)

### 🔲 Bước tiếp theo (session sau)
1. **Điền thông tin thật** — tên dự án, diện tích, địa điểm, chủ đầu tư vào `CONFIG.scenes[]`
2. **Cập nhật tọa độ GPS** — thay `21.028°N / 105.834°E` bằng tọa độ thật
3. **Fine-tune hiệu ứng scene-05** — điều chỉnh opacity fog/vignette/grain nếu muốn đậm/nhạt hơn
4. **Bật fog cho các scene khác** nếu muốn — hiện chỉ scene-01 và scene-05 có fog
5. **Test mobile Safari iOS** — canvas scrub, touch scroll, grain animation không lag
6. **Upload ảnh scenes còn thiếu trên R2** nếu cần thêm scene mới
7. **Thêm scene mới** nếu có render mới — theo pipeline: ảnh → AI clip → frames → CONFIG

## Quyết định quan trọng & lý do

| Quyết định | Lý do |
|------------|-------|
| Xây lại từ đầu (session 1) | Layout cũ (frame box) khác hoàn toàn với Fall Line House |
| Full-screen dark `#0a0a0a` | Immersive — ảnh kiến trúc cần không gian tối đa |
| `type:'frames'` thay `type:'video'` | `video.currentTime` có buffer lag; frame JPG preload vào RAM = scrub tức thì 0 lag |
| Canvas `drawImage()` với cover scaling | Giữ đúng tỉ lệ ảnh không méo, tương đương `object-fit:cover` |
| Crossfade FADE=0.12 trên frames | Không giật khi chuyển từ transition sang ảnh tĩnh |
| TRANS_WIDTH: 700px | 160px quá nhanh; 700px cho phép điều khiển từng frame |
| Vòng lặp wrap (modulo) | Clamp dừng ở cuối — wrap giữ nguyên delta lerp khi reset, không nhảy |
| Lazy load frames | 752 frames × 180KB = 120MB nếu load hết lúc init; lazy load giữ RAM ~25MB |
| Vercel (code) + R2 (assets) tách biệt | Vercel free tier 100MB limit; R2 free 10GB + zero egress |
| `ASSET_BASE` constant 1 dòng | Switch local↔production không sửa nhiều chỗ |
| Không dùng Supabase | R2 upload ghi đè cùng key = URL không đổi, đủ để swap asset |
| Key R2 có prefix `hiepd5-assets/` | Upload tool tự tạo subfolder — URL thực tế `assets.hiepd5.com/hiepd5-assets/...` |
| GitHub account jeamin2811 (mới) | Account cũ arcvuongdachiep là Next.js — tách biệt hoàn toàn |
| Domain swap thay vì tạo subdomain | Muốn `hiepd5.com` chính trỏ thẳng về landing page mới ngay |
| Scene-05 hiển thị đầu | TERRACE là ảnh ấn tượng nhất — first impression mạnh hơn scene-01 |
| Vignette + grain chỉ scene-05 | Scene đầu tiên cần ấn tượng nhất; không áp dụng đại trà để tránh nặng |
| TOUCH_MULTIPLIER: 2.8 | 1.6 quá chậm trên mobile; 2.8 cảm giác tự nhiên hơn |
