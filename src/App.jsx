import { useState, useEffect } from "react";

// Mật khẩu để mở khóa xem lời giải bài nâng cao.
const SOLUTION_PASSWORD = "vuihoc";

// Chuẩn hóa để so sánh: bỏ dấu tiếng Việt, khoảng trắng, đổi , thành .
function norm(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/,/g, ".")
    .replace(/\s+/g, "")
    .replace(/\.+$/, "");
}

// answerSpec: các đáp án chấp nhận, ngăn cách bằng "|"
function checkAnswer(given, answerSpec) {
  const g = norm(given);
  if (!g) return null;
  const alts = answerSpec.split("|").map(norm).filter(Boolean);
  for (const a of alts) {
    if (g === a) return true;
    if (/^-?\d+(\.\d+)?%?$/.test(a)) {
      const an = parseFloat(a);
      const m = g.match(/^-?\d+(\.\d+)?/);
      if (m && parseFloat(m[0]) === an) {
        const rest = g.slice(m[0].length);
        if (rest === "" || /^[a-z%\/°][a-z0-9%\/°]*$/.test(rest)) return true;
      }
    } else if (a.length >= 6 && g.includes(a)) {
      return true;
    }
  }
  return false;
}

const inkColor = "#2B2620";
const marginRed = "#B5433D";
const correctGreen = "#4E7A51";

const CATEGORIES = [
  { id: "mo-dau", label: "Mở đầu", color: "#2A7F7F", icon: "🔬" },
  { id: "vat-li", label: "Vật lí", color: "#3D5A80", icon: "⚡" },
  { id: "hoa-hoc", label: "Hóa học", color: "#8A4F9E", icon: "⚗️" },
  { id: "sinh-hoc", label: "Sinh học", color: "#4E7A51", icon: "🌱" },
];

