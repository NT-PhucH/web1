// ==============================================
// 1. CẤU HÌNH & DỮ LIỆU QUY ĐỔI
// ==============================================
const GRADE_RULES = [
  {
    letter: "A+",
    scale4: 4.0,
    label: "Xuất sắc",
    color: "text-neon-green",
    bg: "row-green-bg",
  },
  {
    letter: "A",
    scale4: 3.8,
    label: "Giỏi",
    color: "text-neon-green",
    bg: "row-green-bg",
  },
  {
    letter: "B+",
    scale4: 3.5,
    label: "Khá",
    color: "text-neon-blue",
    bg: "row-blue-bg",
  },
  {
    letter: "B",
    scale4: 3.0,
    label: "Khá",
    color: "text-neon-blue",
    bg: "row-blue-bg",
  },
  {
    letter: "C+",
    scale4: 2.4,
    label: "Trung bình",
    color: "text-neon-yellow",
    bg: "row-yellow-bg",
  },
  {
    letter: "C",
    scale4: 2.0,
    label: "Trung bình",
    color: "text-neon-yellow",
    bg: "row-yellow-bg",
  },
  {
    letter: "D+",
    scale4: 1.5,
    label: "TB Yếu",
    color: "text-neon-orange",
    bg: "row-orange-bg",
  },
  {
    letter: "D",
    scale4: 1.0,
    label: "TB Yếu",
    color: "text-neon-orange",
    bg: "row-orange-bg",
  },
  {
    letter: "F",
    scale4: 0.0,
    label: "Kém",
    color: "text-neon-pink",
    bg: "row-pink-bg",
  },
];
// Lưu ý: Tôi đã bỏ min/max ở trên vì giờ ta tra cứu theo Letter, không theo điểm số nữa.

// ==============================================
// 2. DỮ LIỆU GIẢ LẬP (MOCK DATA TỪ API)
// ==============================================

// Dữ liệu cũ để tính CPA
const previousData = {
  credits: 0,
  cpa: 2.25,
};

// Dữ liệu API trả về (Đã thêm gradeLetter như trong ảnh bạn gửi)
const currentSemesterData = [
  {
    subjectName: "Cấu trúc dữ liệu và giải thuật",
    credits: 3,
    midtermScore: 10, // TP1
    attendanceScore: 10, // ĐQT (Ví dụ)
    finalScore: 10, // Điểm thi
    totalScore: 10, // Điểm HP
    gradeLetter: "A+", // <-- API trả về cái này
  },
  {
    subjectName: "Nhập môn CNTT",
    credits: 2,
    midtermScore: 9.5,
    attendanceScore: 10.0,
    finalScore: 8.0,
    totalScore: 8.6,
    gradeLetter: "A",
  },
  {
    subjectName: "Triết học Mác - Lênin",
    credits: 2,
    midtermScore: 9.0,
    attendanceScore: 9.0,
    finalScore: 4.8,
    totalScore: 6.4,
    gradeLetter: "C+",
  },
  {
    subjectName: "Giáo dục thể chất 1",
    credits: 1,
    midtermScore: 7.0,
    attendanceScore: 7.0,
    finalScore: 2.0,
    totalScore: 3.5,
    gradeLetter: "F",
  },
];

// ==============================================
// 3. HÀM XỬ LÝ LOGIC
// ==============================================

// Hàm mới: Tìm thông tin dựa trên ĐIỂM CHỮ (Letter)
function getInfoByLetter(letter) {
  // Tìm trong mảng GRADE_RULES xem cái nào khớp chữ (A, B, C...)
  const rule = GRADE_RULES.find((r) => r.letter === letter);
  // Nếu không thấy (lỗi dữ liệu) thì mặc định là F
  return rule ? rule : GRADE_RULES[GRADE_RULES.length - 1];
}

// Hàm phụ: Tô màu cho các điểm số thành phần (chỉ để đẹp)
function getColorForScore(score) {
  const s = parseFloat(score);
  if (s >= 8.5) return "text-neon-green";
  if (s >= 7.0) return "text-neon-blue";
  if (s >= 5.5) return "text-neon-yellow";
  if (s >= 4.0) return "text-neon-orange";
  return "text-neon-pink";
}

