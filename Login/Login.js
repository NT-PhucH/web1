async function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: email, password: pass }),
  });

  const data = await res.json();
  if (data.success) {
    window.location.href = "../Schedule/Schedule.html";
  } else {
    alert(data.message);
  }
}
