// Talks to the Umang backend API (see js/config.js for API_BASE_URL).

function showMsg(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = "form-msg show " + type;
}

function setLoading(btn, loadingText) {
  if (!btn) return () => {};
  const original = btn.textContent;
  btn.textContent = loadingText;
  btn.disabled = true;
  return () => { btn.textContent = original; btn.disabled = false; };
}

async function apiRequest(path, options = {}) {
  const res = await fetch(API_BASE_URL + path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  let body = {};
  try { body = await res.json(); } catch (e) { /* no JSON body */ }
  if (!res.ok) {
    throw new Error(body.message || "Something went wrong. Please try again.");
  }
  return body;
}

// ---------- Contact form ----------
const contactForm = document.getElementById("contactForm");
contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgEl = document.getElementById("contactMsg");
  const btn = contactForm.querySelector("button[type=submit]");
  const restore = setLoading(btn, "Sending...");

  const data = Object.fromEntries(new FormData(contactForm).entries());

  try {
    const result = await apiRequest("/api/contact", { method: "POST", body: JSON.stringify(data) });
    showMsg(msgEl, result.message || "Message sent successfully!", "success");
    contactForm.reset();
  } catch (err) {
    showMsg(msgEl, err.message, "error");
  } finally {
    restore();
  }
});

// ---------- Login form ----------
const loginForm = document.getElementById("loginForm");
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgEl = document.getElementById("loginMsg");
  const btn = loginForm.querySelector("button[type=submit]");
  const restore = setLoading(btn, "Logging in...");

  const data = Object.fromEntries(new FormData(loginForm).entries());

  try {
    const result = await apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify(data) });
    localStorage.setItem("umang_token", result.token);
    localStorage.setItem("umang_user", JSON.stringify(result.user));
    showMsg(msgEl, `Welcome back, ${result.user.fullName}!`, "success");
  } catch (err) {
    showMsg(msgEl, err.message, "error");
  } finally {
    restore();
  }
});

// ---------- Signup form ----------
const signupForm = document.getElementById("signupForm");
signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgEl = document.getElementById("signupMsg");
  const btn = signupForm.querySelector("button[type=submit]");

  const data = Object.fromEntries(new FormData(signupForm).entries());

  if (data.password !== data.confirmPassword) {
    showMsg(msgEl, "Passwords do not match.", "error");
    return;
  }
  delete data.confirmPassword;

  const restore = setLoading(btn, "Creating account...");
  try {
    const result = await apiRequest("/api/auth/signup", { method: "POST", body: JSON.stringify(data) });
    localStorage.setItem("umang_token", result.token);
    localStorage.setItem("umang_user", JSON.stringify(result.user));
    showMsg(msgEl, `Account created! Welcome, ${result.user.fullName}.`, "success");
    signupForm.reset();
  } catch (err) {
    showMsg(msgEl, err.message, "error");
  } finally {
    restore();
  }
});

// ---------- Donate form ----------
const donateForm = document.getElementById("donateForm");
donateForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgEl = document.getElementById("donateMsg");
  const btn = donateForm.querySelector("button[type=submit]");
  const restore = setLoading(btn, "Processing...");

  const data = Object.fromEntries(new FormData(donateForm).entries());
  data.amount = Number(data.amount);

  try {
    const result = await apiRequest("/api/donate", { method: "POST", body: JSON.stringify(data) });
    showMsg(msgEl, `Thank you! Your receipt ID is ${result.receiptId}.`, "success");
    donateForm.reset();
  } catch (err) {
    showMsg(msgEl, err.message, "error");
  } finally {
    restore();
  }
});
