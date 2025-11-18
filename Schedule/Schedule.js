const daysContainer = document.getElementById("daysContainer");
const monthYear = document.getElementById("monthYear");
const lessonCard = document.getElementById("lessonCard");

// Biến toàn cục lưu dữ liệu lịch học
let lessons = {};

let currentDate = new Date();

// ==========================================
// 1. HÀM HỖ TRỢ (HELPER FUNCTIONS)
// ==========================================

function parseDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    // Chuyển từ dd/mm/yyyy -> yyyy-mm-dd
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return null;
}

function convertShiftToTime(shift) {
  // Xử lý nếu shift là dạng "7,8,9" -> lấy số đầu và số cuối -> "7-9"
  if (shift.includes(",")) {
    const parts = shift.split(",");
    const start = parts[0];
    const end = parts[parts.length - 1];
    shift = `${start}-${end}`; // Chuyển thành dạng "7-9" để map
  }

  // Bản đồ giờ học (Thêm các ca lẻ nếu cần)
  const timeMap = {
    "1-3": { start: "07:00", end: "09:25" },
    "4-6": { start: "09:35", end: "12:00" },
    "7-9": { start: "12:30", end: "14:55" },
    "10-12": { start: "15:05", end: "17:30" },
    "13-15": { start: "18:00", end: "20:25" },
    // Thêm các ca đặc biệt nếu trường bạn có
    "1-2": { start: "07:00", end: "08:35" },
    "3-3": { start: "08:40", end: "09:25" },
    "7-8": { start: "12:30", end: "14:05" },
  };

  return timeMap[shift] || { start: `Ca ${shift}`, end: "" };
}

function getDateKey(day, month, year) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// ==========================================
// 2. LOGIC RENDER GIAO DIỆN (UI)
// ==========================================

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = `Tháng ${month + 1} - ${year}`;
  daysContainer.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  // Vẽ ngày tháng trước
  for (let i = startDay - 1; i >= 0; i--) {
    const div = document.createElement("div");
    div.classList.add("day", "other-month");
    div.textContent = daysInPrevMonth - i;
    daysContainer.appendChild(div);
  }

  // Vẽ ngày tháng hiện tại
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const div = document.createElement("div");
    div.classList.add("day");
    div.textContent = i;

    const dateKey = getDateKey(i, month, year);

    // Kiểm tra có lịch học không để thêm dấu chấm
    if (lessons[dateKey] && lessons[dateKey].length > 0) {
      div.classList.add("has-lesson");
    }

    if (
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      div.classList.add("today");
    }

    daysContainer.appendChild(div);
  }

  // Vẽ ngày tháng sau cho đủ lưới
  const totalCells = 42;
  const usedCells = daysContainer.childElementCount;
  const remaining = totalCells - usedCells;

  for (let i = 1; i <= remaining; i++) {
    const div = document.createElement("div");
    div.classList.add("day", "other-month");
    div.textContent = i;
    daysContainer.appendChild(div);
  }
}

function renderLessons(day, month, year) {
  const key = getDateKey(day, month, year);

  lessonCard.innerHTML = `<h2 class="lesson-title">Lịch học ngày ${day}/${
    month + 1
  }</h2>`;

  const items = lessons[key];

  if (!items || items.length === 0) {
    lessonCard.innerHTML += `
        <div style="text-align: center; margin-top: 30px; color: #888;">
            <i class="fas fa-mug-hot" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <p>Hôm nay không có lịch học. Nghỉ ngơi thôi!</p>
        </div>
    `;
    return;
  }

  items.forEach((item) => {
    lessonCard.innerHTML += `
      <div class="lesson-item">
        <div class="time-block">
          <div>${item.start}</div>
          <div style="font-size: 0.8rem; opacity: 0.6;">▼</div>
          <div>${item.end}</div>
        </div>

        <div class="lesson-info">
          <div class="lesson-info-title">${item.title}</div>
          <div class="lesson-room">
             <i class="fas fa-map-marker-alt"></i> Phòng: ${item.room}
          </div>
           <div class="lesson-room">
             <i class="fas fa-chalkboard-teacher"></i> GV: ${item.teacher}
          </div>
        </div>
      </div>
    `;
  });
}

