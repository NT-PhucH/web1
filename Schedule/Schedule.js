const daysContainer = document.getElementById("daysContainer");
const monthYear = document.getElementById("monthYear");

// =============================
// DỮ LIỆU LỊCH HỌC (SAU NÀY LẤY TỪ API)
// =============================
// const lessons = {
//   "2025-11-17": [
//     {
//       start: "12:30",
//       end: "14:55",
//       title: "Lý thuyết cơ sở dữ liệu",
//       room: "303-TA1 TA1- 8T",
//     },
//     {
//       start: "15:05",
//       end: "17:30",
//       title: "Tiếng Anh 1",
//       room: "303-TA1 TA1- 8T",
//     },
//   ],

//   "2025-11-18": [],
// };

//

let currentDate = new Date();

// =============================
// HIỂN THỊ LỊCH THÁNG
// =============================
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = `Tháng ${month + 1} - ${year}`;
  daysContainer.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  // Ngày tháng trước
  for (let i = startDay - 1; i >= 0; i--) {
    const div = document.createElement("div");
    div.classList.add("day", "other-month");
    div.textContent = daysInPrevMonth - i;
    daysContainer.appendChild(div);
  }

  // Ngày tháng hiện tại
  for (let i = 1; i <= daysInMonth; i++) {
    const div = document.createElement("div");
    div.classList.add("day");
    div.textContent = i;

    // Kiểm tra hôm đó có lịch học không
    const dateKey = getDateKey(i, month, year);
    if (lessons[dateKey] && lessons[dateKey].length > 0) {
      div.classList.add("has-lesson");
    }

    const today = new Date();
    if (
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      div.classList.add("today");
    }

    daysContainer.appendChild(div);
  }

  // Ngày tháng sau
  const totalCells = 35;
  const usedCells = daysContainer.childElementCount;
  const remaining = totalCells - usedCells;

  for (let i = 1; i <= remaining; i++) {
    const div = document.createElement("div");
    div.classList.add("day", "other-month");
    div.textContent = i;
    daysContainer.appendChild(div);
  }
}

// =============================
// NÚT CHUYỂN THÁNG
// =============================
document.getElementById("prevBtn").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById("nextBtn").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

renderCalendar();

// =============================
// HIỂN THỊ LỊCH HỌC THEO NGÀY
// =============================
function getDateKey(day, month, year) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function renderLessons(day, month, year) {
  const key = getDateKey(day, month, year);
  const card = document.getElementById("lessonCard");

  const items = lessons[key];

  card.innerHTML = `<h2 class="lesson-title">Lịch học ${day}</h2>`;

  if (!items || items.length === 0) {
    card.innerHTML += `<p>Không có lịch học.</p>`;
    return;
  }

  items.forEach((item) => {
    card.innerHTML += `
      <div class="lesson-item">
        <div class="time-block">
          <div>${item.start}</div>
          <div>▼</div>
          <div>${item.end}</div>
        </div>

        <div class="lesson-info">
          <div class="lesson-info-title">${item.title}</div>
          <div class="lesson-room">${item.room}</div>
        </div>
      </div>
    `;
  });
}

// =============================
// CLICK VÀO NGÀY TRONG LỊCH
// =============================
daysContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("day")) {
    const day = Number(e.target.textContent);
    renderLessons(day, currentDate.getMonth(), currentDate.getFullYear());
  }
});

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

window.addEventListener("load", () => {
  const today = new Date();

  // Auto load lịch học hôm nay
  renderLessons(today.getDate(), today.getMonth(), today.getFullYear());
});

async function loadScheduleFromAPI() {
  try {
    const res = await fetch("http://localhost:3000/api/schedule");
    const data = await res.json();

    console.log("Lịch học từ backend:", data);

    // Chuyển dữ liệu API → lessons
    for (let item of data) {
      const dateKey = item.date; // YYYY-MM-DD

      if (!lessons[dateKey]) lessons[dateKey] = [];

      lessons[dateKey].push({
        start: item.timeStart,
        end: item.timeEnd,
        title: item.subject,
        room: item.room,
      });
    }

    // Sau khi nạp dữ liệu backend → vẽ lại lịch
    renderCalendar();
    const today = new Date();
    renderLessons(today.getDate(), today.getMonth(), today.getFullYear());
  } catch (err) {
    console.error("Lỗi tải lịch học từ backend:", err);
  }
}

// CHẠY NGAY KHI MỞ TRANG
loadScheduleFromAPI();