function renderMainTableAndStats(data) {
  const tableBody = document.getElementById("grade-body");
  tableBody.innerHTML = "";

  let semesterTotalPoints4 = 0; // Tổng điểm hệ 4 * tín chỉ
  let semesterCredits = 0; // Tổng tín chỉ

  let passedCredits = 0;
  let failedCount = 0;

  data.forEach((item) => {
    // --- QUAN TRỌNG: Lấy thông tin từ Điểm Chữ API trả về ---
    const gradeInfo = getInfoByLetter(item.gradeLetter);
    const isFailed = gradeInfo.letter === "F";

    // Tính toán GPA
    semesterCredits += item.credits;

    // Quy đổi: Lấy scale4 từ bảng rules nhân với tín chỉ
    semesterTotalPoints4 += gradeInfo.scale4 * item.credits;

    if (isFailed) failedCount++;
    else passedCredits += item.credits;

    // Vẽ bảng
    const row = document.createElement("tr");
    if (isFailed) row.classList.add("row-failed");

    const statusHTML = isFailed
      ? `<span class="badge-fail">TRƯỢT</span>`
      : `<i class="fa-solid fa-check text-dim"></i>`;

    row.innerHTML = `
            <td class="subject-name">${item.subjectName}</td>
            <td>${item.credits}</td>
            
            <td class="${getColorForScore(item.midtermScore)}">${
      item.midtermScore
    }</td>
            <td class="${getColorForScore(item.attendanceScore)}">${
      item.attendanceScore
    }</td>
            <td class="${getColorForScore(item.finalScore)}">${
      item.finalScore
    }</td>
            
            <td class="${gradeInfo.color}" style="font-weight:bold;">${
      item.totalScore
    }</td>
            
            <td class="grade-letter ${gradeInfo.color}">${item.gradeLetter}</td>
            
            <td>${statusHTML}</td>
        `;
    tableBody.appendChild(row);
  });

  // --- TÍNH TOÁN GPA & CPA ---

  // 1. GPA (Kỳ này) = Tổng(Điểm hệ 4 * TC) / Tổng TC
  const gpa = semesterCredits > 0 ? semesterTotalPoints4 / semesterCredits : 0;

  // 2. CPA (Tích lũy)
  // (CPA cũ * TC cũ) + (Điểm hệ 4 kỳ này) / (TC cũ + TC mới)
  const previousTotalPoints = previousData.cpa * previousData.credits;
  const accumulatedTotalPoints = previousTotalPoints + semesterTotalPoints4;
  const accumulatedCredits = previousData.credits + semesterCredits;

  const cpa =
    accumulatedCredits > 0 ? accumulatedTotalPoints / accumulatedCredits : 0;

  // Hiển thị
  document.getElementById("gpa-value").textContent = gpa.toFixed(2);
  document.getElementById("cpa-value").textContent = cpa.toFixed(2);
  document.getElementById("credits-value").textContent =
    previousData.credits + passedCredits;
  document.getElementById("failed-value").textContent = failedCount;
}

function renderScaleTable() {
  const scaleBody = document.getElementById("scale-body");
  scaleBody.innerHTML = "";
  // Vì ta bỏ min/max nên ở bảng quy đổi ta fix cứng text hiển thị cho đẹp hoặc thêm lại min/max vào object nếu muốn hiển thị cột Thang 10
  // Ở đây tôi demo hiển thị đơn giản
  const displayRanges = [
    "9.0 - 10.0",
    "8.5 - 8.9",
    "7.8 - 8.4",
    "7.0 - 7.7",
    "6.3 - 6.9",
    "5.5 - 6.2",
    "4.8 - 5.4",
    "4.0 - 4.7",
    "0.0 - 3.9",
  ];

  GRADE_RULES.forEach((rule, index) => {
    const row = document.createElement("tr");
    row.classList.add(rule.bg);
    row.innerHTML = `
            <td>${displayRanges[index]}</td>
            <td>${rule.scale4}</td>
            <td class="${rule.color} fw-bold">${rule.letter}</td>
            <td>${rule.label}</td>
        `;
    scaleBody.appendChild(row);
  });
}

// ==============================================
// 4. KHỞI CHẠY & SỰ KIỆN
// ==============================================

renderMainTableAndStats(currentSemesterData);
renderScaleTable();

// ... (Giữ nguyên phần xử lý sự kiện Navbar, Modal ở cuối file cũ) ...
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });
}

const modal = document.getElementById("grade-scale-modal");
const btnOpen = document.querySelector(".btn-outline i.fa-table").parentElement;
const btnCloseX = document.querySelector(".close-btn");
const btnCloseBottom = document.getElementById("close-modal-btn");

btnOpen.addEventListener("click", () => (modal.style.display = "flex"));
function closeModal() {
  modal.style.display = "none";
}
btnCloseX.addEventListener("click", closeModal);
if (btnCloseBottom) btnCloseBottom.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target == modal) closeModal();
});