// ==========================================
// 3. SỰ KIỆN & API
// ==========================================

document.getElementById("prevBtn").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById("nextBtn").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

daysContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("day")) {
    document
      .querySelectorAll(".day.selected")
      .forEach((el) => el.classList.remove("selected"));
    e.target.classList.add("selected");

    let clickedDay = Number(e.target.textContent);
    let displayMonth = currentDate.getMonth();
    let displayYear = currentDate.getFullYear();

    renderLessons(clickedDay, displayMonth, displayYear);
  }
});

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });
}

// ==========================================
// 4. GỌI API LẤY DỮ LIỆU
// ==========================================
async function loadScheduleFromAPI() {
  const lessonCard = document.getElementById("lessonCard");

  // Lấy user từ localStorage (Lưu ý: phải đăng nhập thành công ở trang Login mới có cái này)
  const storedUser = localStorage.getItem("user_credentials");

  if (!storedUser) {
    lessonCard.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p>Bạn chưa đăng nhập.</p>
            <button onclick="window.location.href='../Login/Login.html'" 
                style="padding: 8px 16px; background: #00eaff; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px; font-weight: bold;">
                Đăng nhập ngay
            </button>
        </div>
    `;
    return;
  }

  const { username, password } = JSON.parse(storedUser);

  // Hiệu ứng Loading
  lessonCard.innerHTML = `
      <div style="text-align: center; margin-top: 50px;">
        <div class="loader" style="border: 4px solid #333; border-top: 4px solid #00eaff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        <p style="margin-top: 15px; color: #00eaff;">Đang đồng bộ dữ liệu từ QLĐT...</p>
      </div>
      <style>@keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}</style>
  `;

  try {
    console.log("Bắt đầu gọi API...");

    // --- ĐỔI TỪ LOCALHOST SANG IP 127.0.0.1 ĐỂ TRÁNH LỖI TRÊN WINDOWS ---
    const res = await fetch("http://127.0.0.1:3000/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const responseData = await res.json();

    if (!responseData.success) {
      lessonCard.innerHTML = `<p style="color: red; text-align: center;">Lỗi từ Server: ${responseData.message}</p>`;
      return;
    }

    console.log("Dữ liệu nhận được:", responseData.data);
    const apiData = responseData.data;

    lessons = {};

    // Xử lý dữ liệu trả về
    apiData.forEach((item) => {
      const dateKey = parseDate(item.ngayHoc);
      if (!dateKey) return;

      const timeInfo = convertShiftToTime(item.caHoc);

      if (!lessons[dateKey]) {
        lessons[dateKey] = [];
      }

      lessons[dateKey].push({
        start: timeInfo.start,
        end: timeInfo.end,
        title: item.tenMonHoc,
        room: item.phongHoc,
        teacher: item.giangVien,
        rawShift: item.caHoc,
      });
    });

    console.log("Dữ liệu sau khi xử lý:", lessons);

    // Vẽ lại lịch sau khi có dữ liệu
    renderCalendar();

    // Hiển thị bài học hôm nay
    const today = new Date();
    renderLessons(today.getDate(), today.getMonth(), today.getFullYear());
  } catch (err) {
    console.error("Lỗi kết nối:", err);
    lessonCard.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p style="color: #ff4d4d; font-weight: bold;">Không kết nối được Server!</p>
            <p style="font-size: 13px; color: #ccc;">Vui lòng kiểm tra:</p>
            <ul style="text-align: left; display: inline-block; color: #888; font-size: 13px;">
                <li>1. Bạn đã chạy lệnh "node server.js" chưa?</li>
                <li>2. Terminal có báo lỗi gì không?</li>
                <li>3. Thử tắt server và chạy lại.</li>
            </ul>
        </div>
    `;
  }
}

// Chạy lần đầu
renderCalendar();
loadScheduleFromAPI();
