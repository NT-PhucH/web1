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

const previousData = { credits: 0, cpa: 0 };

// ==============================================
// 2. HÀM XỬ LÝ LOGIC & RENDER
// ==============================================

function getInfoByLetter(letter) {
  if (!letter) return GRADE_RULES[GRADE_RULES.length - 1];
  const rule = GRADE_RULES.find(
    (r) => r.letter.toUpperCase() === letter.toUpperCase()
  );
  return rule ? rule : GRADE_RULES[GRADE_RULES.length - 1];
}

function getColorForScore(score) {
  const s = parseFloat(score);
  if (isNaN(s)) return "text-muted";
  if (s >= 8.5) return "text-neon-green";
  if (s >= 7.0) return "text-neon-blue";
  if (s >= 5.5) return "text-neon-yellow";
  if (s >= 4.0) return "text-neon-orange";
  return "text-neon-pink";
}

// Hàm hiển thị khi chưa có dữ liệu
function renderLoginRequiredState() {
  const tableBody = document.getElementById("grade-body");
  tableBody.innerHTML = `
    <tr>
        <td colspan="8" style="text-align:center; padding: 40px;">
            <div style="margin-bottom: 15px;">
                <i class="fa-solid fa-user" style="font-size: 3rem; color: #666;"></i>
            </div>
            <h3 style="color: #888;">Chưa đăng nhập xem điểm</h3>
            <p style="color: #666;">Vui lòng ấn nút <b>"Đăng nhập"</b> ở góc phải để kết nối dữ liệu.</p>
        </td>
    </tr>
  `;
  // Reset chỉ số
  document.getElementById("gpa-value").textContent = "...";
  document.getElementById("cpa-value").textContent = "...";
  document.getElementById("credits-value").textContent = "...";
  document.getElementById("failed-value").textContent = "...";
}