const font = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
    .lt-serif { font-family: 'Newsreader', Georgia, serif; }
    body, .lt-root { font-family: 'Inter', -apple-system, sans-serif; color: #2B2620; }
    .lt-page { background: #FBF8F2; border: 1px solid #E4DCC8; box-shadow: 0 1px 3px rgba(0,0,0,0.06); position: relative; }
    .lt-margin { position: absolute; left: 32px; top: 0; bottom: 0; width: 1px; background: #E8B4B0; opacity: 0.5; }
    .lt-tab { transition: all 0.15s ease; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .gap-3 { gap: 12px; }
    textarea, input { font-family: inherit; }
    .lt-summary { line-height: 1.8; font-size: 15px; }
    .lt-summary h2 { font-family: 'Newsreader', Georgia, serif; font-size: 22px; font-weight: 700; margin: 0 0 16px; color: #2B2620; }
    .lt-summary strong { color: #2B2620; }
    .lt-summary ul { padding-left: 20px; margin: 8px 0 16px; }
    .lt-summary li { margin-bottom: 6px; }
    .lt-summary p { margin: 0 0 12px; }
    .lt-summary table { border-collapse: collapse; width: 100%; margin: 12px 0 18px; font-size: 14px; }
    .lt-summary th, .lt-summary td { border: 1px solid #D9CFC0; padding: 7px 10px; text-align: left; }
    .lt-summary th { background: #F3EEE3; }
  `}</style>
);

const CHUYEN_DE = [
 {
  "id": "m1-phuong-phap",
  "category": "mo-dau",
  "title": "Phương pháp và kĩ năng học tập môn KHTN",
  "summary": "## Phương pháp và kĩ năng học tập môn KHTN\n\n**Khoa học tự nhiên** nghiên cứu các sự vật, hiện tượng, quá trình của thế giới tự nhiên; kết hợp kiến thức vật lí, hóa học, sinh học và khoa học Trái Đất.\n\n**Phương pháp tìm hiểu tự nhiên** gồm các bước:\n- **Quan sát và đặt câu hỏi** về sự vật, hiện tượng.\n- **Hình thành giả thuyết:** dự đoán/lời giải thích tạm thời cho vấn đề.\n- **Lập kế hoạch kiểm tra giả thuyết.**\n- **Thực hiện kế hoạch:** làm thí nghiệm, thu thập số liệu.\n- **Kết luận:** giả thuyết đúng hay sai; viết báo cáo, trình bày kết quả.\n\n**Các kĩ năng:** quan sát, phân loại, liên kết, đo, dự báo.\n\n| Đại lượng | Dụng cụ đo | Đơn vị |\n|---|---|---|\n| Chiều dài | Thước | mét (m) |\n| Khối lượng | Cân | kilôgam (kg) |\n| Thời gian | Đồng hồ | giây (s) |\n| Nhiệt độ | Nhiệt kế | độ C (°C) |\n| Thể tích | Bình chia độ | lít (L), mL, cm³ |\n\n**Cần nhớ:** 1 L = 1000 mL; 1 mL = 1 cm³. Khi đọc kết quả đo, đặt mắt nhìn vuông góc với vạch chia; đo nhiều lần rồi lấy giá trị trung bình để giảm sai số. Luôn tuân thủ quy tắc an toàn trong phòng thực hành.",
  "quiz": [
   {
    "prompt": "Bước đầu tiên trong phương pháp tìm hiểu tự nhiên là:",
    "explain": "Tìm hiểu tự nhiên bắt đầu từ quan sát hiện tượng và nảy sinh câu hỏi.",
    "options": [
     "Hình thành giả thuyết",
     "Kết luận",
     "Quan sát và đặt câu hỏi",
     "Thực hiện kế hoạch kiểm tra"
    ],
    "correct": 2
   },
   {
    "prompt": "Bước cuối cùng của phương pháp tìm hiểu tự nhiên là:",
    "explain": "Sau khi kiểm tra bằng thí nghiệm, ta rút ra kết luận.",
    "options": [
     "Quan sát và đặt câu hỏi",
     "Kết luận",
     "Lập kế hoạch kiểm tra giả thuyết",
     "Hình thành giả thuyết"
    ],
    "correct": 1
   },
   {
    "prompt": "Dùng thước đo chiều dài quyển sách thuộc kĩ năng nào?",
    "explain": "Đo chiều dài bằng thước là kĩ năng đo.",
    "options": [
     "Kĩ năng phân loại",
     "Kĩ năng liên kết",
     "Kĩ năng dự báo",
     "Kĩ năng đo"
    ],
    "correct": 3
   },
   {
    "prompt": "Xếp các con vật thành nhóm 'có xương sống' và 'không xương sống' là kĩ năng:",
    "explain": "Sắp xếp theo đặc điểm chung là kĩ năng phân loại.",
    "options": [
     "Đo",
     "Phân loại",
     "Dự báo",
     "Liên kết"
    ],
    "correct": 1
   },
   {
    "prompt": "Giả thuyết trong nghiên cứu khoa học là:",
    "explain": "Giả thuyết chỉ được coi là đúng sau khi được kiểm chứng.",
    "options": [
     "Kết quả cuối cùng chắc chắn đúng",
     "Một số liệu đo được",
     "Dự đoán hoặc lời giải thích tạm thời, cần được kiểm tra",
     "Một dụng cụ thí nghiệm"
    ],
    "correct": 2
   },
   {
    "prompt": "Dụng cụ nào dùng để đo thể tích chất lỏng?",
    "explain": "Bình chia độ có vạch chia để đọc thể tích.",
    "options": [
     "Đồng hồ bấm giây",
     "Bình chia độ",
     "Nhiệt kế",
     "Cân"
    ],
    "correct": 1
   },
   {
    "prompt": "Đơn vị đo khối lượng trong hệ SI là:",
    "explain": "kg là đơn vị SI của khối lượng.",
    "options": [
     "Mét (m)",
     "Lít (L)",
     "Kilôgam (kg)",
     "Giây (s)"
    ],
    "correct": 2
   },
   {
    "prompt": "Để đo nhiệt độ của nước nóng ta dùng:",
    "explain": "Nhiệt kế dùng đo nhiệt độ.",
    "options": [
     "Cân",
     "Nhiệt kế",
     "Bình chia độ",
     "Thước"
    ],
    "correct": 1
   },
   {
    "prompt": "Thấy trời nhiều mây đen, Lan cho rằng sắp có mưa. Đây là kĩ năng:",
    "explain": "Dựa vào quan sát để đoán hiện tượng sắp xảy ra là dự báo.",
    "options": [
     "Dự báo",
     "Đo",
     "Liên kết",
     "Phân loại"
    ],
    "correct": 0
   },
   {
    "prompt": "An dự đoán 'muối ăn tan trong nước' rồi hòa muối vào nước để thử. Việc làm thí nghiệm thuộc bước:",
    "explain": "Làm thí nghiệm là thực hiện kế hoạch kiểm tra giả thuyết.",
    "options": [
     "Quan sát và đặt câu hỏi",
     "Hình thành giả thuyết",
     "Kết luận",
     "Thực hiện kế hoạch kiểm tra giả thuyết"
    ],
    "correct": 3
   },
   {
    "prompt": "Khi đọc kết quả trên thước, mắt cần nhìn vuông góc với vạch chia để:",
    "explain": "Nhìn lệch làm đọc sai (sai số do góc nhìn).",
    "options": [
     "Đo nhanh hơn",
     "Thước đỡ bị hỏng",
     "Đọc kết quả chính xác, giảm sai số",
     "Vật đo không bị dịch chuyển"
    ],
    "correct": 2
   },
   {
    "prompt": "Câu 'Có thể ánh sáng cần cho sự tạo chất diệp lục nên cây trong tối có lá vàng' thuộc bước:",
    "explain": "Đây là dự đoán giải thích hiện tượng quan sát được.",
    "options": [
     "Kết luận",
     "Thực hiện kế hoạch",
     "Hình thành giả thuyết",
     "Quan sát và đặt câu hỏi"
    ],
    "correct": 2
   }
  ],
  "advanced": [
   {
    "prompt": "Đổi 1,5 lít sang mL (chỉ ghi số).",
    "answer": "1500",
    "solution": "1 L = 1000 mL nên 1,5 L = 1500 mL."
   },
   {
    "prompt": "Đổi 2,5 giờ sang phút (chỉ ghi số).",
    "answer": "150",
    "solution": "2,5 × 60 = 150 phút."
   },
   {
    "prompt": "Bình chia độ chứa 50 mL nước. Thả hòn đá vào, nước dâng lên 68 mL. Thể tích hòn đá là bao nhiêu cm³? (chỉ ghi số)",
    "answer": "18",
    "solution": "68 − 50 = 18 mL = 18 cm³."
   },
   {
    "prompt": "Đổi 0,35 kg sang gam (chỉ ghi số).",
    "answer": "350",
    "solution": "0,35 × 1000 = 350 g."
   },
   {
    "prompt": "Đo chiều dài 5 lần được: 20,1; 20,2; 20,0; 20,1; 20,2 (cm). Giá trị trung bình là bao nhiêu cm?",
    "answer": "20,12|20.12",
    "solution": "Tổng = 100,6; chia 5 được 20,12 cm."
   }
  ]
 },
 {
  "id": "v1-toc-do",
  "category": "vat-li",
  "title": "Tốc độ",
  "summary": "## Tốc độ\n\n**Tốc độ** cho biết vật chuyển động nhanh hay chậm: **v = s / t** (s: quãng đường, t: thời gian).\n\n- Đơn vị thường dùng: m/s, km/h. **1 m/s = 3,6 km/h.**\n- **Tốc độ trung bình** = tổng quãng đường / tổng thời gian.\n- Chuyển động đều: tốc độ không đổi theo thời gian.\n\n**Đo tốc độ:** dùng thước đo quãng đường và đồng hồ (bấm giây, đồng hồ hiện số, cổng quang điện) đo thời gian rồi tính v = s/t. Ngoài đường, cảnh sát dùng thiết bị bắn tốc độ.\n\n**Đồ thị quãng đường – thời gian (s–t):**\n- Đoạn thẳng xiên đi lên: vật chuyển động đều; đồ thị càng dốc thì tốc độ càng lớn.\n- Đoạn nằm ngang: vật đứng yên.\n\n**An toàn giao thông:** tuân thủ tốc độ giới hạn; giữ khoảng cách an toàn vì tốc độ càng lớn thì quãng đường phanh càng dài; đội mũ bảo hiểm, thắt dây an toàn.",
  "quiz": [
   {
    "prompt": "Công thức tính tốc độ là:",
    "explain": "Tốc độ bằng quãng đường chia thời gian.",
    "options": [
     "v = s + t",
     "v = s × t",
     "v = s / t",
     "v = t / s"
    ],
    "correct": 2
   },
   {
    "prompt": "Đơn vị nào sau đây là đơn vị của tốc độ?",
    "explain": "km/h và m/s là đơn vị tốc độ.",
    "options": [
     "km/h",
     "°C",
     "kg",
     "mL"
    ],
    "correct": 0
   },
   {
    "prompt": "1 m/s bằng:",
    "explain": "Đổi: 1 m/s = 3,6 km/h.",
    "options": [
     "1 km/h",
     "36 km/h",
     "0,36 km/h",
     "3,6 km/h"
    ],
    "correct": 3
   },
   {
    "prompt": "Chuyển động đều là chuyển động có:",
    "explain": "Định nghĩa chuyển động đều.",
    "options": [
     "Quỹ đạo luôn cong",
     "Tốc độ không đổi theo thời gian",
     "Tốc độ tăng dần",
     "Tốc độ giảm dần"
    ],
    "correct": 1
   },
   {
    "prompt": "Để đo tốc độ bằng đồng hồ bấm giây, ngoài thời gian ta cần đo thêm:",
    "explain": "Cần s và t để tính v = s/t.",
    "options": [
     "Nhiệt độ",
     "Quãng đường",
     "Khối lượng",
     "Thể tích"
    ],
    "correct": 1
   },
   {
    "prompt": "Đồ thị quãng đường – thời gian của vật đứng yên là:",
    "explain": "Quãng đường không đổi theo thời gian nên đồ thị nằm ngang.",
    "options": [
     "Đường cong đi xuống",
     "Đoạn thẳng nằm ngang",
     "Một điểm duy nhất",
     "Đoạn thẳng xiên đi lên"
    ],
    "correct": 1
   },
   {
    "prompt": "Đồ thị s–t của chuyển động đều là:",
    "explain": "Quãng đường tăng đều theo thời gian.",
    "options": [
     "Đường tròn",
     "Đoạn thẳng nằm ngang",
     "Đường thẳng đứng",
     "Đoạn thẳng xiên đi lên"
    ],
    "correct": 3
   },
   {
    "prompt": "Thiết bị nào được cảnh sát dùng để đo tốc độ xe trên đường?",
    "explain": "Thiết bị bắn tốc độ xác định tốc độ xe.",
    "options": [
     "Thiết bị bắn tốc độ",
     "Bình chia độ",
     "Cân",
     "Nhiệt kế"
    ],
    "correct": 0
   },
   {
    "prompt": "Giữ khoảng cách an toàn giữa các xe nhằm:",
    "explain": "Tốc độ lớn thì quãng đường phanh dài.",
    "options": [
     "Có đủ quãng đường để phanh, tránh va chạm",
     "Đi nhanh hơn",
     "Xe đỡ bị bẩn",
     "Tiết kiệm xăng"
    ],
    "correct": 0
   },
   {
    "prompt": "Ô tô đi 120 km trong 2 giờ. Tốc độ trung bình là:",
    "explain": "120 : 2 = 60 km/h.",
    "options": [
     "30 km/h",
     "60 km/h",
     "122 km/h",
     "240 km/h"
    ],
    "correct": 1
   },
   {
    "prompt": "Đổi 15 m/s sang km/h:",
    "explain": "15 × 3,6 = 54 km/h.",
    "options": [
     "54 km/h",
     "90 km/h",
     "4,2 km/h",
     "18 km/h"
    ],
    "correct": 0
   },
   {
    "prompt": "Đi 30 km với 30 km/h rồi 30 km với 60 km/h. Tốc độ trung bình cả quãng đường là:",
    "explain": "Tổng 60 km; thời gian 1 h + 0,5 h = 1,5 h; 60 : 1,5 = 40 km/h.",
    "options": [
     "45 km/h",
     "50 km/h",
     "40 km/h",
     "30 km/h"
    ],
    "correct": 2
   }
  ],
  "advanced": [
   {
    "prompt": "Bạn An đi xe đạp 12 km trong 45 phút. Tốc độ bằng bao nhiêu km/h? (chỉ ghi số)",
    "answer": "16",
    "solution": "45 phút = 0,75 h; 12 : 0,75 = 16 km/h."
   },
   {
    "prompt": "Xe máy chạy 54 km/h. Đổi ra m/s (chỉ ghi số).",
    "answer": "15",
    "solution": "54 : 3,6 = 15 m/s."
   },
   {
    "prompt": "Hai xe ngược chiều, cách nhau 180 km, tốc độ 50 km/h và 40 km/h, khởi hành cùng lúc. Sau bao nhiêu giờ gặp nhau? (chỉ ghi số)",
    "answer": "2",
    "solution": "Tốc độ tiến lại gần: 90 km/h; 180 : 90 = 2 giờ."
   },
   {
    "prompt": "Vận động viên chạy 100 m hết 12,5 s. Tốc độ là bao nhiêu m/s? (chỉ ghi số)",
    "answer": "8",
    "solution": "100 : 12,5 = 8 m/s."
   },
   {
    "prompt": "Ô tô đi 2 giờ đầu với 50 km/h, 3 giờ sau với 60 km/h. Tốc độ trung bình là bao nhiêu km/h? (chỉ ghi số)",
    "answer": "56",
    "solution": "Quãng đường: 100 + 180 = 280 km; thời gian 5 h; 280 : 5 = 56 km/h."
   }
  ]
 },
 {
  "id": "v2-am-thanh",
  "category": "vat-li",
  "title": "Âm thanh",
  "summary": "## Âm thanh\n\n- **Nguồn âm** là vật dao động. **Sóng âm** là dao động của nguồn âm lan truyền trong môi trường.\n- Âm truyền được trong chất **rắn, lỏng, khí**; **không truyền được trong chân không**. Tốc độ truyền: rắn > lỏng > khí (không khí ≈ 340 m/s, nước ≈ 1500 m/s).\n- **Tần số** là số dao động trong 1 giây, đơn vị **hertz (Hz)**. Tần số càng lớn, âm càng **cao (bổng)**; tần số nhỏ, âm **thấp (trầm)**.\n- **Biên độ** dao động càng lớn, âm càng **to**. Độ to đo bằng **đêxiben (dB)**.\n- Tai người nghe được âm có tần số từ **20 Hz đến 20 000 Hz**; dưới 20 Hz là **hạ âm**, trên 20 000 Hz là **siêu âm**.\n\n**Phản xạ âm:** âm gặp mặt chắn bị hắt lại. Vật nhẵn, cứng phản xạ âm tốt; vật mềm, xốp, gồ ghề hấp thụ âm tốt. **Tiếng vang** là âm phản xạ nghe được cách âm trực tiếp ít nhất **1/15 giây**.\n- Quãng đường âm đi: s = v × t; khoảng cách tới vật phản xạ = v × t / 2.\n\n**Chống ô nhiễm tiếng ồn:** giảm nguồn ồn, ngăn cách (tường, cửa cách âm), trồng cây xanh, dùng vật liệu hấp thụ âm.",
  "quiz": [
   {
    "prompt": "Âm thanh được tạo ra từ:",
    "explain": "Mọi nguồn âm đều dao động.",
    "options": [
     "Vật lạnh",
     "Vật đứng yên",
     "Vật dao động",
     "Vật nóng"
    ],
    "correct": 2
   },
   {
    "prompt": "Âm thanh KHÔNG truyền được trong:",
    "explain": "Âm cần môi trường vật chất để truyền.",
    "options": [
     "Chất rắn",
     "Chất khí",
     "Chân không",
     "Chất lỏng"
    ],
    "correct": 2
   },
   {
    "prompt": "Đơn vị của tần số là:",
    "explain": "Tần số đo bằng hertz (Hz).",
    "options": [
     "dB",
     "km/h",
     "m/s",
     "Hz"
    ],
    "correct": 3
   },
   {
    "prompt": "Vật dao động càng nhanh (tần số lớn) thì âm phát ra:",
    "explain": "Tần số lớn cho âm cao.",
    "options": [
     "Càng thấp (trầm)",
     "Càng cao (bổng)",
     "Càng nhỏ",
     "Không đổi"
    ],
    "correct": 1
   },
   {
    "prompt": "Biên độ dao động lớn thì âm phát ra:",
    "explain": "Biên độ quyết định độ to.",
    "options": [
     "Thấp",
     "Nhỏ",
     "To",
     "Cao"
    ],
    "correct": 2
   },
   {
    "prompt": "Độ to của âm được đo bằng đơn vị:",
    "explain": "Độ to đo bằng dB.",
    "options": [
     "m",
     "Hz",
     "dB (đêxiben)",
     "kg"
    ],
    "correct": 2
   },
   {
    "prompt": "Tai người nghe được âm có tần số trong khoảng:",
    "explain": "Đây là ngưỡng nghe của người.",
    "options": [
     "2 Hz đến 200 Hz",
     "200 000 Hz trở lên",
     "20 Hz đến 20 000 Hz",
     "0 Hz đến 5 Hz"
    ],
    "correct": 2
   },
   {
    "prompt": "Âm có tần số lớn hơn 20 000 Hz gọi là:",
    "explain": "Trên 20 000 Hz là siêu âm.",
    "options": [
     "Siêu âm",
     "Hạ âm",
     "Tiếng vang",
     "Âm trầm"
    ],
    "correct": 0
   },
   {
    "prompt": "Âm truyền nhanh nhất trong môi trường nào?",
    "explain": "Âm truyền nhanh nhất trong chất rắn.",
    "options": [
     "Chân không",
     "Nước",
     "Không khí",
     "Chất rắn (ví dụ thép)"
    ],
    "correct": 3
   },
   {
    "prompt": "Vật nào phản xạ âm tốt?",
    "explain": "Vật nhẵn, cứng phản xạ âm tốt.",
    "options": [
     "Tường gạch nhẵn",
     "Tấm thảm dày",
     "Rèm nhung",
     "Bông xốp"
    ],
    "correct": 0
   },
   {
    "prompt": "Biện pháp nào giúp chống ô nhiễm tiếng ồn?",
    "explain": "Cách ly và hấp thụ âm giúp giảm ồn.",
    "options": [
     "Đứng gần nguồn ồn",
     "Trồng cây xanh, xây tường chắn âm",
     "Mở to loa hơn",
     "Gõ mạnh hơn"
    ],
    "correct": 1
   },
   {
    "prompt": "Điều kiện để nghe được tiếng vang là âm phản xạ đến tai chậm hơn âm trực tiếp ít nhất:",
    "explain": "Ngưỡng phân biệt tiếng vang khoảng 1/15 s.",
    "options": [
     "10 giây",
     "1/100 giây",
     "1/15 giây",
     "1 giây"
    ],
    "correct": 2
   }
  ],
  "advanced": [
   {
    "prompt": "Vật thực hiện 600 dao động trong 5 giây. Tần số là bao nhiêu Hz? (chỉ ghi số)",
    "answer": "120",
    "solution": "600 : 5 = 120 Hz."
   },
   {
    "prompt": "Thấy chớp 4 giây sau thì nghe sấm. Biết tốc độ âm 340 m/s, nơi xảy ra sét cách bao nhiêu mét? (chỉ ghi số)",
    "answer": "1360",
    "solution": "340 × 4 = 1360 m."
   },
   {
    "prompt": "Tàu phát siêu âm xuống đáy biển, sau 0,4 s nhận được âm phản xạ. Biết tốc độ âm trong nước 1500 m/s. Biển sâu bao nhiêu mét? (chỉ ghi số)",
    "answer": "300",
    "solution": "Độ sâu = 1500 × 0,4 : 2 = 300 m."
   },
   {
    "prompt": "Với tốc độ âm 340 m/s, khoảng cách tối thiểu từ người đến vật phản xạ để nghe được tiếng vang là bao nhiêu mét? (làm tròn 1 chữ số thập phân)",
    "answer": "11,3|11.3",
    "solution": "340 × (1/15) : 2 ≈ 11,3 m."
   },
   {
    "prompt": "Hai âm có tần số 50 Hz và 500 Hz. Âm có tần số bao nhiêu Hz nghe cao (bổng) hơn? (chỉ ghi số)",
    "answer": "500",
    "solution": "Tần số lớn hơn thì âm cao hơn."
   }
  ]
 },
 {
  "id": "v3-anh-sang",
  "category": "vat-li",
  "title": "Ánh sáng",
  "summary": "## Ánh sáng\n\n- **Nguồn sáng** tự phát ra ánh sáng (Mặt Trời, bóng đèn đang sáng). Mặt Trăng không phải nguồn sáng vì chỉ hắt lại ánh sáng Mặt Trời.\n- Trong môi trường trong suốt, đồng tính, ánh sáng **truyền theo đường thẳng**. **Tia sáng** là đường thẳng có mũi tên chỉ hướng truyền. Có chùm sáng **song song, hội tụ, phân kì**.\n- **Vùng tối** là vùng không nhận được ánh sáng từ nguồn chiếu tới (do vật chắn); vùng **nửa tối** chỉ nhận một phần ánh sáng.\n\n**Phản xạ ánh sáng:**\n- Tia sáng gặp gương bị hắt trở lại. Gồm: tia tới, tia phản xạ, pháp tuyến (đường vuông góc với mặt gương tại điểm tới).\n- **Định luật:** tia phản xạ nằm trong mặt phẳng tới; **góc phản xạ = góc tới**. Góc được đo giữa tia sáng và **pháp tuyến**.\n\n**Ảnh qua gương phẳng:** là **ảnh ảo**, **cùng kích thước** với vật, và **đối xứng** với vật qua gương (khoảng cách từ ảnh đến gương bằng khoảng cách từ vật đến gương).",
  "quiz": [
   {
    "prompt": "Vật nào là nguồn sáng?",
    "explain": "Nguồn sáng tự phát ra ánh sáng.",
    "options": [
     "Quyển sách",
     "Bóng đèn đang sáng",
     "Tấm gương",
     "Mặt Trăng"
    ],
    "correct": 1
   },
   {
    "prompt": "Trong môi trường trong suốt, đồng tính, ánh sáng truyền theo:",
    "explain": "Ánh sáng truyền thẳng.",
    "options": [
     "Đường gấp khúc",
     "Đường cong",
     "Đường tròn",
     "Đường thẳng"
    ],
    "correct": 3
   },
   {
    "prompt": "Vùng tối là vùng:",
    "explain": "Bị vật chắn che hoàn toàn.",
    "options": [
     "Nhận toàn bộ ánh sáng",
     "Không nhận được ánh sáng từ nguồn chiếu tới",
     "Chỉ có ban đêm",
     "Luôn ở phía trước nguồn"
    ],
    "correct": 1
   },
   {
    "prompt": "Theo định luật phản xạ ánh sáng:",
    "explain": "Góc phản xạ = góc tới.",
    "options": [
     "Góc phản xạ bằng góc tới",
     "Góc phản xạ lớn hơn góc tới",
     "Không có quan hệ",
     "Góc phản xạ nhỏ hơn góc tới"
    ],
    "correct": 0
   },
   {
    "prompt": "Góc tới là góc giữa:",
    "explain": "Góc được đo từ pháp tuyến.",
    "options": [
     "Tia tới và mặt gương",
     "Tia phản xạ và mặt gương",
     "Hai mặt gương",
     "Tia tới và pháp tuyến"
    ],
    "correct": 3
   },
   {
    "prompt": "Ảnh của vật qua gương phẳng là:",
    "explain": "Đặc điểm ảnh qua gương phẳng.",
    "options": [
     "Ảnh ảo, lớn hơn vật",
     "Ảnh ảo, cùng kích thước với vật",
     "Ảnh thật, nhỏ hơn vật",
     "Ảnh thật, lớn hơn vật"
    ],
    "correct": 1
   },
   {
    "prompt": "Vật cách gương phẳng 2 m thì ảnh cách gương:",
    "explain": "Ảnh đối xứng với vật qua gương.",
    "options": [
     "1 m",
     "2 m",
     "4 m",
     "0,5 m"
    ],
    "correct": 1
   },
   {
    "prompt": "Chùm sáng song song gồm các tia sáng:",
    "explain": "Định nghĩa chùm sáng song song.",
    "options": [
     "Cắt nhau tại một điểm",
     "Song song với nhau",
     "Loe rộng ra",
     "Vuông góc với nhau"
    ],
    "correct": 1
   },
   {
    "prompt": "Vật nào KHÔNG phải nguồn sáng?",
    "explain": "Mặt Trăng chỉ hắt lại ánh sáng Mặt Trời.",
    "options": [
     "Ngọn nến đang cháy",
     "Mặt Trăng",
     "Đèn pin đang bật",
     "Mặt Trời"
    ],
    "correct": 1
   },
   {
    "prompt": "Tia tới hợp với mặt gương góc 30°. Góc tới bằng:",
    "explain": "Góc tới = 90° − 30° = 60°.",
    "options": [
     "90°",
     "60°",
     "120°",
     "30°"
    ],
    "correct": 1
   },
   {
    "prompt": "Góc tới bằng 40°. Góc giữa tia tới và tia phản xạ là:",
    "explain": "Góc phản xạ = 40°, tổng hai góc là 80°.",
    "options": [
     "80°",
     "140°",
     "40°",
     "20°"
    ],
    "correct": 0
   },
   {
    "prompt": "Người tiến lại gần gương phẳng với tốc độ 0,5 m/s. Khoảng cách giữa người và ảnh của mình giảm với tốc độ:",
    "explain": "Người và ảnh cùng tiến lại gần gương 0,5 m/s nên khoảng cách giảm 1 m/s.",
    "options": [
     "0,25 m/s",
     "0,5 m/s",
     "2 m/s",
     "1 m/s"
    ],
    "correct": 3
   }
  ],
  "advanced": [
   {
    "prompt": "Góc tới bằng 35°. Góc phản xạ bằng bao nhiêu độ? (chỉ ghi số)",
    "answer": "35",
    "solution": "Góc phản xạ = góc tới."
   },
   {
    "prompt": "Tia tới hợp với mặt gương góc 25°. Góc phản xạ bằng bao nhiêu độ? (chỉ ghi số)",
    "answer": "65",
    "solution": "Góc tới = 90° − 25° = 65° nên góc phản xạ = 65°."
   },
   {
    "prompt": "Vật đặt cách gương phẳng 1,2 m. Khoảng cách giữa vật và ảnh là bao nhiêu mét? (chỉ ghi số)",
    "answer": "2,4|2.4",
    "solution": "Ảnh cách gương 1,2 m nên vật–ảnh cách nhau 2,4 m."
   },
   {
    "prompt": "Góc tới ban đầu 50°, tăng thêm 10°. Khi đó góc giữa tia tới và tia phản xạ bằng bao nhiêu độ? (chỉ ghi số)",
    "answer": "120",
    "solution": "Góc tới mới 60° nên góc giữa hai tia = 2 × 60° = 120°."
   },
   {
    "prompt": "Người cao 1,6 m đứng trước gương phẳng. Ảnh của người cao bao nhiêu mét? (chỉ ghi số)",
    "answer": "1,6|1.6",
    "solution": "Ảnh bằng kích thước vật."
   }
  ]
 },
 {
  "id": "v4-tu",
  "category": "vat-li",
  "title": "Từ",
  "summary": "## Từ\n\n- **Nam châm** hút được sắt, niken, coban (các vật liệu từ). Mọi nam châm có **hai cực**: cực Bắc (N) và cực Nam (S). Cắt đôi nam châm, mỗi mảnh vẫn có đủ hai cực.\n- **Tương tác:** hai cực **cùng tên đẩy nhau**, **khác tên hút nhau**.\n- **La bàn** có kim nam châm tự do, khi cân bằng chỉ hướng Bắc – Nam (gần đúng). Trái Đất là một nam châm khổng lồ.\n\n**Từ trường:** không gian xung quanh nam châm (hoặc dòng điện) có khả năng tác dụng lực từ. Nhận biết bằng **kim nam châm thử**.\n\n**Đường sức từ:** đường vẽ mô tả từ trường. Bên ngoài nam châm, đường sức đi **ra từ cực Bắc, vào cực Nam**. Nơi đường sức **dày** thì từ trường **mạnh**.\n\n**Nam châm điện:** gồm cuộn dây có dòng điện chạy qua và **lõi sắt non**. Lực từ mạnh hơn khi **tăng số vòng dây** hoặc **tăng cường độ dòng điện**. Ngắt điện thì lõi sắt non mất từ tính. Ứng dụng: chuông điện, cần cẩu điện, rơ le.",
  "quiz": [
   {
    "prompt": "Nam châm hút được vật nào sau đây?",
    "explain": "Nam châm hút sắt, niken, coban.",
    "options": [
     "Đinh sắt",
     "Mẩu nhựa",
     "Mẩu gỗ",
     "Mẩu giấy"
    ],
    "correct": 0
   },
   {
    "prompt": "Hai cực của nam châm được gọi là:",
    "explain": "Nam châm có cực Bắc (N) và cực Nam (S).",
    "options": [
     "Cực trên và cực dưới",
     "Cực nóng và cực lạnh",
     "Cực Bắc và cực Nam",
     "Cực dương và cực âm"
    ],
    "correct": 2
   },
   {
    "prompt": "Hai cực cùng tên của hai nam châm đặt gần nhau sẽ:",
    "explain": "Cùng tên thì đẩy nhau.",
    "options": [
     "Không tác dụng",
     "Cùng quay tròn",
     "Hút nhau",
     "Đẩy nhau"
    ],
    "correct": 3
   },
   {
    "prompt": "Cắt đôi một thanh nam châm thì:",
    "explain": "Nam châm luôn có hai cực.",
    "options": [
     "Một mảnh chỉ có cực Bắc, mảnh kia chỉ có cực Nam",
     "Mỗi mảnh vẫn có hai cực",
     "Chỉ còn một cực",
     "Mất từ tính"
    ],
    "correct": 1
   },
   {
    "prompt": "Kim la bàn khi nằm cân bằng chỉ theo hướng:",
    "explain": "La bàn chỉ hướng Bắc – Nam.",
    "options": [
     "Đông – Tây",
     "Tây – Nam",
     "Đông – Bắc",
     "Bắc – Nam"
    ],
    "correct": 3
   },
   {
    "prompt": "Từ trường là:",
    "explain": "Khái niệm từ trường.",
    "options": [
     "Một vật bằng sắt",
     "Một loại chất khí",
     "Không gian xung quanh nam châm có khả năng tác dụng lực từ",
     "Một loại ánh sáng"
    ],
    "correct": 2
   },
   {
    "prompt": "Ta nhận biết từ trường bằng:",
    "explain": "Kim nam châm bị lệch khi đặt trong từ trường.",
    "options": [
     "Cân",
     "Kim nam châm thử",
     "Thước",
     "Nhiệt kế"
    ],
    "correct": 1
   },
   {
    "prompt": "Bên ngoài nam châm, đường sức từ đi:",
    "explain": "Quy ước chiều đường sức từ.",
    "options": [
     "Ra từ cực Bắc, vào cực Nam",
     "Song song với nam châm",
     "Ra từ cực Nam, vào cực Bắc",
     "Chỉ đi vào"
    ],
    "correct": 0
   },
   {
    "prompt": "Nơi đường sức từ dày thì từ trường:",
    "explain": "Đường sức dày → từ trường mạnh.",
    "options": [
     "Bằng 0",
     "Không xác định",
     "Mạnh",
     "Yếu"
    ],
    "correct": 2
   },
   {
    "prompt": "Nam châm điện gồm:",
    "explain": "Cấu tạo nam châm điện.",
    "options": [
     "Một miếng nhựa",
     "Một cục pin",
     "Cuộn dây có dòng điện chạy qua và lõi sắt non",
     "Chỉ một thanh thép"
    ],
    "correct": 2
   },
   {
    "prompt": "Cách làm tăng lực từ của nam châm điện là:",
    "explain": "Tăng số vòng dây, tăng dòng điện.",
    "options": [
     "Ngắt dòng điện",
     "Bỏ lõi sắt non",
     "Giảm số vòng dây",
     "Tăng số vòng dây hoặc tăng cường độ dòng điện"
    ],
    "correct": 3
   },
   {
    "prompt": "Lõi nam châm điện dùng sắt non vì sắt non:",
    "explain": "Nam châm điện cần bật/tắt được từ tính.",
    "options": [
     "Không dẫn điện",
     "Nhiễm từ nhanh và mất từ tính khi ngắt điện",
     "Không bị gỉ",
     "Nhẹ hơn thép"
    ],
    "correct": 1
   }
  ],
  "advanced": [
   {
    "prompt": "Đầu N của nam châm này đưa lại gần đầu N của nam châm kia thì hai nam châm hút hay đẩy nhau?",
    "answer": "đẩy|đẩy nhau",
    "solution": "Cùng tên thì đẩy nhau."
   },
   {
    "prompt": "Cực Bắc của kim nam châm (la bàn) chỉ về hướng nào (gần đúng)?",
    "answer": "bắc|hướng bắc",
    "solution": "Kim la bàn chỉ hướng Bắc – Nam."
   },
   {
    "prompt": "Có 4 vật: đinh sắt, đồng xu bằng đồng, kim nhôm, thanh niken. Có bao nhiêu vật bị nam châm hút? (chỉ ghi số)",
    "answer": "2",
    "solution": "Đinh sắt và thanh niken bị hút."
   },
   {
    "prompt": "Bên ngoài nam châm, đường sức từ đi ra từ cực nào (Bắc hay Nam)?",
    "answer": "bắc|cực bắc",
    "solution": "Đường sức đi ra từ cực Bắc."
   },
   {
    "prompt": "Nam châm điện có lõi sắt non, khi ngắt dòng điện thì lõi có còn từ tính không? (trả lời: còn / mất từ tính)",
    "answer": "mất từ tính|mất|không còn",
    "solution": "Lõi sắt non mất từ tính khi ngắt điện."
   }
  ]
 },
 {
  "id": "h1-nguyen-tu",
  "category": "hoa-hoc",
  "title": "Nguyên tử — Bảng tuần hoàn",
  "summary": "## Nguyên tử — Sơ lược về bảng tuần hoàn\n\n**Cấu tạo nguyên tử:**\n- **Hạt nhân:** gồm proton (mang điện **dương**) và neutron (**không** mang điện). Khối lượng nguyên tử tập trung chủ yếu ở hạt nhân.\n- **Vỏ:** các electron (mang điện **âm**) chuyển động xung quanh hạt nhân, xếp thành các **lớp**.\n- Nguyên tử **trung hòa về điện:** số proton = số electron.\n- **Số hiệu nguyên tử (Z)** = số proton. Lớp thứ nhất chứa tối đa 2 electron, lớp thứ hai tối đa 8 electron.\n- Khối lượng nguyên tử tính bằng **amu**; proton và neutron ≈ 1 amu, electron rất nhỏ.\n\n**Nguyên tố hóa học:** tập hợp các nguyên tử cùng loại, có **cùng số proton**; mỗi nguyên tố có một kí hiệu hóa học.\n\n**Bảng tuần hoàn:** sắp xếp theo chiều **tăng dần điện tích hạt nhân (số hiệu)**.\n- **Chu kì:** hàng ngang; số thứ tự chu kì = **số lớp electron**.\n- **Nhóm:** cột dọc; các nguyên tố cùng nhóm A có tính chất hóa học tương tự; số thứ tự nhóm A = **số electron lớp ngoài cùng**. Nhóm VIIIA là các khí hiếm.\n\n| Z | Kí hiệu | Tên | KL nguyên tử (amu) |\n|---|---|---|---|\n| 1 | H | Hydrogen | 1 |\n| 2 | He | Helium | 4 |\n| 3 | Li | Lithium | 7 |\n| 4 | Be | Beryllium | 9 |\n| 5 | B | Boron | 11 |\n| 6 | C | Carbon | 12 |\n| 7 | N | Nitrogen | 14 |\n| 8 | O | Oxygen | 16 |\n| 9 | F | Fluorine | 19 |\n| 10 | Ne | Neon | 20 |\n| 11 | Na | Sodium | 23 |\n| 12 | Mg | Magnesium | 24 |\n| 13 | Al | Aluminium | 27 |\n| 14 | Si | Silicon | 28 |\n| 15 | P | Phosphorus | 31 |\n| 16 | S | Sulfur | 32 |\n| 17 | Cl | Chlorine | 35,5 |\n| 18 | Ar | Argon | 40 |\n| 19 | K | Potassium | 39 |\n| 20 | Ca | Calcium | 40 |",
  "quiz": [
   {
    "prompt": "Nguyên tử gồm:",
    "explain": "Hạt nhân (proton, neutron) và lớp vỏ electron.",
    "options": [
     "Chỉ có proton",
     "Hạt nhân và vỏ electron",
     "Chỉ có neutron",
     "Chỉ có electron"
    ],
    "correct": 1
   },
   {
    "prompt": "Hạt mang điện dương trong nguyên tử là:",
    "explain": "Proton mang điện dương.",
    "options": [
     "Electron",
     "Không có",
     "Proton",
     "Neutron"
    ],
    "correct": 2
   },
   {
    "prompt": "Hạt không mang điện trong hạt nhân là:",
    "explain": "Neutron trung hòa về điện.",
    "options": [
     "Neutron",
     "Electron",
     "Ion",
     "Proton"
    ],
    "correct": 0
   },
   {
    "prompt": "Nguyên tử trung hòa về điện vì:",
    "explain": "Điện tích dương và âm cân bằng.",
    "options": [
     "Số neutron bằng số proton",
     "Có nhiều neutron",
     "Không có hạt mang điện",
     "Số proton bằng số electron"
    ],
    "correct": 3
   },
   {
    "prompt": "Số hiệu nguyên tử bằng:",
    "explain": "Z = số proton.",
    "options": [
     "Số proton",
     "Khối lượng nguyên tử",
     "Số lớp electron",
     "Số neutron"
    ],
    "correct": 0
   },
   {
    "prompt": "Nguyên tố hóa học là tập hợp các nguyên tử cùng loại có cùng số:",
    "explain": "Cùng số proton là cùng nguyên tố.",
    "options": [
     "Lớp electron",
     "Neutron",
     "Proton",
     "Phân tử"
    ],
    "correct": 2
   },
   {
    "prompt": "Bảng tuần hoàn được sắp xếp theo chiều tăng dần của:",
    "explain": "Sắp xếp theo số hiệu (điện tích hạt nhân).",
    "options": [
     "Điện tích hạt nhân",
     "Tên nguyên tố",
     "Màu sắc",
     "Khối lượng riêng"
    ],
    "correct": 0
   },
   {
    "prompt": "Chu kì trong bảng tuần hoàn là:",
    "explain": "Chu kì là các hàng ngang.",
    "options": [
     "Cột dọc",
     "Đường chéo",
     "Hàng ngang",
     "Ô nguyên tố"
    ],
    "correct": 2
   },
   {
    "prompt": "Khối lượng của nguyên tử tập trung chủ yếu ở:",
    "explain": "Electron có khối lượng rất nhỏ.",
    "options": [
     "Khoảng trống",
     "Hạt nhân",
     "Lớp electron ngoài cùng",
     "Lớp vỏ"
    ],
    "correct": 1
   },
   {
    "prompt": "Nguyên tử có Z = 11 có số electron lớp ngoài cùng là:",
    "explain": "Cấu hình 2, 8, 1.",
    "options": [
     "1",
     "2",
     "8",
     "11"
    ],
    "correct": 0
   },
   {
    "prompt": "Nguyên tử X có 17 proton (cấu hình 2, 8, 7) thuộc nhóm:",
    "explain": "7 electron lớp ngoài cùng nên nhóm VIIA.",
    "options": [
     "VIA",
     "IA",
     "VIIIA",
     "VIIA"
    ],
    "correct": 3
   },
   {
    "prompt": "Nguyên tử Y có 3 lớp electron, lớp ngoài cùng có 6 electron. Số proton của Y là:",
    "explain": "2 + 8 + 6 = 16 electron = 16 proton.",
    "options": [
     "8",
     "6",
     "16",
     "18"
    ],
    "correct": 2
   }
  ],
  "advanced": [
   {
    "prompt": "Nguyên tử oxygen có 8 proton. Có bao nhiêu electron? (chỉ ghi số)",
    "answer": "8",
    "solution": "Số electron = số proton."
   },
   {
    "prompt": "Nguyên tử magnesium (Z = 12) có bao nhiêu electron ở lớp ngoài cùng? (chỉ ghi số)",
    "answer": "2",
    "solution": "Cấu hình 2, 8, 2."
   },
   {
    "prompt": "Nguyên tử có 2 lớp electron, lớp ngoài cùng có 5 electron. Số hiệu nguyên tử là bao nhiêu? (chỉ ghi số)",
    "answer": "7",
    "solution": "2 + 5 = 7."
   },
   {
    "prompt": "Nguyên tố thuộc chu kì 3, nhóm IA có số hiệu nguyên tử là bao nhiêu? (chỉ ghi số)",
    "answer": "11",
    "solution": "Đó là sodium: Z = 11 (2, 8, 1)."
   },
   {
    "prompt": "Kí hiệu hóa học của nguyên tố potassium (kali) là gì?",
    "answer": "K",
    "solution": "Kí hiệu là K."
   }
  ]
 },
 {
  "id": "h2-phan-tu",
  "category": "hoa-hoc",
  "title": "Phân tử — Liên kết hóa học — Hóa trị",
  "summary": "## Phân tử — Liên kết hóa học — Hóa trị\n\n**Đơn chất** do **một** nguyên tố hóa học tạo nên (O₂, H₂, Fe, C). **Hợp chất** do **hai hay nhiều** nguyên tố tạo nên (H₂O, CO₂, NaCl).\n\n**Phân tử** là hạt đại diện cho chất, gồm một số nguyên tử liên kết với nhau. **Khối lượng phân tử** = tổng khối lượng các nguyên tử trong phân tử (ví dụ H₂O = 18 amu, CO₂ = 44 amu).\n\n**Liên kết hóa học** hình thành do các nguyên tử có xu hướng đạt cấu hình bền của khí hiếm (quy tắc octet: 8 electron lớp ngoài, riêng He là 2).\n- **Liên kết ion:** giữa kim loại và phi kim; nguyên tử này **nhường** electron, nguyên tử kia **nhận** electron tạo ion trái dấu hút nhau (NaCl). Hợp chất ion thường có nhiệt độ nóng chảy cao, tan trong nước và dẫn điện khi tan hoặc nóng chảy.\n- **Liên kết cộng hóa trị:** giữa các phi kim; các nguyên tử **dùng chung** electron (H₂, O₂, H₂O, CO₂). Hợp chất cộng hóa trị thường có nhiệt độ nóng chảy thấp.\n\n**Hóa trị:** khả năng liên kết của nguyên tử. Ví dụ: H (I), O (II), Na (I), Ca (II), Mg (II), Al (III), Cl (I). Quy tắc: tích chỉ số × hóa trị của nguyên tố này bằng nhân tố kia (Al₂O₃: 2×III = 3×II).\n\n**% khối lượng nguyên tố** = (khối lượng nguyên tố trong 1 phân tử / khối lượng phân tử) × 100%.",
  "quiz": [
   {
    "prompt": "Đơn chất là chất được tạo nên từ:",
    "explain": "Định nghĩa đơn chất.",
    "options": [
     "Nhiều phân tử nước",
     "Một nguyên tố hóa học",
     "Ba nguyên tố hóa học",
     "Hai nguyên tố hóa học"
    ],
    "correct": 1
   },
   {
    "prompt": "Hợp chất là chất được tạo nên từ:",
    "explain": "Định nghĩa hợp chất.",
    "options": [
     "Hai hay nhiều nguyên tố hóa học",
     "Không có nguyên tố nào",
     "Một nguyên tử duy nhất",
     "Một nguyên tố hóa học"
    ],
    "correct": 0
   },
   {
    "prompt": "Chất nào sau đây là hợp chất?",
    "explain": "Nước gồm hai nguyên tố H và O.",
    "options": [
     "O₂",
     "Fe",
     "H₂O",
     "H₂"
    ],
    "correct": 2
   },
   {
    "prompt": "Khối lượng phân tử nước H₂O (H = 1, O = 16) là:",
    "explain": "2 × 1 + 16 = 18.",
    "options": [
     "32 amu",
     "17 amu",
     "16 amu",
     "18 amu"
    ],
    "correct": 3
   },
   {
    "prompt": "Liên kết ion hình thành giữa:",
    "explain": "Kim loại nhường e, phi kim nhận e.",
    "options": [
     "Hai khí hiếm",
     "Hai phi kim",
     "Hai kim loại",
     "Kim loại và phi kim"
    ],
    "correct": 3
   },
   {
    "prompt": "Liên kết trong phân tử H₂ là liên kết:",
    "explain": "Hai nguyên tử H dùng chung electron.",
    "options": [
     "Kim loại",
     "Ion",
     "Cộng hóa trị",
     "Không có liên kết"
    ],
    "correct": 2
   },
   {
    "prompt": "Quy tắc octet nói rằng nguyên tử có xu hướng:",
    "explain": "Đạt 8 electron lớp ngoài (hoặc 2 với He).",
    "options": [
     "Mất hết electron",
     "Nhận thêm proton",
     "Tăng khối lượng",
     "Đạt cấu hình bền của khí hiếm"
    ],
    "correct": 3
   },
   {
    "prompt": "Hóa trị của oxygen trong hợp chất thường là:",
    "explain": "O có hóa trị II.",
    "options": [
     "IV",
     "III",
     "II",
     "I"
    ],
    "correct": 2
   },
   {
    "prompt": "Công thức hóa học của nhôm oxide (Al hóa trị III, O hóa trị II) là:",
    "explain": "2 × III = 3 × II.",
    "options": [
     "Al₃O₂",
     "Al₂O₃",
     "AlO",
     "AlO₂"
    ],
    "correct": 1
   },
   {
    "prompt": "Khối lượng phân tử CO₂ (C = 12, O = 16) là:",
    "explain": "12 + 2 × 16 = 44.",
    "options": [
     "44 amu",
     "32 amu",
     "28 amu",
     "60 amu"
    ],
    "correct": 0
   },
   {
    "prompt": "Đặc điểm của hợp chất ion như NaCl là:",
    "explain": "Hợp chất ion có nhiệt độ nóng chảy cao.",
    "options": [
     "Nóng chảy ở nhiệt độ rất thấp",
     "Nóng chảy ở nhiệt độ cao, tan trong nước",
     "Luôn là chất khí",
     "Không tan trong nước"
    ],
    "correct": 1
   },
   {
    "prompt": "Phần trăm khối lượng oxygen trong H₂O (H = 1, O = 16) gần bằng:",
    "explain": "16/18 × 100% ≈ 88,9%.",
    "options": [
     "50%",
     "88,9%",
     "11,1%",
     "16%"
    ],
    "correct": 1
   }
  ],
  "advanced": [
   {
    "prompt": "Tính khối lượng phân tử CaCO₃ (Ca = 40, C = 12, O = 16). (chỉ ghi số, amu)",
    "answer": "100",
    "solution": "40 + 12 + 3 × 16 = 100."
   },
   {
    "prompt": "Trong Fe₂O₃ (O hóa trị II), sắt có hóa trị mấy? (ghi số hoặc chữ số La Mã)",
    "answer": "3|III|iii",
    "solution": "2 × x = 3 × II nên x = III."
   },
   {
    "prompt": "Viết công thức hóa học của hợp chất tạo bởi Mg (hóa trị II) và Cl (hóa trị I).",
    "answer": "MgCl2",
    "solution": "II × 1 = I × 2 nên công thức là MgCl₂."
   },
   {
    "prompt": "Tính % khối lượng của Fe trong Fe₂O₃ (Fe = 56, O = 16). (chỉ ghi số)",
    "answer": "70|70%",
    "solution": "112 : 160 × 100% = 70%."
   },
   {
    "prompt": "Tính khối lượng phân tử H₂SO₄ (H = 1, S = 32, O = 16). (chỉ ghi số, amu)",
    "answer": "98",
    "solution": "2 + 32 + 64 = 98."
   }
  ]
 },
 {
  "id": "s1-khai-quat",
  "category": "sinh-hoc",
  "title": "Khái quát trao đổi chất và chuyển hóa năng lượng",
  "summary": "## Khái quát trao đổi chất và chuyển hóa năng lượng\n\n**Trao đổi chất** là quá trình cơ thể lấy các chất từ môi trường (thức ăn, nước, khí oxygen...), biến đổi chúng thành chất cần thiết cho cơ thể, đồng thời giải phóng năng lượng và thải chất thải ra môi trường.\n\nTrao đổi chất gồm hai mặt:\n- **Đồng hóa:** tổng hợp chất đơn giản thành chất phức tạp và tích lũy năng lượng.\n- **Dị hóa:** phân giải chất phức tạp thành chất đơn giản và giải phóng năng lượng.\n\n**Chuyển hóa năng lượng:**\n- Quang hợp: **quang năng → hóa năng** (tích lũy trong chất hữu cơ).\n- Hô hấp: **hóa năng → nhiệt năng và năng lượng cho hoạt động sống**.\n\nThực vật (sinh vật tự dưỡng) lấy năng lượng từ **ánh sáng**; động vật lấy năng lượng từ **thức ăn**.\n\n**Cơ thể sinh vật là một thể thống nhất:** các cơ quan, hệ cơ quan phối hợp hoạt động chặt chẽ với nhau và với môi trường (ví dụ khi chạy nhanh, tim đập nhanh và thở nhanh hơn để cung cấp thêm oxygen).",
  "quiz": [
   {
    "prompt": "Trao đổi chất là quá trình cơ thể:",
    "explain": "Đây là khái niệm trao đổi chất.",
    "options": [
     "Chỉ lấy thức ăn",
     "Chỉ hô hấp",
     "Lấy chất từ môi trường, biến đổi và thải chất thải ra môi trường",
     "Chỉ thải chất thải"
    ],
    "correct": 2
   },
   {
    "prompt": "Đồng hóa là quá trình:",
    "explain": "Đồng hóa tích lũy năng lượng.",
    "options": [
     "Phân giải chất, giải phóng năng lượng",
     "Thải nước tiểu",
     "Tổng hợp chất phức tạp từ chất đơn giản, tích lũy năng lượng",
     "Hấp thụ khí oxygen"
    ],
    "correct": 2
   },
   {
    "prompt": "Dị hóa là quá trình:",
    "explain": "Dị hóa giải phóng năng lượng.",
    "options": [
     "Phân giải chất phức tạp, giải phóng năng lượng",
     "Tổng hợp chất hữu cơ",
     "Tạo hợp tử",
     "Tích lũy năng lượng"
    ],
    "correct": 0
   },
   {
    "prompt": "Trong quang hợp, năng lượng được chuyển hóa từ:",
    "explain": "Quang hợp tích lũy năng lượng ánh sáng vào chất hữu cơ.",
    "options": [
     "Quang năng thành hóa năng",
     "Cơ năng thành quang năng",
     "Nhiệt năng thành điện năng",
     "Hóa năng thành nhiệt năng"
    ],
    "correct": 0
   },
   {
    "prompt": "Trong hô hấp, hóa năng chuyển thành:",
    "explain": "Hô hấp giải phóng năng lượng.",
    "options": [
     "Chỉ điện năng",
     "Nhiệt năng và năng lượng cho hoạt động sống",
     "Quang năng",
     "Không chuyển hóa"
    ],
    "correct": 1
   },
   {
    "prompt": "Thực vật lấy năng lượng để sống từ:",
    "explain": "Thực vật tự dưỡng nhờ quang hợp.",
    "options": [
     "Ánh sáng mặt trời",
     "Thức ăn có sẵn",
     "Đất đá",
     "Gió"
    ],
    "correct": 0
   },
   {
    "prompt": "Động vật lấy năng lượng từ:",
    "explain": "Động vật là sinh vật dị dưỡng.",
    "options": [
     "Thức ăn",
     "Ánh sáng",
     "Nhiệt độ môi trường",
     "Không khí"
    ],
    "correct": 0
   },
   {
    "prompt": "Chất thải nào sau đây do cơ thể người thải ra?",
    "explain": "Đó là các sản phẩm thải.",
    "options": [
     "Vitamin",
     "Khí oxygen",
     "Khí carbon dioxide, nước tiểu, mồ hôi",
     "Ánh sáng"
    ],
    "correct": 2
   },
   {
    "prompt": "Ý nghĩa quan trọng nhất của trao đổi chất là:",
    "explain": "Trao đổi chất là đặc trưng của sự sống.",
    "options": [
     "Duy trì sự sống của cơ thể",
     "Làm cơ thể nặng hơn",
     "Tạo ra màu sắc",
     "Giúp cơ thể đứng yên"
    ],
    "correct": 0
   },
   {
    "prompt": "Ban ngày, cây xanh lấy vào và thải ra (trong quang hợp):",
    "explain": "Quang hợp dùng CO₂ tạo O₂.",
    "options": [
     "Lấy N₂, thải H₂",
     "Lấy CO₂, thải O₂",
     "Lấy O₂, thải CO₂",
     "Lấy H₂O, thải N₂"
    ],
    "correct": 1
   },
   {
    "prompt": "'Cơ thể là một thể thống nhất' nghĩa là:",
    "explain": "Các hệ cơ quan phối hợp chặt chẽ.",
    "options": [
     "Chỉ có một cơ quan duy nhất",
     "Mỗi cơ quan hoạt động riêng lẻ",
     "Các cơ quan phối hợp hoạt động với nhau",
     "Cơ thể không cần môi trường"
    ],
    "correct": 2
   },
   {
    "prompt": "Khi chạy nhanh, tim đập nhanh và thở nhanh hơn vì:",
    "explain": "Tăng nhu cầu năng lượng nên hô hấp và tuần hoàn tăng.",
    "options": [
     "Cơ thể đang nghỉ ngơi",
     "Cơ thể cần nhiều năng lượng và oxygen hơn",
     "Cơ thể không cần oxygen",
     "Cơ thể thải ít CO₂"
    ],
    "correct": 1
   }
  ],
  "advanced": [
   {
    "prompt": "Quá trình tổng hợp chất phức tạp từ chất đơn giản và tích lũy năng lượng gọi là gì?",
    "answer": "đồng hóa",
    "solution": "Đó là đồng hóa."
   },
   {
    "prompt": "Quá trình phân giải chất phức tạp giải phóng năng lượng gọi là gì?",
    "answer": "dị hóa",
    "solution": "Đó là dị hóa."
   },
   {
    "prompt": "Dạng năng lượng được tích lũy trong chất hữu cơ là gì?",
    "answer": "hóa năng",
    "solution": "Đó là hóa năng."
   },
   {
    "prompt": "Thực vật chuyển hóa quang năng thành dạng năng lượng nào?",
    "answer": "hóa năng",
    "solution": "Quang hợp: quang năng thành hóa năng."
   },
   {
    "prompt": "Sinh vật lấy khí nào từ môi trường để hô hấp?",
    "answer": "oxygen|o2|oxi|khí oxygen",
    "solution": "Hô hấp cần khí oxygen."
   }
  ]
 },
 {
  "id": "s2-quang-hop",
  "category": "sinh-hoc",
  "title": "Quang hợp ở thực vật",
  "summary": "## Quang hợp ở thực vật\n\n**Quang hợp** là quá trình lá cây hấp thụ **năng lượng ánh sáng** nhờ **chất diệp lục**, dùng **carbon dioxide** và **nước** để tạo **chất hữu cơ (glucose, tinh bột)** và giải phóng **oxygen**.\n\n**Phương trình chữ:** Carbon dioxide + Nước —(ánh sáng, diệp lục)→ Glucose + Oxygen\n\n- **Nơi diễn ra:** chủ yếu ở lá, trong **lục lạp** (chứa diệp lục).\n- **Nguyên liệu:** nước do rễ hút, đi lên theo **mạch gỗ**; CO₂ từ không khí vào lá qua **khí khổng**.\n- **Sản phẩm:** chất hữu cơ được vận chuyển đi các bộ phận qua **mạch rây**; O₂ thoát ra ngoài qua khí khổng.\n\n**Các yếu tố ảnh hưởng:** ánh sáng, nồng độ CO₂, nước, nhiệt độ.\n\n**Thực hành chứng minh:** dùng dung dịch **iodine** thử tinh bột (xanh tím = có tinh bột); lá bị che sáng không tạo tinh bột; cây thủy sinh ngoài sáng thải bọt khí O₂.\n\n**Vai trò:** cung cấp chất hữu cơ và năng lượng cho sinh vật, cung cấp O₂, hấp thụ CO₂ giúp điều hòa không khí. Ứng dụng: trồng cây đủ sáng, tưới nước, bón phân, tăng CO₂ và chiếu sáng trong nhà kính.",
  "quiz": [
   {
    "prompt": "Quang hợp diễn ra chủ yếu ở bộ phận nào của cây?",
    "explain": "Lá chứa nhiều lục lạp.",
    "options": [
     "Hạt khô",
     "Lá",
     "Rễ",
     "Thân gỗ"
    ],
    "correct": 1
   },
   {
    "prompt": "Nguyên liệu của quang hợp gồm:",
    "explain": "CO₂ và H₂O.",
    "options": [
     "Carbon dioxide và nước",
     "Glucose và nước",
     "Oxygen và nitrogen",
     "Oxygen và glucose"
    ],
    "correct": 0
   },
   {
    "prompt": "Sản phẩm của quang hợp là:",
    "explain": "Chất hữu cơ và O₂.",
    "options": [
     "Glucose (tinh bột) và oxygen",
     "Nước và năng lượng",
     "Oxygen và nitrogen",
     "CO₂ và nước"
    ],
    "correct": 0
   },
   {
    "prompt": "Năng lượng cho quang hợp lấy từ:",
    "explain": "Quang hợp cần ánh sáng.",
    "options": [
     "Gió",
     "Ánh sáng",
     "Nhiệt của đất",
     "Nước"
    ],
    "correct": 1
   },
   {
    "prompt": "Chất diệp lục có vai trò:",
    "explain": "Diệp lục hấp thụ năng lượng ánh sáng.",
    "options": [
     "Hút khoáng",
     "Vận chuyển nước",
     "Hấp thụ ánh sáng",
     "Thải chất thải"
    ],
    "correct": 2
   },
   {
    "prompt": "CO₂ đi vào lá qua:",
    "explain": "Khí khổng là cửa trao đổi khí.",
    "options": [
     "Lông hút",
     "Mạch rây",
     "Mạch gỗ",
     "Khí khổng"
    ],
    "correct": 3
   },
   {
    "prompt": "Nước từ rễ lên lá theo:",
    "explain": "Mạch gỗ vận chuyển nước và muối khoáng.",
    "options": [
     "Lục lạp",
     "Khí khổng",
     "Mạch rây",
     "Mạch gỗ"
    ],
    "correct": 3
   },
   {
    "prompt": "Chất hữu cơ tạo ra ở lá được vận chuyển đi các bộ phận theo:",
    "explain": "Mạch rây vận chuyển chất hữu cơ.",
    "options": [
     "Khí khổng",
     "Mạch gỗ",
     "Mạch rây",
     "Lông hút"
    ],
    "correct": 2
   },
   {
    "prompt": "Thuốc thử dùng nhận biết tinh bột là:",
    "explain": "Iodine chuyển xanh tím khi có tinh bột.",
    "options": [
     "Dầu ăn",
     "Nước cất",
     "Dung dịch iodine",
     "Nước vôi trong"
    ],
    "correct": 2
   },
   {
    "prompt": "Yếu tố nào KHÔNG trực tiếp ảnh hưởng đến quang hợp?",
    "explain": "Ánh sáng, CO₂, nước, nhiệt độ mới ảnh hưởng trực tiếp.",
    "options": [
     "Màu sắc cánh hoa",
     "Nồng độ CO₂",
     "Nhiệt độ",
     "Ánh sáng"
    ],
    "correct": 0
   },
   {
    "prompt": "Người ta bổ sung CO₂ và ánh sáng trong nhà kính nhằm:",
    "explain": "Đáp ứng đủ nguyên liệu và năng lượng.",
    "options": [
     "Làm cây ngừng hô hấp",
     "Giảm chất hữu cơ",
     "Tăng hiệu quả quang hợp, tăng năng suất",
     "Giảm sinh trưởng"
    ],
    "correct": 2
   },
   {
    "prompt": "Che một phần lá bằng giấy đen, thử iodine thấy chỗ bị che không xanh tím. Kết luận:",
    "explain": "Chỗ bị che không quang hợp nên không có tinh bột.",
    "options": [
     "Cây không cần nước",
     "Ánh sáng cần cho quang hợp tạo tinh bột",
     "Iodine hư",
     "Lá không có khí khổng"
    ],
    "correct": 1
   }
  ],
  "advanced": [
   {
    "prompt": "Khí nào được giải phóng ra trong quang hợp?",
    "answer": "oxygen|o2|oxi|khí oxygen",
    "solution": "Quang hợp thải oxygen."
   },
   {
    "prompt": "Quang hợp diễn ra ở bào quan nào của tế bào lá?",
    "answer": "lục lạp",
    "solution": "Lục lạp chứa chất diệp lục."
   },
   {
    "prompt": "Chất nào dùng để thử tinh bột (tên dung dịch)?",
    "answer": "iodine|iot|iode|i ot|dung dịch iodine",
    "solution": "Iodine chuyển xanh tím với tinh bột."
   },
   {
    "prompt": "Chất hữu cơ (đường) tạo ra trong quang hợp có tên là gì?",
    "answer": "glucose|glucozo|glucôzơ|đường glucose",
    "solution": "Sản phẩm là glucose."
   },
   {
    "prompt": "Bộ phận của lá cho CO₂ đi vào và hơi nước thoát ra là gì?",
    "answer": "khí khổng",
    "solution": "Khí khổng."
   }
  ]
 },
 {
  "id": "s3-ho-hap",
  "category": "sinh-hoc",
  "title": "Hô hấp tế bào",
  "summary": "## Hô hấp tế bào\n\n**Hô hấp tế bào** là quá trình tế bào **phân giải chất hữu cơ** (như glucose) **với sự tham gia của oxygen**, tạo ra **carbon dioxide, nước** và **giải phóng năng lượng**.\n\n**Phương trình chữ:** Glucose + Oxygen → Carbon dioxide + Nước + Năng lượng\n\n- **Nơi diễn ra:** ở mọi tế bào sống, chủ yếu trong **ti thể**; diễn ra **cả ngày và đêm**.\n- Năng lượng giải phóng dùng cho các hoạt động sống và một phần thoát ra dưới dạng **nhiệt**.\n- Hô hấp là quá trình **dị hóa**; quang hợp tích lũy năng lượng còn hô hấp giải phóng năng lượng.\n\n**Các yếu tố ảnh hưởng:** nồng độ oxygen, nồng độ CO₂, nước, nhiệt độ.\n\n**Thực hành:** hạt đang nảy mầm hô hấp mạnh — làm nước vôi trong bị đục (có CO₂), làm nhiệt độ tăng, làm ngọn nến tắt trong bình kín (hết O₂).\n\n**Ứng dụng bảo quản nông sản:** giảm hô hấp bằng cách hạ nhiệt độ, giảm oxygen, giữ khô (phơi khô thóc, kho lạnh). Xới đất giúp rễ có đủ oxygen để hô hấp.",
  "quiz": [
   {
    "prompt": "Hô hấp tế bào là quá trình:",
    "explain": "Đây là bản chất của hô hấp.",
    "options": [
     "Phân giải chất hữu cơ giải phóng năng lượng",
     "Thải phân",
     "Tổng hợp chất hữu cơ từ CO₂",
     "Hấp thụ ánh sáng"
    ],
    "correct": 0
   },
   {
    "prompt": "Nguyên liệu của hô hấp tế bào là:",
    "explain": "Chất hữu cơ và O₂.",
    "options": [
     "Oxygen và nitrogen",
     "CO₂ và nước",
     "Glucose và oxygen",
     "Nước và ánh sáng"
    ],
    "correct": 2
   },
   {
    "prompt": "Sản phẩm của hô hấp tế bào gồm:",
    "explain": "Đó là các sản phẩm của hô hấp.",
    "options": [
     "CO₂, nước và năng lượng",
     "Tinh bột",
     "Glucose và O₂",
     "Nitrogen"
    ],
    "correct": 0
   },
   {
    "prompt": "Hô hấp tế bào diễn ra chủ yếu ở:",
    "explain": "Ti thể là 'nhà máy năng lượng'.",
    "options": [
     "Lục lạp",
     "Không bào",
     "Ti thể",
     "Khí khổng"
    ],
    "correct": 2
   },
   {
    "prompt": "Hô hấp ở thực vật diễn ra:",
    "explain": "Mọi tế bào sống đều hô hấp liên tục.",
    "options": [
     "Chỉ ban đêm",
     "Chỉ ban ngày",
     "Cả ngày và đêm",
     "Chỉ khi có mưa"
    ],
    "correct": 2
   },
   {
    "prompt": "Dấu hiệu nhận biết CO₂ là:",
    "explain": "CO₂ làm đục nước vôi trong.",
    "options": [
     "Làm nước vôi trong hóa đục",
     "Làm que đóm bùng cháy",
     "Làm quỳ hóa đỏ",
     "Làm nước vôi trong sủi bọt xanh"
    ],
    "correct": 0
   },
   {
    "prompt": "Hạt nảy mầm hô hấp mạnh nên:",
    "explain": "Hô hấp giải phóng nhiệt.",
    "options": [
     "Khối hạt không đổi",
     "Hạt hóa lỏng",
     "Nhiệt độ khối hạt tăng",
     "Nhiệt độ khối hạt giảm"
    ],
    "correct": 2
   },
   {
    "prompt": "Khi bảo quản nông sản, để giảm hô hấp cần:",
    "explain": "Giảm hô hấp thì nông sản để được lâu.",
    "options": [
     "Đặt ngoài trời nắng",
     "Tăng nhiệt độ",
     "Hạ nhiệt độ, giữ khô, giảm oxygen",
     "Làm ẩm"
    ],
    "correct": 2
   },
   {
    "prompt": "Hô hấp và quang hợp khác nhau ở chỗ:",
    "explain": "Hai quá trình trái ngược nhau.",
    "options": [
     "Cả hai đều giải phóng năng lượng",
     "Quang hợp tích lũy năng lượng, hô hấp giải phóng năng lượng",
     "Cả hai chỉ ở động vật",
     "Cả hai đều tích lũy năng lượng"
    ],
    "correct": 1
   },
   {
    "prompt": "Xới đất tơi xốp cho cây giúp:",
    "explain": "Rễ cần O₂ để hô hấp.",
    "options": [
     "Lá quang hợp nhiều hơn ngay",
     "Cây hết cần nước",
     "Đất bớt nước hoàn toàn",
     "Rễ có đủ oxygen để hô hấp"
    ],
    "correct": 3
   },
   {
    "prompt": "Phơi khô thóc trước khi cất giữ nhằm:",
    "explain": "Ít nước thì hô hấp yếu.",
    "options": [
     "Làm hạt nảy mầm",
     "Tăng hô hấp",
     "Giảm hô hấp, hạn chế hỏng hạt",
     "Tăng khối lượng"
    ],
    "correct": 2
   },
   {
    "prompt": "Hô hấp tế bào thuộc quá trình nào của trao đổi chất?",
    "explain": "Phân giải chất, giải phóng năng lượng.",
    "options": [
     "Quang hợp",
     "Đồng hóa",
     "Sinh sản",
     "Dị hóa"
    ],
    "correct": 3
   }
  ],
  "advanced": [
   {
    "prompt": "Khí nào bị hấp thụ khi hô hấp?",
    "answer": "oxygen|o2|oxi|khí oxygen",
    "solution": "Hô hấp dùng oxygen."
   },
   {
    "prompt": "Khí nào được thải ra khi hô hấp?",
    "answer": "carbon dioxide|co2|khí carbon dioxide|khí co2",
    "solution": "Hô hấp thải CO₂."
   },
   {
    "prompt": "Bào quan chủ yếu diễn ra hô hấp tế bào là gì?",
    "answer": "ti thể",
    "solution": "Ti thể."
   },
   {
    "prompt": "Dung dịch nào dùng để phát hiện khí CO₂?",
    "answer": "nước vôi trong|nuoc voi trong",
    "solution": "Nước vôi trong hóa đục khi gặp CO₂."
   },
   {
    "prompt": "Hô hấp tế bào thuộc đồng hóa hay dị hóa?",
    "answer": "dị hóa",
    "solution": "Hô hấp phân giải chất nên là dị hóa."
   }
  ]
 },
 {
  "id": "s4-trao-doi-khi",
  "category": "sinh-hoc",
  "title": "Trao đổi khí ở sinh vật",
  "summary": "## Trao đổi khí ở sinh vật\n\n**Trao đổi khí** là quá trình sinh vật lấy O₂ và thải CO₂ (hô hấp), đồng thời ở thực vật còn lấy CO₂ và thải O₂ (quang hợp).\n\n**Đặc điểm bề mặt trao đổi khí hiệu quả:** mỏng, ẩm ướt, diện tích lớn, có nhiều mạch máu (mao mạch) — ở động vật; ở thực vật là khí khổng.\n\n| Sinh vật | Cơ quan trao đổi khí |\n|---|---|\n| Thực vật | Khí khổng (chủ yếu ở mặt dưới lá) |\n| Giun đất | Da (bề mặt cơ thể ẩm) |\n| Cá, tôm | Mang |\n| Côn trùng | Hệ thống ống khí |\n| Ếch | Da và phổi |\n| Chim, thú, người | Phổi |\n\n**Khí khổng:** gồm hai tế bào bảo vệ hình hạt đậu; mở khi đủ nước, đóng khi thiếu nước. Khí khổng đóng thì CO₂ khó vào lá nên quang hợp giảm.\n\n**Ở người:** không khí đi qua mũi, họng, thanh quản, khí quản, phế quản rồi vào phổi; trao đổi khí diễn ra ở **phế nang**.",
  "quiz": [
   {
    "prompt": "Thực vật trao đổi khí với môi trường qua:",
    "explain": "Khí khổng là cửa trao đổi khí.",
    "options": [
     "Lông hút",
     "Mạch rây",
     "Khí khổng",
     "Mạch gỗ"
    ],
    "correct": 2
   },
   {
    "prompt": "Khí khổng nằm chủ yếu ở:",
    "explain": "Mặt dưới lá có nhiều khí khổng.",
    "options": [
     "Thân gỗ",
     "Rễ",
     "Hạt",
     "Mặt dưới lá"
    ],
    "correct": 3
   },
   {
    "prompt": "Cá trao đổi khí bằng:",
    "explain": "Cá hô hấp bằng mang.",
    "options": [
     "Mang",
     "Ống khí",
     "Phổi",
     "Da khô"
    ],
    "correct": 0
   },
   {
    "prompt": "Côn trùng trao đổi khí bằng:",
    "explain": "Đặc điểm của côn trùng.",
    "options": [
     "Lông hút",
     "Mang",
     "Phổi",
     "Hệ thống ống khí"
    ],
    "correct": 3
   },
   {
    "prompt": "Giun đất trao đổi khí qua:",
    "explain": "Da giun ẩm ướt.",
    "options": [
     "Mang",
     "Phổi",
     "Da (bề mặt cơ thể ẩm)",
     "Khí khổng"
    ],
    "correct": 2
   },
   {
    "prompt": "Ở người, trao đổi khí diễn ra chủ yếu ở:",
    "explain": "Phế nang có nhiều mao mạch.",
    "options": [
     "Dạ dày",
     "Ruột non",
     "Phế nang",
     "Thực quản"
    ],
    "correct": 2
   },
   {
    "prompt": "Bề mặt trao đổi khí hiệu quả thường:",
    "explain": "Thuận lợi cho khí khuếch tán.",
    "options": [
     "Không có mạch máu",
     "Mỏng, ẩm, diện tích lớn",
     "Dày và khô",
     "Nhỏ và cứng"
    ],
    "correct": 1
   },
   {
    "prompt": "Khí khổng mở khi:",
    "explain": "Đủ nước thì khí khổng mở.",
    "options": [
     "Trời rất lạnh",
     "Cây thiếu nước",
     "Không có ánh sáng",
     "Tế bào bảo vệ no nước"
    ],
    "correct": 3
   },
   {
    "prompt": "Ếch trao đổi khí bằng:",
    "explain": "Ếch dùng cả da và phổi.",
    "options": [
     "Da và phổi",
     "Chỉ khí khổng",
     "Chỉ ống khí",
     "Chỉ mang"
    ],
    "correct": 0
   },
   {
    "prompt": "Thiếu nước, khí khổng đóng lại thì quang hợp:",
    "explain": "CO₂ khó vào lá.",
    "options": [
     "Tăng mạnh",
     "Không đổi",
     "Chuyển thành hô hấp",
     "Giảm"
    ],
    "correct": 3
   },
   {
    "prompt": "Đường dẫn khí ở người theo thứ tự đúng là:",
    "explain": "Không khí đi từ ngoài vào phổi.",
    "options": [
     "Mũi → phổi → khí quản",
     "Khí quản → mũi → phổi",
     "Phổi → khí quản → mũi",
     "Mũi → khí quản → phế quản → phổi"
    ],
    "correct": 3
   },
   {
    "prompt": "Khí khổng tập trung nhiều ở mặt dưới lá giúp:",
    "explain": "Mặt dưới ít bị nắng chiếu.",
    "options": [
     "Giảm mất nước do nắng",
     "Hút nước từ đất",
     "Giảm hô hấp",
     "Nhận nhiều ánh sáng hơn"
    ],
    "correct": 0
   }
  ],
  "advanced": [
   {
    "prompt": "Cơ quan trao đổi khí của cá là gì?",
    "answer": "mang",
    "solution": "Mang."
   },
   {
    "prompt": "Khi hô hấp, sinh vật lấy vào khí nào?",
    "answer": "oxygen|o2|oxi|khí oxygen",
    "solution": "Lấy oxygen."
   },
   {
    "prompt": "Cơ quan trao đổi khí của côn trùng là gì?",
    "answer": "ống khí|hệ thống ống khí",
    "solution": "Hệ thống ống khí."
   },
   {
    "prompt": "Nơi diễn ra trao đổi khí ở phổi người là gì?",
    "answer": "phế nang",
    "solution": "Phế nang."
   },
   {
    "prompt": "Cấu trúc nào ở lá giúp cây trao đổi khí?",
    "answer": "khí khổng",
    "solution": "Khí khổng."
   }
  ]
 },
 {
  "id": "s5-nuoc-dinh-duong",
  "category": "sinh-hoc",
  "title": "Trao đổi nước và chất dinh dưỡng",
  "summary": "## Trao đổi nước và chất dinh dưỡng\n\n**Vai trò của nước:** là dung môi hòa tan chất, môi trường diễn ra các phản ứng, tham gia vào quá trình quang hợp, giúp điều hòa nhiệt độ cơ thể.\n\n**Ở thực vật:**\n- **Lông hút** ở rễ hút nước và muối khoáng từ đất.\n- **Mạch gỗ** vận chuyển nước và muối khoáng từ rễ lên thân, lá.\n- **Mạch rây** vận chuyển chất hữu cơ từ lá đến các bộ phận.\n- **Thoát hơi nước** qua khí khổng của lá: tạo lực kéo nước lên và làm mát lá. Thiếu nước lâu ngày, cây héo vì thoát hơi nước nhiều hơn lượng nước hút vào.\n\n**Ở động vật (người):**\n- **Tiêu hóa** biến đổi thức ăn thành chất dinh dưỡng đơn giản (biến đổi cơ học và hóa học) qua: miệng → thực quản → dạ dày → ruột non → ruột già → hậu môn.\n- **Ruột non** hấp thụ chủ yếu chất dinh dưỡng; **ruột già** hấp thụ nước và tạo phân.\n- Chất dinh dưỡng được **máu (hệ tuần hoàn)** vận chuyển đến các tế bào.\n\n**Thực hành:** cắm cành hoa trắng vào nước có màu — cánh hoa đổi màu, chứng tỏ nước được vận chuyển lên theo mạch gỗ.",
  "quiz": [
   {
    "prompt": "Rễ cây hút nước và muối khoáng nhờ:",
    "explain": "Lông hút là bộ phận hút nước.",
    "options": [
     "Lông hút",
     "Mạch rây",
     "Khí khổng",
     "Lục lạp"
    ],
    "correct": 0
   },
   {
    "prompt": "Nước và muối khoáng được vận chuyển lên thân, lá theo:",
    "explain": "Mạch gỗ.",
    "options": [
     "Ruột non",
     "Mạch gỗ",
     "Khí khổng",
     "Mạch rây"
    ],
    "correct": 1
   },
   {
    "prompt": "Chất hữu cơ từ lá được vận chuyển đi theo:",
    "explain": "Mạch rây.",
    "options": [
     "Mạch rây",
     "Mạch gỗ",
     "Khí khổng",
     "Lông hút"
    ],
    "correct": 0
   },
   {
    "prompt": "Thoát hơi nước ở lá diễn ra chủ yếu qua:",
    "explain": "Hơi nước thoát qua khí khổng.",
    "options": [
     "Rễ",
     "Khí khổng",
     "Mạch gỗ",
     "Lông hút"
    ],
    "correct": 1
   },
   {
    "prompt": "Ý nghĩa của thoát hơi nước là:",
    "explain": "Vai trò của thoát hơi nước.",
    "options": [
     "Tăng CO₂",
     "Tạo lực kéo nước lên và làm mát cây",
     "Tạo ra chất hữu cơ",
     "Làm cây ngừng sinh trưởng"
    ],
    "correct": 1
   },
   {
    "prompt": "Nước có vai trò nào đối với cơ thể sinh vật?",
    "explain": "Nước tham gia nhiều hoạt động sống.",
    "options": [
     "Là dung môi, môi trường cho phản ứng",
     "Chỉ làm tăng khối lượng",
     "Làm thức ăn duy nhất",
     "Chỉ để trang trí"
    ],
    "correct": 0
   },
   {
    "prompt": "Ở người, chất dinh dưỡng được hấp thụ chủ yếu ở:",
    "explain": "Ruột non hấp thụ chất dinh dưỡng.",
    "options": [
     "Thực quản",
     "Ruột già",
     "Dạ dày",
     "Ruột non"
    ],
    "correct": 3
   },
   {
    "prompt": "Ruột già có chức năng chính là:",
    "explain": "Ruột già hấp thụ nước, thải phân.",
    "options": [
     "Tiêu hóa hoàn toàn protein",
     "Hấp thụ nước và tạo phân",
     "Tạo mật",
     "Hấp thụ chủ yếu chất đạm"
    ],
    "correct": 1
   },
   {
    "prompt": "Tiêu hóa là quá trình:",
    "explain": "Bao gồm biến đổi cơ học và hóa học.",
    "options": [
     "Biến đổi thức ăn thành chất dinh dưỡng đơn giản cơ thể hấp thụ được",
     "Thải chất cặn bã",
     "Hấp thụ khí oxygen",
     "Tạo tế bào mới"
    ],
    "correct": 0
   },
   {
    "prompt": "Cây thiếu nước lâu ngày bị héo vì:",
    "explain": "Mất cân bằng nước.",
    "options": [
     "Lá không có khí khổng",
     "Lượng nước thoát ra nhiều hơn lượng nước hút vào",
     "Cây hút quá nhiều nước",
     "Cây tạo quá nhiều tinh bột"
    ],
    "correct": 1
   },
   {
    "prompt": "Cắm cành hoa trắng vào nước màu, cánh hoa đổi màu chứng tỏ:",
    "explain": "Màu theo nước lên tới cánh hoa.",
    "options": [
     "Cây quang hợp",
     "Cây thoát hơi nước không qua lá",
     "Nước được vận chuyển lên theo mạch gỗ",
     "Cây hô hấp"
    ],
    "correct": 2
   },
   {
    "prompt": "Chất dinh dưỡng sau khi hấp thụ ở ruột non được đưa đến các tế bào nhờ:",
    "explain": "Hệ tuần hoàn vận chuyển chất.",
    "options": [
     "Máu (hệ tuần hoàn)",
     "Mạch gỗ",
     "Khí khổng",
     "Thực quản"
    ],
    "correct": 0
   }
  ],
  "advanced": [
   {
    "prompt": "Bộ phận của rễ hút nước từ đất là gì?",
    "answer": "lông hút",
    "solution": "Lông hút."
   },
   {
    "prompt": "Mạch nào vận chuyển nước và muối khoáng lên lá?",
    "answer": "mạch gỗ",
    "solution": "Mạch gỗ."
   },
   {
    "prompt": "Mạch nào vận chuyển chất hữu cơ từ lá đi các bộ phận?",
    "answer": "mạch rây",
    "solution": "Mạch rây."
   },
   {
    "prompt": "Quá trình mất hơi nước ở lá qua khí khổng gọi là gì?",
    "answer": "thoát hơi nước",
    "solution": "Thoát hơi nước."
   },
   {
    "prompt": "Cơ quan nào ở người hấp thụ chủ yếu chất dinh dưỡng?",
    "answer": "ruột non",
    "solution": "Ruột non."
   }
  ]
 },
 {
  "id": "s6-cam-ung",
  "category": "sinh-hoc",
  "title": "Cảm ứng và tập tính",
  "summary": "## Cảm ứng ở sinh vật và tập tính ở động vật\n\n**Cảm ứng** là khả năng sinh vật **tiếp nhận kích thích** từ môi trường và **phản ứng** lại.\n\n**Ở thực vật** (chậm, không có hệ thần kinh):\n- **Hướng sáng:** thân, cành hướng về nguồn sáng (hướng sáng dương).\n- **Hướng trọng lực:** rễ mọc xuống đất (dương), thân mọc lên (âm).\n- Hướng nước, hướng hóa chất, hướng tiếp xúc; cây trinh nữ cụp lá khi bị chạm.\n\n**Ở động vật** (nhanh, nhờ hệ thần kinh): **cung phản xạ** gồm: **thụ thể** → **nơron cảm giác** → **trung ương thần kinh** → **nơron vận động** → **cơ quan phản ứng**.\n\n**Tập tính** là chuỗi phản ứng của động vật trả lời kích thích từ môi trường, giúp động vật thích nghi và tồn tại.\n- **Bẩm sinh:** sinh ra đã có, di truyền (nhện giăng tơ, ong xây tổ, chim di cư).\n- **Học được:** hình thành qua kinh nghiệm, luyện tập (chó biết ngồi khi ra hiệu, chó tiết nước bọt khi nghe chuông báo ăn).\n\nỨng dụng: huấn luyện vật nuôi, thu hút cá bằng ánh sáng, điều chỉnh môi trường chăn nuôi.",
  "quiz": [
   {
    "prompt": "Cảm ứng ở sinh vật là:",
    "explain": "Định nghĩa cảm ứng.",
    "options": [
     "Khả năng sinh sản",
     "Khả năng tạo chất hữu cơ",
     "Khả năng phân chia tế bào",
     "Khả năng tiếp nhận và phản ứng với kích thích"
    ],
    "correct": 3
   },
   {
    "prompt": "Rễ cây mọc hướng xuống đất là hiện tượng:",
    "explain": "Rễ hướng trọng lực dương.",
    "options": [
     "Hướng nước",
     "Hướng sáng",
     "Hướng tiếp xúc",
     "Hướng trọng lực"
    ],
    "correct": 3
   },
   {
    "prompt": "Thân cây mọc cong về phía cửa sổ có ánh sáng là:",
    "explain": "Thân hướng về nguồn sáng.",
    "options": [
     "Hướng sáng",
     "Hướng đất",
     "Hướng nước",
     "Hướng hóa"
    ],
    "correct": 0
   },
   {
    "prompt": "Cây trinh nữ cụp lá khi bị chạm là biểu hiện của:",
    "explain": "Lá phản ứng với kích thích tiếp xúc.",
    "options": [
     "Sinh sản",
     "Quang hợp",
     "Cảm ứng ở thực vật",
     "Hô hấp"
    ],
    "correct": 2
   },
   {
    "prompt": "Cung phản xạ ở động vật gồm thứ tự:",
    "explain": "Đúng thứ tự dẫn truyền.",
    "options": [
     "Thụ thể → nơron cảm giác → trung ương → nơron vận động → cơ quan phản ứng",
     "Cơ quan phản ứng → thụ thể → trung ương",
     "Trung ương → thụ thể → nơron cảm giác",
     "Nơron vận động → thụ thể → cơ quan phản ứng"
    ],
    "correct": 0
   },
   {
    "prompt": "Tập tính của động vật là:",
    "explain": "Định nghĩa tập tính.",
    "options": [
     "Sự phân chia tế bào",
     "Chuỗi phản ứng trả lời kích thích từ môi trường",
     "Sự trao đổi khí",
     "Sự sinh trưởng của cơ thể"
    ],
    "correct": 1
   },
   {
    "prompt": "Tập tính nào là tập tính bẩm sinh?",
    "explain": "Sinh ra đã có.",
    "options": [
     "Cá heo biểu diễn",
     "Khỉ đi xe đạp trong rạp xiếc",
     "Chó biết ngồi khi có hiệu lệnh",
     "Nhện giăng tơ"
    ],
    "correct": 3
   },
   {
    "prompt": "Tập tính nào là tập tính học được?",
    "explain": "Hình thành qua luyện tập.",
    "options": [
     "Nhện giăng tơ",
     "Chó biết ngồi khi ra hiệu",
     "Chim non há mỏ đòi ăn",
     "Ong xây tổ"
    ],
    "correct": 1
   },
   {
    "prompt": "Ý nghĩa của tập tính đối với động vật là:",
    "explain": "Tập tính giúp thích nghi với môi trường.",
    "options": [
     "Làm cơ thể lớn nhanh",
     "Giúp thích nghi, tồn tại và sinh sản",
     "Tạo ra chất hữu cơ",
     "Làm tăng nhiệt độ"
    ],
    "correct": 1
   },
   {
    "prompt": "Chim én bay về phương Nam khi trời lạnh là tập tính:",
    "explain": "Đây là tập tính di cư.",
    "options": [
     "Kiếm ăn",
     "Săn mồi",
     "Xây tổ",
     "Di cư"
    ],
    "correct": 3
   },
   {
    "prompt": "Chó nghe tiếng chuông báo ăn thì tiết nước bọt. Đây là tập tính:",
    "explain": "Được hình thành qua nhiều lần lặp lại.",
    "options": [
     "Quang hợp",
     "Bẩm sinh",
     "Sinh trưởng",
     "Học được"
    ],
    "correct": 3
   },
   {
    "prompt": "Điểm khác nhau chủ yếu giữa tập tính bẩm sinh và học được là:",
    "explain": "So sánh hai loại tập tính.",
    "options": [
     "Cả hai đều phải học",
     "Cả hai đều không di truyền",
     "Bẩm sinh có từ khi sinh ra, học được hình thành qua kinh nghiệm",
     "Bẩm sinh phải học, học được thì có sẵn"
    ],
    "correct": 2
   }
  ],
  "advanced": [
   {
    "prompt": "Cây đặt cạnh cửa sổ uốn về phía ánh sáng là hiện tượng gì?",
    "answer": "hướng sáng",
    "solution": "Hướng sáng dương."
   },
   {
    "prompt": "Rễ cây mọc xuống đất là hướng gì?",
    "answer": "hướng trọng lực|hướng đất|hướng trọng lực dương",
    "solution": "Hướng trọng lực (hướng đất)."
   },
   {
    "prompt": "Tập tính nhện giăng tơ là tập tính bẩm sinh hay học được?",
    "answer": "bẩm sinh",
    "solution": "Nhện sinh ra đã biết giăng tơ."
   },
   {
    "prompt": "Chó biết bắt tay theo hiệu lệnh là tập tính bẩm sinh hay học được?",
    "answer": "học được",
    "solution": "Hình thành qua huấn luyện."
   },
   {
    "prompt": "Bộ phận của cung phản xạ tiếp nhận kích thích là gì?",
    "answer": "thụ thể|cơ quan thụ cảm",
    "solution": "Thụ thể."
   }
  ]
 },
 {
  "id": "s7-sinh-truong",
  "category": "sinh-hoc",
  "title": "Sinh trưởng và phát triển",
  "summary": "## Sinh trưởng và phát triển ở sinh vật\n\n- **Sinh trưởng:** sự **tăng kích thước và khối lượng** cơ thể do tăng số lượng và kích thước tế bào.\n- **Phát triển:** những **biến đổi về cấu tạo, hình thái, chức năng** của cơ thể trong vòng đời.\n\n**Ở động vật:**\n- **Không qua biến thái:** con non giống con trưởng thành (người, chó, gà).\n- **Biến thái không hoàn toàn:** trứng → ấu trùng → trưởng thành (châu chấu, gián).\n- **Biến thái hoàn toàn:** trứng → ấu trùng → nhộng → trưởng thành (bướm, ruồi, muỗi, ong).\n\n**Ở thực vật có hoa:** hạt nảy mầm → cây con → cây trưởng thành → ra hoa, kết quả → hạt.\n\n**Nhân tố ảnh hưởng:**\n- **Bên ngoài:** nhiệt độ, ánh sáng, nước, chất dinh dưỡng.\n- **Bên trong:** đặc điểm di truyền, hormone.\n\nỨng dụng: điều chỉnh nhiệt độ, ánh sáng, chế độ dinh dưỡng để cây trồng, vật nuôi sinh trưởng tốt.",
  "quiz": [
   {
    "prompt": "Sinh trưởng là:",
    "explain": "Định nghĩa sinh trưởng.",
    "options": [
     "Sự tăng kích thước và khối lượng cơ thể",
     "Sự biến đổi hình thái",
     "Sự sinh sản",
     "Sự thay đổi màu sắc"
    ],
    "correct": 0
   },
   {
    "prompt": "Phát triển là quá trình:",
    "explain": "Định nghĩa phát triển.",
    "options": [
     "Chỉ tăng cân",
     "Chỉ tăng chiều cao",
     "Chỉ thay lông",
     "Biến đổi về cấu tạo, hình thái, chức năng"
    ],
    "correct": 3
   },
   {
    "prompt": "Vòng đời có giai đoạn nhộng là của:",
    "explain": "Bướm biến thái hoàn toàn.",
    "options": [
     "Châu chấu",
     "Gà",
     "Người",
     "Bướm"
    ],
    "correct": 3
   },
   {
    "prompt": "Châu chấu phát triển theo kiểu:",
    "explain": "Trứng → ấu trùng → trưởng thành.",
    "options": [
     "Biến thái hoàn toàn",
     "Biến thái không hoàn toàn",
     "Phân đôi",
     "Không qua biến thái"
    ],
    "correct": 1
   },
   {
    "prompt": "Người phát triển theo kiểu:",
    "explain": "Con non giống con trưởng thành.",
    "options": [
     "Không qua biến thái",
     "Biến thái hoàn toàn",
     "Qua giai đoạn nhộng",
     "Biến thái không hoàn toàn"
    ],
    "correct": 0
   },
   {
    "prompt": "Nhân tố bên ngoài ảnh hưởng đến sinh trưởng và phát triển gồm:",
    "explain": "Đây là các nhân tố môi trường.",
    "options": [
     "Hormone",
     "Số nhiễm sắc thể",
     "Nhiệt độ, ánh sáng, nước, dinh dưỡng",
     "Di truyền"
    ],
    "correct": 2
   },
   {
    "prompt": "Nhân tố bên trong ảnh hưởng đến sinh trưởng và phát triển là:",
    "explain": "Do cơ thể quy định.",
    "options": [
     "Đặc điểm di truyền và hormone",
     "Ánh sáng",
     "Nhiệt độ",
     "Nước"
    ],
    "correct": 0
   },
   {
    "prompt": "Thứ tự đúng vòng đời của thực vật có hoa là:",
    "explain": "Đúng trình tự vòng đời.",
    "options": [
     "Quả → cây con → hạt",
     "Cây con → hạt → hoa → quả",
     "Hoa → hạt → quả → cây con",
     "Hạt → cây con → cây trưởng thành → hoa, quả → hạt"
    ],
    "correct": 3
   },
   {
    "prompt": "Vòng đời muỗi: trứng → bọ gậy → nhộng → muỗi trưởng thành. Đây là:",
    "explain": "Có giai đoạn nhộng.",
    "options": [
     "Biến thái hoàn toàn",
     "Sinh sản vô tính",
     "Biến thái không hoàn toàn",
     "Không qua biến thái"
    ],
    "correct": 0
   },
   {
    "prompt": "Gà con mới nở lớn dần thành gà trưởng thành thuộc kiểu:",
    "explain": "Gà con giống gà lớn.",
    "options": [
     "Không qua biến thái",
     "Biến thái không hoàn toàn",
     "Biến thái hoàn toàn",
     "Có giai đoạn nhộng"
    ],
    "correct": 0
   },
   {
    "prompt": "Nhiệt độ quá thấp thường làm sinh trưởng của cây trồng:",
    "explain": "Nhiệt độ ảnh hưởng tốc độ sinh trưởng.",
    "options": [
     "Nhanh hơn",
     "Chuyển thành sinh sản",
     "Không đổi",
     "Chậm lại"
    ],
    "correct": 3
   },
   {
    "prompt": "Sự khác nhau giữa biến thái hoàn toàn và không hoàn toàn là:",
    "explain": "Điểm phân biệt là giai đoạn nhộng.",
    "options": [
     "Hoàn toàn không có ấu trùng",
     "Cả hai đều không có ấu trùng",
     "Hoàn toàn có giai đoạn nhộng, không hoàn toàn không có",
     "Không hoàn toàn có nhộng"
    ],
    "correct": 2
   }
  ],
  "advanced": [
   {
    "prompt": "Ở bướm, giai đoạn nằm giữa ấu trùng và bướm trưởng thành là gì?",
    "answer": "nhộng",
    "solution": "Nhộng."
   },
   {
    "prompt": "Châu chấu có giai đoạn nhộng không? (có / không)",
    "answer": "không",
    "solution": "Châu chấu biến thái không hoàn toàn."
   },
   {
    "prompt": "Sự tăng kích thước và khối lượng cơ thể gọi là gì?",
    "answer": "sinh trưởng",
    "solution": "Sinh trưởng."
   },
   {
    "prompt": "Nhiệt độ là nhân tố bên ngoài hay bên trong?",
    "answer": "bên ngoài|ngoài",
    "solution": "Nhiệt độ là nhân tố môi trường (bên ngoài)."
   },
   {
    "prompt": "Hormone là nhân tố bên ngoài hay bên trong?",
    "answer": "bên trong|trong",
    "solution": "Hormone do cơ thể tạo ra."
   }
  ]
 },
 {
  "id": "s8-sinh-san",
  "category": "sinh-hoc",
  "title": "Sinh sản ở sinh vật",
  "summary": "## Sinh sản ở sinh vật\n\n**Sinh sản vô tính:** không có sự kết hợp giữa giao tử đực và giao tử cái; cây/con mới giống cây/con mẹ.\n- Phân đôi (vi khuẩn), nảy chồi (thủy tức, nấm men), phân mảnh (giun dẹp, sao biển), bào tử (dương xỉ, nấm).\n- Ở thực vật: **sinh sản sinh dưỡng** bằng rễ, thân, lá (khoai lang, rau má...), và nhân tạo như giâm cành, chiết cành, ghép cây, nuôi cấy mô.\n\n**Sinh sản hữu tính:** có sự **kết hợp giao tử đực và giao tử cái** tạo **hợp tử**, phát triển thành cơ thể mới; con mang đặc điểm của cả bố và mẹ, đa dạng di truyền.\n\n**Ở thực vật có hoa:**\n- Hoa là cơ quan sinh sản: **nhị** (cơ quan đực), **nhụy** (cơ quan cái).\n- **Thụ phấn:** hạt phấn rơi lên đầu nhụy (nhờ gió, côn trùng...). **Thụ tinh:** giao tử đực kết hợp giao tử cái tạo hợp tử.\n- Sau thụ tinh: **noãn → hạt**, **bầu → quả**. Quả, hạt phát tán nhờ gió, nước, động vật...\n\n**Ở động vật:** thụ tinh ngoài (cá, ếch) hoặc thụ tinh trong (chim, thú, người); đẻ trứng hoặc đẻ con.\n\n**Ảnh hưởng và điều khiển sinh sản:** nhiệt độ, ánh sáng, nước, dinh dưỡng, hormone; ứng dụng kích thích ra hoa, kích thích đẻ trứng, kế hoạch hóa gia đình.",
  "quiz": [
   {
    "prompt": "Sinh sản vô tính là hình thức sinh sản:",
    "explain": "Đặc điểm sinh sản vô tính.",
    "options": [
     "Luôn cần hai cá thể",
     "Có sự kết hợp giao tử đực và cái",
     "Chỉ có ở động vật",
     "Không có sự kết hợp giữa giao tử đực và cái"
    ],
    "correct": 3
   },
   {
    "prompt": "Sinh sản hữu tính có đặc điểm:",
    "explain": "Tạo hợp tử từ hai giao tử.",
    "options": [
     "Con giống hệt mẹ",
     "Có sự kết hợp giao tử đực và giao tử cái",
     "Chỉ có ở vi khuẩn",
     "Không có giao tử"
    ],
    "correct": 1
   },
   {
    "prompt": "Vi khuẩn sinh sản bằng hình thức:",
    "explain": "Vi khuẩn phân đôi.",
    "options": [
     "Phân đôi",
     "Nảy chồi",
     "Thụ tinh",
     "Đẻ con"
    ],
    "correct": 0
   },
   {
    "prompt": "Thủy tức sinh sản vô tính bằng cách:",
    "explain": "Thủy tức nảy chồi.",
    "options": [
     "Phân đôi",
     "Nảy chồi",
     "Bào tử",
     "Thụ tinh trong"
    ],
    "correct": 1
   },
   {
    "prompt": "Giâm cành, chiết cành, ghép cây là hình thức:",
    "explain": "Là nhân giống vô tính ở thực vật.",
    "options": [
     "Sinh sản bằng bào tử",
     "Sinh sản hữu tính",
     "Sinh sản sinh dưỡng nhân tạo",
     "Thụ phấn"
    ],
    "correct": 2
   },
   {
    "prompt": "Cơ quan sinh sản của cây có hoa là:",
    "explain": "Hoa chứa nhị và nhụy.",
    "options": [
     "Lá",
     "Rễ",
     "Hoa",
     "Thân"
    ],
    "correct": 2
   },
   {
    "prompt": "Cơ quan sinh sản cái của hoa là:",
    "explain": "Nhụy chứa noãn.",
    "options": [
     "Đài hoa",
     "Nhụy",
     "Cánh hoa",
     "Nhị"
    ],
    "correct": 1
   },
   {
    "prompt": "Thụ phấn là hiện tượng:",
    "explain": "Định nghĩa thụ phấn.",
    "options": [
     "Giao tử đực kết hợp giao tử cái",
     "Quả chín",
     "Hạt phấn rơi lên đầu nhụy",
     "Hạt nảy mầm"
    ],
    "correct": 2
   },
   {
    "prompt": "Thụ tinh là sự:",
    "explain": "Định nghĩa thụ tinh.",
    "options": [
     "Kết hợp giao tử đực và giao tử cái tạo hợp tử",
     "Rơi của hạt phấn",
     "Lớn lên của quả",
     "Hút nước của rễ"
    ],
    "correct": 0
   },
   {
    "prompt": "Sau thụ tinh, bầu phát triển thành:",
    "explain": "Bầu → quả; noãn → hạt.",
    "options": [
     "Hạt",
     "Hoa",
     "Rễ",
     "Quả"
    ],
    "correct": 3
   },
   {
    "prompt": "Cá thường thụ tinh:",
    "explain": "Cá thụ tinh ngoài.",
    "options": [
     "Trong cơ thể",
     "Bằng nảy chồi",
     "Ngoài cơ thể",
     "Bằng bào tử"
    ],
    "correct": 2
   },
   {
    "prompt": "Ưu điểm của sinh sản hữu tính là:",
    "explain": "Tổ hợp vật chất di truyền từ bố và mẹ.",
    "options": [
     "Không cần giao tử",
     "Nhanh nhất về số lượng",
     "Con giống hệt mẹ",
     "Tạo đa dạng di truyền giúp thích nghi với môi trường"
    ],
    "correct": 3
   }
  ],
  "advanced": [
   {
    "prompt": "Hình thức sinh sản vô tính ở vi khuẩn là gì?",
    "answer": "phân đôi",
    "solution": "Vi khuẩn phân đôi."
   },
   {
    "prompt": "Bộ phận cái của hoa là gì?",
    "answer": "nhụy",
    "solution": "Nhụy."
   },
   {
    "prompt": "Sự kết hợp giao tử đực và giao tử cái tạo ra gì?",
    "answer": "hợp tử",
    "solution": "Hợp tử."
   },
   {
    "prompt": "Hạt phát triển từ bộ phận nào của hoa?",
    "answer": "noãn",
    "solution": "Noãn phát triển thành hạt."
   },
   {
    "prompt": "Chim thụ tinh trong hay ngoài cơ thể?",
    "answer": "trong",
    "solution": "Chim thụ tinh trong."
   }
  ]
 }
];

function readBest(id) {
  try { const v = window.localStorage.getItem("kh7-quiz-best-" + id); return v === null ? null : parseInt(v, 10); } catch (e) { return null; }
}

function renderSummary(md) {
  const lines = md.split("\n");
  const blocks = [];
  let listBuf = [];
  let tableBuf = [];
  const bold = (s) => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const flushList = () => {
    if (listBuf.length) {
      blocks.push(<ul key={blocks.length}>{listBuf.map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: li }} />)}</ul>);
      listBuf = [];
    }
  };
  const flushTable = () => {
    if (tableBuf.length) {
      const rows = tableBuf.filter((r) => !/^\|?\s*-+\s*\|/.test(r));
      const cells = rows.map((r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
      const [head, ...body] = cells;
      blocks.push(
        <table key={blocks.length}>
          <thead><tr>{head.map((h, i) => <th key={i} dangerouslySetInnerHTML={{ __html: bold(h) }} />)}</tr></thead>
          <tbody>{body.map((row, ri) => <tr key={ri}>{row.map((c, ci) => <td key={ci} dangerouslySetInnerHTML={{ __html: bold(c) }} />)}</tr>)}</tbody>
        </table>
      );
      tableBuf = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushList(); flushTable(); continue; }
    if (line.startsWith("|")) { flushList(); tableBuf.push(line); continue; }
    flushTable();
    if (line.startsWith("## ")) { flushList(); blocks.push(<h2 key={blocks.length}>{line.slice(3)}</h2>); }
    else if (line.startsWith("- ")) { listBuf.push(bold(line.slice(2))); }
    else { flushList(); blocks.push(<p key={blocks.length} dangerouslySetInnerHTML={{ __html: bold(line) }} />); }
  }
  flushList();
  flushTable();
  return blocks;
}

function TopBar({ title, sub, onExit }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
      <span style={{ fontSize: 13, color: "#7A6F60" }}>{title}{sub ? " · " + sub : ""}</span>
      <button onClick={onExit} style={{ background: "none", border: "none", color: "#7A6F60", fontSize: 13, cursor: "pointer" }}>← Thoát ra</button>
    </div>
  );
}

function TopicSummary({ topic, accent, onExit, onGoQuiz }) {
  return (
    <div className="lt-page" style={{ minHeight: 420, padding: "32px 28px 40px", borderRadius: 4 }}>
      <div className="lt-margin" />
      <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
        <TopBar title={topic.title} sub="Tóm tắt kiến thức" onExit={onExit} />
        <div style={{ background: "#fff", border: "1px solid #E4DCC8", borderLeft: `4px solid ${accent}`, borderRadius: 3, padding: "24px 28px", marginBottom: 20 }} className="lt-summary">
          {renderSummary(topic.summary)}
        </div>
        <button onClick={onGoQuiz} style={{ padding: "11px 24px", borderRadius: 3, border: `1.5px solid ${inkColor}`, background: inkColor, color: "#FBF8F2", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          Làm trắc nghiệm ({topic.quiz.length} câu) →
        </button>
      </div>
    </div>
  );
}

function Quiz({ topic, accent, onExit }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const total = topic.quiz.length;
  const q = topic.quiz[current];

  useEffect(() => {
    if (!finished) return;
    try {
      const prev = readBest(topic.id);
      if (prev === null || score > prev) window.localStorage.setItem("kh7-quiz-best-" + topic.id, String(score));
    } catch (e) {}
  }, [finished]);

  function pick(idx) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setScore((s) => s + 1);
  }
  function next() {
    if (current + 1 < total) { setCurrent((c) => c + 1); setSelected(null); setAnswered(false); }
    else setFinished(true);
  }

  if (finished) {
    return (
      <div className="lt-page" style={{ minHeight: 280, padding: "40px 28px", borderRadius: 4, textAlign: "center" }}>
        <div className="lt-margin" />
        <h2 className="lt-serif" style={{ fontSize: 26, marginBottom: 10 }}>Kết quả: {score}/{total}</h2>
        <p style={{ color: "#7A6F60", marginBottom: 24 }}>{topic.title}</p>
        <button onClick={onExit} style={{ padding: "10px 22px", borderRadius: 3, border: `1.5px solid ${accent}`, background: accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="lt-page" style={{ minHeight: 360, padding: "32px 28px 40px", borderRadius: 4 }}>
      <div className="lt-margin" />
      <div style={{ maxWidth: 580, margin: "0 auto", position: "relative" }}>
        <TopBar title={topic.title} sub={`Trắc nghiệm · Câu ${current + 1}/${total}`} onExit={onExit} />
        <div className="lt-serif" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.5, marginBottom: 20 }}>{q.prompt}</div>
        <div className="flex flex-col gap-3">
          {q.options.map((opt, idx) => {
            let bg = "#fff", border = "#D9CFC0", color = inkColor;
            if (answered) {
              if (idx === q.correct) { bg = "#EAF4EC"; border = correctGreen; color = correctGreen; }
              else if (idx === selected) { bg = "#FBEAE8"; border = marginRed; color = marginRed; }
            }
            return (
              <button key={idx} onClick={() => pick(idx)} style={{ textAlign: "left", padding: "12px 16px", borderRadius: 3, border: `1.5px solid ${border}`, background: bg, color, cursor: answered ? "default" : "pointer", fontSize: 15 }}>
                <b style={{ marginRight: 8 }}>{"ABCD"[idx]}.</b>{opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <div style={{ marginTop: 16, padding: "12px 14px", background: "#FBF8F2", borderLeft: `3px solid ${accent}`, fontSize: 14, color: "#4A4238", lineHeight: 1.6 }}>
            {q.explain}
          </div>
        )}
        {answered && (
          <button onClick={next} style={{ marginTop: 18, padding: "10px 22px", borderRadius: 3, border: `1.5px solid ${accent}`, background: accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
            {current + 1 < total ? "Câu tiếp →" : "Xem kết quả"}
          </button>
        )}
      </div>
    </div>
  );
}

function AdvancedPractice({ topic, accent, onExit }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const [revealed, setRevealed] = useState({});
  const [drafts, setDrafts] = useState({});
  const [results, setResults] = useState({});

  const items = topic.advanced;
  const storageKey = `kh7-results-${topic.id}`;

  useEffect(() => {
    let saved = {};
    try { const raw = window.localStorage.getItem(storageKey); if (raw) saved = JSON.parse(raw); } catch (err) { saved = {}; }
    setResults(saved);
    const d = {};
    Object.keys(saved).forEach((i) => { d[i] = saved[i].given; });
    setDrafts(d);
    setRevealed({});
  }, [storageKey]);

  function tryUnlock(e) {
    e.preventDefault();
    if (pwInput === SOLUTION_PASSWORD) { setUnlocked(true); setPwError(""); }
    else setPwError("Mật khẩu không đúng, thử lại nhé.");
  }
  function submitAnswer(idx) {
    const given = drafts[idx] || "";
    const correct = checkAnswer(given, items[idx].answer);
    const next = { ...results, [idx]: { given, correct } };
    setResults(next);
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); } catch (err) {}
  }

  const answeredCount = Object.values(results).filter((r) => r && r.correct !== null).length;
  const correctCount = Object.values(results).filter((r) => r && r.correct === true).length;

  return (
    <div className="lt-page" style={{ minHeight: 420, padding: "32px 24px 40px", borderRadius: 4 }}>
      <div className="lt-margin" />
      <div style={{ maxWidth: 580, margin: "0 auto", position: "relative" }}>
        <TopBar title={topic.title} sub="★ Bài tập nâng cao" onExit={onExit} />
        <p style={{ fontSize: 13, color: "#9C9080", marginBottom: 18 }}>
          Đã làm {answeredCount}/{items.length} câu — đúng {correctCount} câu. Kết quả tự động lưu lại trên máy này.
        </p>
        {!unlocked && (
          <form onSubmit={tryUnlock} style={{ background: "#fff", border: "1px solid #D9CFC0", borderRadius: 3, padding: "16px 18px", marginBottom: 22 }}>
            <p style={{ fontSize: 14, color: "#4A4238", marginBottom: 10 }}>Con tự làm và kiểm tra đáp số ngay bên dưới. Nhập mật khẩu để mở khóa xem lời giải.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="password" value={pwInput} onChange={(e) => { setPwInput(e.target.value); setPwError(""); }} placeholder="Mật khẩu" style={{ flex: 1, padding: "8px 12px", border: `1.5px solid ${pwError ? marginRed : "#D9CFC0"}`, borderRadius: 3, fontSize: 14 }} />
              <button type="submit" style={{ padding: "8px 16px", borderRadius: 3, border: `1.5px solid ${inkColor}`, background: inkColor, color: "#FBF8F2", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Mở khóa</button>
            </div>
            {pwError && <p style={{ color: marginRed, fontSize: 12, marginTop: 6 }}>{pwError}</p>}
          </form>
        )}
        <div className="flex flex-col gap-3">
          {items.map((ex, idx) => {
            const status = results[idx] ? results[idx].correct : null;
            const boxColor = status === true ? correctGreen : status === false ? marginRed : "#D9CFC0";
            const boxBg = status === true ? "#EAF4EC" : status === false ? "#FBEAE8" : "#fff";
            return (
              <div key={idx} style={{ background: "#fff", border: "1px solid #D9CFC0", borderLeft: "3px solid #8B5CF6", borderRadius: 2, padding: "16px 18px" }}>
                <div style={{ fontSize: 13, color: "#9C9080", marginBottom: 6 }}>Bài {idx + 1}</div>
                <div className="lt-serif" style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.5, marginBottom: 10 }}>{ex.prompt}</div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: "#9C9080", display: "block", marginBottom: 4 }}>Đáp án của con</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="text" value={drafts[idx] ?? ""} onChange={(e) => setDrafts((d) => ({ ...d, [idx]: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submitAnswer(idx); } }} placeholder="Nhập đáp án rồi bấm Kiểm tra..." style={{ flex: 1, padding: "10px 12px", border: `1.5px solid ${boxColor}`, background: boxBg, borderRadius: 3, fontSize: 14, color: inkColor, boxSizing: "border-box" }} />
                    <button onClick={() => submitAnswer(idx)} style={{ padding: "8px 16px", borderRadius: 3, border: `1.5px solid ${inkColor}`, background: inkColor, color: "#FBF8F2", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>Kiểm tra</button>
                  </div>
                  {status === true && <p style={{ color: correctGreen, fontSize: 12, marginTop: 6, fontWeight: 600 }}>✓ Chính xác!</p>}
                  {status === false && <p style={{ color: marginRed, fontSize: 12, marginTop: 6, fontWeight: 600 }}>✕ Chưa đúng — thử lại hoặc xem lời giải bên dưới.</p>}
                </div>
                {unlocked ? (
                  <>
                    <button onClick={() => setRevealed((r) => ({ ...r, [idx]: !r[idx] }))} style={{ background: "none", border: "none", color: "#8B5CF6", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                      {revealed[idx] ? "Ẩn lời giải ▲" : "Xem lời giải ▼"}
                    </button>
                    {revealed[idx] && (
                      <div style={{ marginTop: 10, padding: "12px 14px", background: "#FBF8F2", borderLeft: "3px solid #8B5CF6", fontSize: 14, color: "#4A4238", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                        {ex.solution}
                      </div>
                    )}
                  </>
                ) : (
                  <span style={{ fontSize: 12, color: "#B5A98F" }}>Nhập mật khẩu ở trên để xem lời giải</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TopicList({ topics, accent, onPickSummary, onPickQuiz, onPickAdvanced }) {
  return (
    <div className="flex flex-col gap-3" style={{ maxWidth: 600, margin: "0 auto" }}>
      {topics.map((t, i) => {
        const best = readBest(t.id);
        return (
          <div key={t.id} style={{ background: "#fff", border: "1px solid #D9CFC0", borderLeft: `4px solid ${accent}`, borderRadius: 2, padding: "18px 22px" }}>
            <span style={{ fontSize: 12, color: "#9C9080" }}>Chuyên đề {i + 1}{best !== null ? ` · Điểm cao nhất: ${best}/${t.quiz.length}` : ""}</span>
            <div className="lt-serif" style={{ fontSize: 18, fontWeight: 600, color: inkColor, marginTop: 2, marginBottom: 12 }}>{t.title}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => onPickSummary(t)} className="lt-tab" style={{ padding: "7px 14px", borderRadius: 3, border: `1.5px solid ${accent}`, background: "transparent", color: accent, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>📖 Tóm tắt kiến thức</button>
              <button onClick={() => onPickQuiz(t)} className="lt-tab" style={{ padding: "7px 14px", borderRadius: 3, border: `1.5px solid ${inkColor}`, background: inkColor, color: "#FBF8F2", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Trắc nghiệm ({t.quiz.length})</button>
              <button onClick={() => onPickAdvanced(t)} className="lt-tab" style={{ padding: "7px 14px", borderRadius: 3, border: "1.5px solid #8B5CF6", background: "transparent", color: "#8B5CF6", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>★ Nâng cao ({t.advanced.length})</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [category, setCategory] = useState("vat-li");
  const [view, setView] = useState(null);

  const cat = CATEGORIES.find((c) => c.id === category);
  const topics = CHUYEN_DE.filter((t) => t.category === category);
  const totalQuiz = CHUYEN_DE.reduce((s, t) => s + t.quiz.length, 0);
  const totalAdv = CHUYEN_DE.reduce((s, t) => s + t.advanced.length, 0);
  const exit = () => setView(null);

  return (
    <div className="lt-root" style={{ minHeight: "100%", padding: "28px 16px", background: "#F3EEE3" }}>
      {font}
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 className="lt-serif" style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Khoa học tự nhiên 7</h1>
          <p style={{ fontSize: 14, color: "#7A6F60", marginTop: 6 }}>
            Kết nối tri thức với cuộc sống · {CHUYEN_DE.length} chuyên đề · {totalQuiz} câu trắc nghiệm · {totalAdv} bài nâng cao
          </p>
        </div>

        {!view && (
          <>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setCategory(c.id)} className="lt-tab" style={{ padding: "9px 18px", borderRadius: 4, border: `2px solid ${c.color}`, background: category === c.id ? c.color : "transparent", color: category === c.id ? "#fff" : c.color, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  {c.icon} {c.label} ({CHUYEN_DE.filter((t) => t.category === c.id).length})
                </button>
              ))}
            </div>
            <TopicList topics={topics} accent={cat.color} onPickSummary={(t) => setView({ topic: t, mode: "summary" })} onPickQuiz={(t) => setView({ topic: t, mode: "quiz" })} onPickAdvanced={(t) => setView({ topic: t, mode: "advanced" })} />
          </>
        )}

        {view && view.mode === "summary" && <TopicSummary topic={view.topic} accent={cat.color} onExit={exit} onGoQuiz={() => setView({ topic: view.topic, mode: "quiz" })} />}
        {view && view.mode === "quiz" && <Quiz topic={view.topic} accent={cat.color} onExit={exit} />}
        {view && view.mode === "advanced" && <AdvancedPractice topic={view.topic} accent={cat.color} onExit={exit} />}
      </div>
    </div>
  );
}
