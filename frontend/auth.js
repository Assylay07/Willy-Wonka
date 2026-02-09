// Switch between Sign Up and Log In
function showLogin() {
  document.getElementById("signupBox").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");
}

function showSignup() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("signupBox").classList.remove("hidden");
}


// Добавляем /api, так как на бэкенде роуты обычно висят там
const API_BASE_URL = "https://willywonka-six.vercel.app/api/auth/login";

//Sign Up Function
async function signUp() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

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
    alert("❌ Password must be 8+ chars, include 1 uppercase & 1 number.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    // Сначала проверяем, не вернул ли сервер HTML-ошибку (500/404)
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server error: Technical issues on the backend. Please check logs.");
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

// Log In Function
async function logIn() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("⚠️ Please fill in all fields.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server error: Check if the backend is running and the URL is correct.");
    }

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name || "");

    alert("✅ Login successful!");
    window.location.href = "willy.html";
  } catch (err) {
    console.error("Login Error:", err);
    alert("❌ " + err.message);
  }
}