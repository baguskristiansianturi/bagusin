/* BAGUSIN — simple, newcomer-first homepage guide */
(function () {
  "use strict";
  const root = document.querySelector("[data-pathfinder]");
  if (!root) return;

  const buttons = [...root.querySelectorAll("[data-stage]")];
  const followup = root.querySelector("[data-followup]");
  const goals = root.querySelector("[data-goals]");
  const result = root.querySelector("[data-result]");
  const progress = root.querySelector("[data-pathfinder-progress]");
  const title = root.querySelector("[data-result-title]");
  const summary = root.querySelector("[data-result-summary]");
  const steps = root.querySelector("[data-result-steps]");
  const caveat = root.querySelector("[data-result-caveat]");
  const nextLink = root.querySelector("[data-consult-link]");
  const reset = root.querySelector("[data-reset-pathfinder]");
  const english = window.location.pathname.split("/").includes("en");

  const recommendations = {
    starter: {
      id: "consultation",
      title: ["Mulai dari kebutuhan yang paling penting", "Start with the most important need"],
      summary: ["Anda tidak perlu memahami istilah teknis. Kita mulai dengan tujuan bisnis, pelanggan, dan hal yang paling perlu dikerjakan.", "You do not need to know the technical terms. Start with your business goal, customers, and the most important task."],
      steps: [
        ["Tentukan satu tujuan utama yang ingin dicapai.", "Choose one primary outcome you want to achieve."],
        ["Lihat layanan yang sesuai dengan kebutuhan Anda.", "Review the services that match your needs."],
        ["Kirim brief singkat agar ruang lingkup bisa dibahas dengan jelas.", "Send a short brief so the scope can be discussed clearly."]
      ],
      caveat: ["Belum perlu memutuskan semuanya sekarang. Biaya dan ruang lingkup dibahas sebelum pekerjaan dimulai.", "You do not need to decide everything now. Cost and scope are discussed before work begins."],
      href: "/bagusin/contact/?mode=brief",
      cta: ["Ceritakan kebutuhan Anda", "Tell us what you need"]
    },
    business: {
      id: "seo-content",
      title: ["Cari bagian yang paling menghambat pertumbuhan", "Find what is holding growth back"],
      summary: ["Sebelum menambah biaya promosi atau fitur, periksa dulu bagaimana pelanggan menemukan, memahami, dan menghubungi bisnis Anda.", "Before spending more on promotion or features, review how customers find, understand, and contact your business."],
      steps: [
        ["Periksa website, penawaran, dan jalur kontak saat ini.", "Review your current website, offer, and contact path."],
        ["Pilih satu hambatan yang paling berdampak.", "Choose the obstacle with the greatest impact."],
        ["Bahas perbaikan berdasarkan prioritas dan anggaran.", "Discuss improvements based on priorities and budget."]
      ],
      caveat: ["Tidak semua bisnis membutuhkan website baru, SEO, atau iklan sekaligus.", "Not every business needs a new website, SEO, or ads all at once."],
      href: "/bagusin/contact/?mode=brief",
      cta: ["Bahas kebutuhan bisnis", "Discuss your business needs"]
    },
    existing: {
      id: "maintenance-uiux",
      title: ["Perbaiki yang ada sebelum membangun ulang", "Improve what exists before rebuilding"],
      summary: ["Mulai dari masalah yang terlihat. Perubahan kecil yang tepat bisa lebih masuk akal daripada membangun semuanya dari awal.", "Start with the problem you can see. The right small change may be more practical than rebuilding everything."],
      steps: [
        ["Tunjukkan halaman atau proses yang bermasalah.", "Identify the page or process that is causing trouble."],
        ["Jelaskan hasil yang Anda harapkan.", "Describe the outcome you want."],
        ["Tentukan prioritas, ruang lingkup, dan batas anggaran.", "Set priorities, scope, and budget limits."]
      ],
      caveat: ["Rekomendasi akhir bergantung pada kondisi website dan kebutuhan yang sebenarnya.", "The final recommendation depends on the actual website and requirements."],
      href: "/bagusin/contact/?mode=brief",
      cta: ["Minta peninjauan awal", "Request an initial review"]
    }
  };

  function text(pair) { return pair[english ? 1 : 0]; }

  function choose(stage) {
    const item = recommendations[stage];
    if (!item) return;
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.stage === stage)));
    if (followup) followup.hidden = true;
    if (goals) goals.replaceChildren();
    title.textContent = text(item.title);
    summary.textContent = text(item.summary);
    caveat.textContent = text(item.caveat);
    steps.replaceChildren();
    item.steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = text(step);
      steps.appendChild(li);
    });
    nextLink.href = item.href;
    nextLink.textContent = text(item.cta) + " →";
    if (progress) progress.textContent = english ? "Suggested next step" : "Saran langkah berikutnya";
    result.hidden = false;
    result.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  }

  buttons.forEach(button => button.addEventListener("click", () => choose(button.dataset.stage)));
  if (reset) reset.addEventListener("click", () => {
    result.hidden = true;
    buttons.forEach(button => button.setAttribute("aria-pressed", "false"));
    if (progress) progress.textContent = english ? "Choose a path" : "Pilih jalur yang sesuai";
    buttons[0]?.focus();
  });
})();