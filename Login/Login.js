async function login() {
  const emailInput = document.getElementById("email");
  const passInput = document.getElementById("password");
  const loginBtn = document.querySelector(".loginBtn");

  const email = emailInput.value.trim();
  const pass = passInput.value.trim();

  if (!email || !pass) {
    alert("Vui lòng nhập đầy đủ Tên tài khoản và Mật khẩu!");
    return;
  }

  // 1. Hiệu ứng Loading
  const originalText = loginBtn.innerHTML;
  loginBtn.innerHTML =
    '<i class="fa-solid fa-circle-notch fa-spin"></i> Đang kết nối...';
  loginBtn.disabled = true;

  try {
    // 2. Gọi API kiểm tra đăng nhập
    // Đã thay bằng link Render
    const res = await fetch(
      "https://web1-backend-o6y4.onrender.com/api/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: pass }),
      }
    );

    const data = await res.json();

    if (data.success) {
      // Lưu thông tin đăng nhập
      localStorage.setItem(
        "user_credentials",
        JSON.stringify({
          username: email,
          password: pass,
        })
      );

      if (data.studentName) {
        localStorage.setItem("student_name", data.studentName);
      }

      alert("Đăng nhập thành công!");
      window.location.href = "../Schedule/Schedule.html";
    } else {
      alert("Lỗi: " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert(
      "Không thể kết nối tới Server Backend. Hãy kiểm tra lại file server.js đang chạy chưa."
    );
  } finally {
    loginBtn.innerHTML = originalText;
    loginBtn.disabled = false;
  }
}

document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    login();
  }
});
