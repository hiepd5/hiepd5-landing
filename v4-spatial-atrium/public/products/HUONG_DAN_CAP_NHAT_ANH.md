# Hướng Dẫn Thay Ảnh & Nội Dung Sản Phẩm (Giai Đoạn 2)

1. **Thả ảnh chụp thực tế vào đúng thư mục:**
   - `public/products/render-ai-studio/` — Ảnh giao diện Plugin, cặp ảnh trước/sau Render AI Studio.
   - `public/products/mapskp/` — Ảnh giao diện chọn bản đồ & mô hình địa hình/đô thị trong SketchUp.
   - `public/products/gallery/` — Các ảnh sản phẩm / dự án tiêu biểu (khuyên dùng `.webp` hoặc `.jpg`, tỉ lệ `16:10` hoặc `16:9`).

2. **Điền đường dẫn & câu chữ vào 1 file duy nhất:**
   - Mở `src/config/siteContent.js`
   - Sửa trực tiếp tiêu đề, gạch đầu dòng tính năng, giá và đường dẫn ảnh (ví dụ: `'/products/mapskp/ui-01.webp'`).
   - Lưu file — trang Local `http://localhost:5188/` sẽ tự động cập nhật ngay lập tức.
