// ================== Переключение форм ==================
function showLogin() {
  document.getElementById("signupBox").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");
}

function showSignup() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("signupBox").classList.remove("hidden");
}

// ================== Регистрация (Sign Up) ==================
async function signUp() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  // Валидация
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  if (!name || !email || !password) {
    alert("⚠️ Please fill in all fields.");
    return;
  }
  if (!emailPattern.test(email)) {
    alert("❌ Please enter a valid email address.");
    return;
  }
  if (!passwordPattern.test(password)) {
    alert("❌ Password must bea 8+ chars, include 1 uppercase & 1 number.");
    return;
  }

  try {
    // ПРЯМОЙ ПУТЬ БЕЗ ОШИБОК
    const res = await fetch("https://willywonka-six.vercel.app/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server error: Бэкенд вернул ошибку (не JSON). Проверь логи Vercel.");
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");

    alert("✅ Account created successfully! Please log in now.");
    showLogin();
  } catch (err) {
    console.error("SignUp Error:", err);
    alert("❌ " + err.message);
  }
}

// ================== Вход (Log In) ==================
async function logIn() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("⚠️ Please fill in all fields.");
    return;
  }

  try {
    // ПРЯМОЙ ПУТЬ БЕЗ ОШИБОК
    const res = await fetch("https://willywonka-six.vercel.app/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server error: Проверь, что в server.js прописан путь /api/auth.");
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    // Сохранение данных
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name || "");

    alert("✅ Login successful!");
    window.location.href = "willy.html";
  } catch (err) {
    console.error("Login Error:", err);
    alert("❌ " + err.message);
  }
}