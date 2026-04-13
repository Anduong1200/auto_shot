# Auto Screenshot & Next Extension 📸

![Manifest V3](https://img.shields.io/badge/Manifest-V3-brightgreen)
![Browser](https://img.shields.io/badge/Browser-Chrome%20%7C%20Brave%20%7C%20Edge-blue)
![License](https://img.shields.io/badge/License-MIT-purple)

A powerful, robust browser extension that automates the tedious process of taking screenshots of paginated content or image carousels (Lightbox/XenForo/Fancybox). It silently captures the screen, saves the image locally into an organized subfolder, simulates a click on the "Next" button, and repeats until a defined limit is reached.

---

## ✨ Features / Tính Năng

- 🔄 **Fully Automated Scraping:** Chỉ cần bấm Bắt đầu, Extension sẽ tự động chụp màn hình và chuyển trang liên tục.
- 🎯 **Custom CSS Selectors:** Hoạt động trên mọi giao diện web; bạn chỉ cần cung cấp CSS Selector của nút "Next".
- 🛡️ **Smart Filename Sanitization:** Tự động bắt lỗi và làm sạch tên / đường dẫn cấm (như `\:*?"<>|`) để ngăn chặn việc crash API Downloads của Chromium.
- ⏱️ **Flexible Delay:** Tùy chọn trễ miliseconds đa dạng để phù hợp với tốc độ load trang hoặc hiệu ứng Animation của website.
- 📂 **Auto-Grouping Subfolders:** Quản lý kho lưu trữ dễ dàng. Gõ tên thư mục, Extension tự tạo và đưa ảnh vào gọn gàng trong thư mục gốc `Downloads`.
- ⏯️ **Smart Resume (Nối Tiếp Thông Minh):** Bị đứt mạng giữa chừng? Không sao! Cài đặt `Lưu từ Index` và `Giới hạn mục tiêu` giúp bạn nối tiếp công việc đúng số thứ tự file đang dang dở.

---

## 🚀 Installation / Cài Đặt (Local Development)

1. Clone Repository này về máy hoặc tải file ZIP giải nén:
   ```bash
   git clone https://github.com/your-username/auto-screenshot-ext.git
   ```
2. Mở trình duyệt Chrome / Brave / Edge.
3. Truy cập vào trang Quản lý Tiện ích mở rộng:
   - Chrome: `chrome://extensions/`
   - Brave: `brave://extensions/`
4. Bật chế độ **Developer mode (Chế độ dành cho nhà phát triển)** ở góc trên bên phải.
5. Chọn **Load unpacked (Tải tiện ích đã giải nén)**.
6. Trỏ đến thư mục chứa mã nguồn của extension này (`Auto_Screenshot_Ext`).
7. 👉 Tiện ích đã sẵn sàng trên thanh công cụ!

---

## ⚙️ Important Setup Rule / Lưu ý Cốt Lõi 🚨

Để tính năng Automation chạy **ngầm và mượt 100%** (không bắt bạn phải ấn nút Save từng trang), bạn bắt buộc phải làm thao tác sau trên Trình Duyệt:

1. Vào Cài đặt trình duyệt (Settings) -> **Tệp tải xuống (Downloads)**.
2. TẮT CÔNG TẮC: **"Hỏi vị trí lưu từng tệp trước khi tải xuống" (Ask where to save each file before downloading)**.
3. (Tuỳ chọn): Bạn có thể thay đổi *Vị trí Mặc định* thư mục Downloads sang phân vùng ổ cứng rộng rãi hơn (VD: `D:\Ebooks\`). Extension sẽ tự tạo "Subfolder" bám theo phân vùng này.

---

## 🛠 Usage / Hướng Dẫn Sử Dụng

1. Mở trang web có chứa truyện/ảnh click Next bạn muốn chụp.
2. Bấm vào icon của Extension trên góc phải trình duyệt.
3. Cấu hình các thông số:
   - **Thư Mục Lưu:** Tên thư mục nơi lưu giữ ảnh (VD: `Naruto_Tap1`).
   - **Tiền Tố File:** Tên gốc của ảnh (VD: `Trang` -> Kết quả sẽ là `Trang_001.png`).
   - **Bắt đầu từ số:** Cực kỳ hữu dụng khi bạn muốn nối tiếp nếu phần mềm lỡ dừng ở trang 20, nhập `21` ở đây.
   - **Dừng ở số:** Số lượng ảnh mục tiêu, ví dụ `50` (Nếu vô hạn thì điền `0`).
   - **Delay:** Độ trễ (Giây). Web load chậm thì kéo thanh delay cao lên.
   - **CSS Selector Nút Next:** Mã CSS để Extension biết nó phải bấm nút nào trên trang web để lật sang trang kế tiếp. (Mặc định: `button.f-button.is-next`).
4. Bấm **▶ Bắt Đầu Chụp**. Và đi pha một tách cà phê ☕

## 👨‍💻 Architecture (Manifest V3)

- `manifest.json`: Configuration for permissions (`activeTab`, `scripting`, `downloads`, `storage`).
- `background.js`: Persistent Service Worker handling screenshot APIs, file system routing, error capturing, and loops.
- `popup.html` & `popup.js`: Modern Glassmorphism UI acting as the persistent configuration layer passing exact arguments to the payload.

---
*Created carefully to respect Chromium's restrictive File System capabilities while maximizing productivity. Happy Scraping!*
