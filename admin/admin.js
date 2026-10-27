// IronPulse admin helpers (front-end demo only; connect to PHP/MySQL later)
function toast(msg, ok = true) {
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.className = "show" + (ok ? "" : " err");
  setTimeout(() => (t.className = ""), 2800);
}
function submitForm(e, msg) {
  e.preventDefault();
  const f = e.target;
  if (!f.checkValidity()) { f.reportValidity(); return false; }
  toast(msg); f.reset(); return false;
}
function handleEdit(name) { toast("Editing: " + name); }
function changePassword(e) {
  e.preventDefault();
  const f = e.target;
  if (!f.checkValidity()) { f.reportValidity(); return false; }
  if (f.np.value !== f.cp.value) { toast("Passwords do not match", false); return false; }
  toast("Password changed successfully!"); f.reset(); return false;
}
