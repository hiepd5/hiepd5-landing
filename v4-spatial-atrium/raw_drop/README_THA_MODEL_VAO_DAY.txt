HƯỚNG DẪN THẢ BỘ 5 MÔ-ĐUN .GLB ĐỒNG TÂM (TRIPO AI / SKETCHUP) VÀO ĐÂY
=====================================================================

Vì Trang 2 giải phẫu cả LỚP VỎ BAO CHE BÊN NGOÀI lẫn KHÔNG GIAN BÊN TRONG,
công trình được ghép đồng tâm từ 5 file .glb độc lập. Khi Sếp tạo model từ
5 ảnh mồi trên Tripo AI (hoặc xuất từ SketchUp), chỉ cần đặt tên theo quy ước:

1. BỘ 5 MÔ-ĐUN CÔNG TRÌNH LỒNG KHỚP 1:1:
   - `mod_01_plaza.glb`     : Đế quảng trường & rãnh khóa Socket
   - `mod_02_interior.glb`  : Lõi không gian nội thất, sàn lửng & cầu thang xoắn bên trong
   - `mod_03_structure.glb` : Hệ khung kết cấu cột & vòm chịu lực rỗng giữa
   - `mod_04_shell.glb`     : Lớp vỏ bao che mặt đứng rỗng ruột (Blender sẽ TỰ ĐỘNG chia đôi Trái/Phải tại X=0 để mở cánh ở Trang 2!)
   - `mod_05_roof.glb`      : Nắp mái vườn sinh thái & giếng trời Oculus

2. BỘ 3 VẬT THỂ BỐI CẢNH KHÔNG GIAN MỞ (TÙY CHỌN):
   - `drone_ai.glb`         : Drone quét LiDAR tiền cảnh
   - `tree_bokeh.glb`       : Cây cảnh Bonsai tiền cảnh xóa phông
   - `monolith_plaza.glb`   : Tượng điêu khắc trên mặt nước quảng trường

3. ĐỒNG BỘ 1-CLICK:
   - Sếp có thể thay lẻ từng mô-đun một hoặc thay cả 5 mô-đun cùng lúc!
   - Sau khi thả file vào `raw_drop`, click đúp `SYNC_MODELS_V4.bat` ở thư mục ngoài để tự động ép chuẩn khung bao Socket (0.0mm lệch) rồi bấm F5 trên `http://localhost:5188`!
