(() => {
  const form = document.querySelector("#template-test-checkout");
  if (!form) return;
  const panels = [...document.querySelectorAll("[data-test-panel]")];
  const steps = [...document.querySelectorAll("[data-test-step]")];
  const name = document.querySelector("#test-name");
  const email = document.querySelector("#test-email");
  const platform = document.querySelector("#test-platform");
  const license = document.querySelector("#test-license");
  const blog = document.querySelector("#test-blog");
  const note = document.querySelector("#test-note");
  const consent = document.querySelector("#test-agree");
  const error = document.querySelector("#test-error");
  const review = document.querySelector("#test-review");
  const success = document.querySelector("#test-success");
  const finalConfirm = document.querySelector("#test-final-confirm");
  const summaryLicense = document.querySelector("[data-summary-license]");
  const summaryPrice = document.querySelector("[data-summary-price]");
  const requestedLicense = new URLSearchParams(window.location.search).get("license");
  if (requestedLicense === "premium" || requestedLicense === "free") license.value = requestedLicense;
  let step = 1;
  function licenseName() { return license.value === "premium" ? "Premium (simulasi tanpa kredit)" : "Free (kredit Bagusin tetap ada)"; }
  function price() { return license.value === "premium" ? "Rp49.000 (harga uji)" : "Rp0"; }
  function updatePrice() { summaryLicense.textContent = "Lisensi " + (license.value === "premium" ? "Premium · simulasi" : "Free · simulasi"); summaryPrice.textContent = price(); }
  function go(next) {
    step = next;
    panels.forEach(panel => { panel.hidden = Number(panel.dataset.testPanel) !== step; });
    steps.forEach(item => { const n = Number(item.dataset.testStep); item.classList.toggle("is-active", n === step); item.classList.toggle("is-done", n < step); });
    error.textContent = "";
    const active = document.querySelector('[data-test-panel="' + step + '"]');
    if (active) active.querySelector("h2")?.focus?.();
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function validate() {
    error.textContent = "";
    if (!name.value.trim()) { error.textContent = "Isi nama untuk melanjutkan."; name.focus(); return false; }
    if (!email.validity.valid || !email.value.trim()) { error.textContent = "Masukkan alamat email yang valid."; email.focus(); return false; }
    if (blog.value.trim() && !blog.validity.valid) { error.textContent = "Alamat blog harus berupa URL yang valid."; blog.focus(); return false; }
    if (!consent.checked) { error.textContent = "Centang persetujuan simulasi sebelum melanjutkan."; consent.focus(); return false; }
    return true;
  }
  function renderReview() {
    const rows = [["Nama",name.value.trim()],["Email",email.value.trim()],["Platform",platform.options[platform.selectedIndex].text],["Lisensi",licenseName()],["Harga",price()],["Blog / tujuan",blog.value.trim() || "Belum diisi"],["Catatan",note.value.trim() || "Tidak ada"]];
    review.innerHTML = rows.map(row => "<div><dt>" + escapeText(row[0]) + "</dt><dd>" + escapeText(row[1]) + "</dd></div>").join("");
    updatePrice();
  }
  function escapeText(value) { return String(value).replace(/[&<>"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char])); }
  document.querySelectorAll("[data-test-next]").forEach(button => button.addEventListener("click", () => {
    if (step === 1 && !validate()) return;
    if (step === 1) renderReview();
    go(Number(button.dataset.testNext));
  }));
  document.querySelectorAll("[data-test-back]").forEach(button => button.addEventListener("click", () => go(Number(button.dataset.testBack))));
  license.addEventListener("change", updatePrice);
  document.querySelector("#test-submit").addEventListener("click", () => {
    finalConfirm.hidden = true;
    success.hidden = false;
    document.querySelector("#test-success-summary").textContent = "Pilihan: " + licenseName() + " · " + price() + ". Nama dan email hanya digunakan untuk mengisi simulasi di browser dan tidak dikirim atau disimpan.";
    steps.forEach(item => { item.classList.toggle("is-active", Number(item.dataset.testStep) === 3); item.classList.toggle("is-done", Number(item.dataset.testStep) < 3); });
    window.scrollTo({top:0,behavior:"smooth"});
  });
  form.addEventListener("submit", event => event.preventDefault());
  updatePrice();
})();