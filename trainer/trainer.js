// IronPulse trainer helpers (front-end demo; connect to PHP/MySQL later). Needs admin.js (toast, submitForm).
function filterRows(inputId, tableId) {
  const q = document.getElementById(inputId).value.toLowerCase();
  document.querySelectorAll("#" + tableId + " tbody tr").forEach(r =>
    (r.style.display = r.textContent.toLowerCase().includes(q) ? "" : "none"));
}
function openModal() { document.getElementById("contentModal").style.display = "flex"; }
function closeModal() { document.getElementById("contentModal").style.display = "none"; }
function saveContent(e) {
  e.preventDefault();
  const f = e.target; if (!f.checkValidity()) { f.reportValidity(); return false; }
  const t = f.title.value, ty = f.ctype.value, c = f.category.value, v = f.visibility.value;
  document.querySelector("#contentTable tbody").insertAdjacentHTML("afterbegin",
    `<tr><td>${esc(t)}</td><td>${esc(ty)}</td><td><span class="pill">${esc(c)}</span></td><td>${esc(v)}</td><td><a class="link" onclick="toast('Edit: ${esc(t)}')">Edit</a></td></tr>`);
  toast("Content saved!"); f.reset(); closeModal(); return false;
}
function esc(s) { return String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])); }

/* Diet plan: keep each day's meals in memory while switching days */
const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"], meals = ["breakfast","lunch","snack","dinner"];
const dietData = {}; days.forEach(d => (dietData[d] = { breakfast: "", lunch: "", snack: "", dinner: "" }));
let currentDay = "monday";
function keepDay() { meals.forEach(m => (dietData[currentDay][m] = document.getElementById(m).value)); }
function loadDay() { keepDay(); currentDay = document.getElementById("daySelect").value; meals.forEach(m => (document.getElementById(m).value = dietData[currentDay][m])); }
function savePlan(e) {
  e.preventDefault(); if (!e.target.checkValidity()) { e.target.reportValidity(); return false; }
  keepDay(); toast("Diet plan saved for all days!"); return false;
}

/* Routine builder */
function exerciseHTML(n) {
  return `<h4>Exercise ${n}</h4><button type="button" class="rm" onclick="removeExercise(this)">Remove</button>
  <div class="form-grid">
    <div class="input-group full"><label>Exercise Name</label><input class="input-field" required placeholder="e.g., Barbell Squat"></div>
    <div class="input-group"><label>Sets</label><input type="number" min="1" class="input-field" required placeholder="e.g., 4"></div>
    <div class="input-group"><label>Reps</label><input class="input-field" required placeholder="e.g., 10-12"></div>
    <div class="input-group"><label>Rest (seconds)</label><input type="number" min="0" class="input-field" placeholder="e.g., 60"></div>
    <div class="input-group"><label>Duration (minutes)</label><input type="number" min="0" class="input-field" placeholder="optional"></div>
    <div class="input-group full"><label>Notes / Instructions</label><textarea class="input-field" placeholder="Form cues, tempo, equipment"></textarea></div>
  </div>`;
}
function addExercise() {
  const c = document.getElementById("exercises"), d = document.createElement("div");
  d.className = "exercise-block"; d.innerHTML = exerciseHTML(c.children.length + 1); c.appendChild(d);
  d.scrollIntoView({ behavior: "smooth" });
}
function removeExercise(btn) {
  const c = document.getElementById("exercises");
  if (c.children.length === 1) return toast("A routine needs at least one exercise", false);
  btn.closest(".exercise-block").remove();
  [...c.children].forEach((b, i) => (b.querySelector("h4").textContent = "Exercise " + (i + 1)));
}
function saveRoutine(e) {
  e.preventDefault(); if (!e.target.checkValidity()) { e.target.reportValidity(); return false; }
  toast('Routine "' + e.target.rname.value + '" saved!'); return false;
}

/* Progress logs + reports */
function addLog(e) {
  e.preventDefault(); const f = e.target; if (!f.checkValidity()) { f.reportValidity(); return false; }
  document.querySelector("#logTable tbody").insertAdjacentHTML("afterbegin",
    `<tr><td>${esc(f.member.value)}</td><td class="detailText">${esc(f.date.value)}</td><td>${esc(f.weight.value)} kg</td><td class="detailText">${esc(f.fat.value || "-")}%</td><td class="detailText">${esc(f.waist.value || "-")} cm</td></tr>`);
  toast("Progress recorded!"); f.reset(); return false;
}
function generateReport(e) {
  e.preventDefault(); const f = e.target;
  document.querySelector("#reportTable tbody").insertAdjacentHTML("afterbegin",
    `<tr><td>${esc(f.rtype.value)} (${esc(f.period.value)})</td><td class="detailText">${new Date().toISOString().slice(0, 10)}</td><td><a class="link" onclick="toast('Downloading report...')">Download</a></td></tr>`);
  toast("Report generated!"); return false;
}

/* Chat (demo replies) */
const chats = {
  "Dixie": [["r", "Hi coach! Should I do cardio before or after weights?"], ["s", "Weights first, then 15-20 minutes of cardio. How is the knee feeling?"]],
  "Mitu": [["r", "Can you share this week's diet plan again?"]],
  "Liyan": [["r", "I hit a new deadlift PR today! 💪"]],
  "Ehan": [["r", "I'll be back at the gym next week."]]
};
let activeChat = "Dixie";
function renderChat() {
  document.getElementById("chatName").textContent = activeChat;
  document.getElementById("msgs").innerHTML = chats[activeChat].map(([k, t]) =>
    `<div class="message-row ${k === "s" ? "sent" : "received"}"><div class="message-meta">${k === "s" ? "You" : esc(activeChat)}</div><div class="message-bubble">${esc(t)}</div></div>`).join("");
  const a = document.getElementById("msgs"); a.scrollTop = a.scrollHeight;
}
function selectChat(name, el) {
  activeChat = name; document.querySelectorAll(".contact-item").forEach(c => c.classList.remove("active")); el.classList.add("active"); renderChat();
}
function sendMessage(e) {
  e.preventDefault(); const i = document.getElementById("msgInput"), t = i.value.trim(); if (!t) return false;
  chats[activeChat].push(["s", t]); i.value = ""; renderChat();
  const who = activeChat; setTimeout(() => { chats[who].push(["r", "Thanks coach, got it! 👍"]); if (who === activeChat) renderChat(); }, 1200);
  return false;
}
window.addEventListener("click", e => { const m = document.getElementById("contentModal"); if (m && e.target === m) closeModal(); });
document.addEventListener("DOMContentLoaded", () => { if (document.getElementById("msgs")) renderChat(); });