function renderMainTableAndStats(data) {
  const tableBody = document.getElementById("grade-body");
  tableBody.innerHTML = "";

  if (!data || data.length === 0) {
    tableBody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align:center; padding: 30px; color: #888;">
                Đã đăng nhập nhưng chưa có dữ liệu điểm nào.
            </td>
        </tr>`;
    return;
  }

  let semesterTotalPoints4 = 0;
  let semesterCredits = 0;
  let passedCredits = 0;
  let failedCount = 0;

  data.forEach((item) => {
    const gradeInfo = getInfoByLetter(item.gradeLetter);
    const isFailed = gradeInfo.letter === "F";
    const credits = parseInt(item.credits) || 0;

    if (credits > 0 && item.gradeLetter) {
      semesterCredits += credits;
      semesterTotalPoints4 += gradeInfo.scale4 * credits;
      if (isFailed) failedCount++;
      else passedCredits += credits;
    }

    const row = document.createElement("tr");
    if (isFailed) row.classList.add("row-failed");

    const statusHTML = isFailed
      ? `<span class="badge-fail">TRƯỢT</span>`
      : `<i class="fa-solid fa-check text-dim"></i>`;

    row.innerHTML = `
            <td class="subject-name">${item.subjectName}</td>
            <td>${credits}</td>
            <td class="${getColorForScore(item.midtermScore)}">${
      item.midtermScore || "-"
    }</td>
            <td class="${getColorForScore(item.attendanceScore)}">${
      item.attendanceScore || "-"
    }</td>
            <td class="${getColorForScore(item.finalScore)}">${
      item.finalScore || "-"
    }</td>
            <td class="${gradeInfo.color}" style="font-weight:bold;">${
      item.totalScore || "-"
    }</td>
            <td class="grade-letter ${gradeInfo.color}">${
      item.gradeLetter || "?"
    }</td>
            <td>${statusHTML}</td>
        `;
    tableBody.appendChild(row);
  });

  const gpa = semesterCredits > 0 ? semesterTotalPoints4 / semesterCredits : 0;
  const previousTotalPoints = previousData.cpa * previousData.credits;
  const accumulatedTotalPoints = previousTotalPoints + semesterTotalPoints4;
  const accumulatedCredits = previousData.credits + semesterCredits;
  const cpa =
    accumulatedCredits > 0 ? accumulatedTotalPoints / accumulatedCredits : 0;

  document.getElementById("gpa-value").textContent = gpa.toFixed(2);
  document.getElementById("cpa-value").textContent = cpa.toFixed(2);
  document.getElementById("credits-value").textContent =
    previousData.credits + passedCredits;
  document.getElementById("failed-value").textContent = failedCount;
}

function renderScaleTable() {
  const scaleBody = document.getElementById("scale-body");
  scaleBody.innerHTML = "";
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
    row.innerHTML = `<td>${displayRanges[index] || ""}</td><td>${
      rule.scale4
    }</td><td class="${rule.color} fw-bold">${rule.letter}</td><td>${
      rule.label
    }</td>`;
    scaleBody.appendChild(row);
  });
}

// Hàm kiểm tra trạng thái đăng nhập để Ẩn/Hiện nút
function checkLoginStateAndUpdateUI() {
  const isLoggedIn = localStorage.getItem("is_grade_logged_in") === "true";
  const btnLogin = document.getElementById("btnLogin");
  // const btnUpdate = document.getElementById("btnUpdateGrades"); // Nút update luôn hiện

  if (isLoggedIn) {
    // Đã đăng nhập: Ẩn nút Login
    if (btnLogin) btnLogin.style.display = "none";
  } else {
    // Chưa đăng nhập: Hiện nút Login
    if (btnLogin) btnLogin.style.display = "inline-flex";
  }
}

// ==============================================
// 3. API & CORE LOGIC
// ==============================================

// Hàm này thực hiện quy trình: Mở Browser -> Chờ Login -> Lấy dữ liệu -> Trả về
async function performLoginAndFetch(isUpdateMode = false) {
  const tableBody = document.getElementById("grade-body");
  const btnLogin = document.getElementById("btnLogin");
  const btnUpdate = document.getElementById("btnUpdateGrades");

  // UI Loading
  if (btnLogin) btnLogin.disabled = true;
  if (btnUpdate) btnUpdate.disabled = true;

  const originalHTML = tableBody.innerHTML;

  // Hiện thông báo hướng dẫn
  tableBody.innerHTML = `
    <tr>
        <td colspan="8" style="text-align:center; padding: 40px;">
            <div style="margin-bottom: 15px;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 3rem; color: #00eaff;"></i>
            </div>
            <h3 style="color: #00eaff;">Đang kết nối Server...</h3>
            <p style="color: #fff;">Cửa sổ trình duyệt sẽ bật lên.</p>
            <p style="color: #ff0077; font-weight: bold;">VUI LÒNG ĐĂNG NHẬP TRÊN CỬA SỔ ĐÓ.</p>
            <p style="color: #888;">(Sau khi đăng nhập xong, dữ liệu sẽ tự động tải về đây)</p>
        </td>
    </tr>
  `;

  try {
    const isLocal =
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "localhost";
    const API_URL = isLocal
      ? "http://localhost:3000/api/grades"
      : "https://web1-backend-o6y4.onrender.com/api/grades";

    // Gọi API (Không gửi user/pass, server tự mở browser chờ nhập tay)
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manualLogin: true }),
    });

    const responseData = await res.json();

    if (!responseData.success) {
      alert("Lỗi: " + responseData.message);
      tableBody.innerHTML = originalHTML;
    } else {
      // === THÀNH CÔNG ===
      // Dữ liệu server trả về dạng: { grades: [...], info: { name: "...", mssv: "..." } }
      const { grades, info } = responseData.data;

      console.log("Dữ liệu lấy về:", grades);
      console.log("Thông tin SV:", info);

      // 1. Cập nhật giao diện Họ Tên và MSSV
      if (info) {
        const nameEl = document.querySelector(".student-info h1");
        const mssvEl = document.querySelector(".student-info span");

        if (nameEl) nameEl.textContent = info.name;
        if (mssvEl) mssvEl.textContent = info.mssv;

        // Lưu thông tin SV vào cache
        localStorage.setItem("cached_student_info", JSON.stringify(info));
      }

      // 2. Lưu điểm
      localStorage.setItem("cached_grades", JSON.stringify(grades));
      // 3. Đánh dấu ĐÃ ĐĂNG NHẬP
      localStorage.setItem("is_grade_logged_in", "true");

      // 4. Render bảng điểm
      renderMainTableAndStats(grades);

      alert(
        isUpdateMode
          ? "Cập nhật dữ liệu thành công!"
          : "Đăng nhập thành công! Xin chào " + (info?.name || "bạn")
      );

      checkLoginStateAndUpdateUI();
    }
  } catch (error) {
    console.error("Lỗi kết nối:", error);
    alert("Lỗi kết nối đến Server (Đã bật 'node server.js' chưa?)");
    tableBody.innerHTML = originalHTML;
  } finally {
    // Mở lại nút bấm
    if (btnLogin) btnLogin.disabled = false;
    if (btnUpdate) btnUpdate.disabled = false;
  }
}

// ==============================================
// 4. SỰ KIỆN NÚT BẤM (HANDLERS)
// ==============================================

// A. Xử lý nút ĐĂNG NHẬP
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
  btnLogin.addEventListener("click", () => {
    performLoginAndFetch(false);
  });
}

// B. Xử lý nút CẬP NHẬT
const btnUpdate = document.getElementById("btnUpdateGrades");
if (btnUpdate) {
  btnUpdate.addEventListener("click", () => {
    const isLoggedIn = localStorage.getItem("is_grade_logged_in") === "true";

    if (!isLoggedIn) {
      alert("Bạn chưa đăng nhập! Vui lòng ấn nút 'Đăng nhập' trước.");
      return;
    }

    if (confirm("Bạn muốn cập nhật điểm mới nhất từ hệ thống?")) {
      performLoginAndFetch(true);
    }
  });
}

// ==============================================
// 5. MAIN - CHẠY KHI MỞ TRANG
// ==============================================

// 1. Render bảng quy đổi
renderScaleTable();

// 2. Kiểm tra và hiển thị thông tin SV cũ (nếu có)
const cachedInfo = localStorage.getItem("cached_student_info");
if (cachedInfo) {
  try {
    const info = JSON.parse(cachedInfo);
    const nameEl = document.querySelector(".student-info h1");
    const mssvEl = document.querySelector(".student-info span");
    if (nameEl) nameEl.textContent = info.name;
    if (mssvEl) mssvEl.textContent = info.mssv;
  } catch (e) {
    console.log("Lỗi parse info cũ");
  }
}

// 3. Kiểm tra và hiển thị bảng điểm cũ (nếu có)
const cachedGrades = localStorage.getItem("cached_grades");
if (cachedGrades) {
  console.log("Có dữ liệu cũ -> Hiển thị ngay");
  renderMainTableAndStats(JSON.parse(cachedGrades));
} else {
  renderLoginRequiredState();
}

// 4. Cập nhật trạng thái nút bấm
checkLoginStateAndUpdateUI();

// ==============================================
// 6. UI MODAL & MENU (Giao diện phụ)
// ==============================================
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });
}

const modal = document.getElementById("grade-scale-modal");
const btnOpenScale = document.querySelector(
  ".action-buttons .btn-outline i.fa-table"
)?.parentElement;
const btnCloseX = document.querySelector(".close-btn");
const btnCloseBottom = document.getElementById("close-modal-btn");

if (btnOpenScale)
  btnOpenScale.addEventListener("click", () => (modal.style.display = "flex"));

function closeModal() {
  if (modal) modal.style.display = "none";
}
if (btnCloseX) btnCloseX.addEventListener("click", closeModal);
if (btnCloseBottom) btnCloseBottom.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target == modal) closeModal();
});

// ==============================================
// 7. TỰ ĐỘNG ĐĂNG XUẤT KHI RỜI TRANG
// ==============================================
window.addEventListener("beforeunload", () => {
  // Xóa trạng thái đăng nhập
  localStorage.removeItem("is_grade_logged_in");
  // LƯU Ý: Không xóa "cached_grades" và "cached_student_info" để giữ lại dữ liệu cũ
});
