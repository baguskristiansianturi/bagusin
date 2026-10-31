(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", open);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  const dialog = document.querySelector("[data-gallery-dialog]");
  const fullImage = document.querySelector("[data-gallery-full]");
  document.querySelectorAll("[data-gallery-image]").forEach(button => {
    button.addEventListener("click", () => {
      if (!dialog || !fullImage) return;
      fullImage.src = button.dataset.galleryImage;
      fullImage.alt = button.querySelector("img")?.alt || "Tattoo artwork";
      dialog.showModal();
    });
  });
  document.querySelector("[data-gallery-close]")?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  const form = document.querySelector("#booking-form");
  if (!form) return;
  const panels = [...form.querySelectorAll("[data-step-panel]")];
  const labels = [...form.querySelectorAll("[data-step-label]")];
  const nextButton = form.querySelector("[data-next]");
  const prevButton = form.querySelector("[data-prev]");
  const whatsappButton = form.querySelector("[data-whatsapp]");
  const counter = document.querySelector("[data-step-counter]");
  const progress = document.querySelector("[data-progress]");
  const summary = form.querySelector("[data-summary]");
  const alert = form.querySelector("[data-form-alert]");
  let currentStep = 1;

  const field = name => form.elements.namedItem(name);
  const value = name => (field(name)?.value || "").trim();
  const safe = text => String(text || "—").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));

  function updateSummary() {
    if (!summary) return;
    const rows = [
      ["Name", value("name")],
      ["WhatsApp", value("phone")],
      ["Style", value("style")],
      ["Placement", value("placement")],
      ["Size", value("size")],
      ["Preferred date", value("date")],
      ["Preferred time", value("time")]
    ];
    summary.innerHTML = rows.map(([label, text]) => '<p><small>' + safe(label) + '</small><strong>' + safe(text) + '</strong></p>').join("");
  }

  function showStep(step) {
    currentStep = step;
    panels.forEach(panel => {
      const active = Number(panel.dataset.stepPanel) === step;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    labels.forEach(label => label.classList.toggle("is-active", Number(label.dataset.stepLabel) <= step));
    if (counter) counter.textContent = "STEP 0" + step + " / 03";
    if (progress) progress.style.width = (step / 3 * 100) + "%";
    if (prevButton) prevButton.hidden = step === 1;
    if (nextButton) nextButton.hidden = step === 3;
    if (whatsappButton) whatsappButton.hidden = step !== 3;
    if (alert) alert.textContent = "";
    if (step === 3) updateSummary();
  }

  function validateCurrentStep() {
    const activePanel = panels.find(panel => Number(panel.dataset.stepPanel) === currentStep);
    if (!activePanel) return true;
    const controls = [...activePanel.querySelectorAll("input,select,textarea")];
    for (const control of controls) {
      if (control.type === "checkbox" && !control.checked && control.required) {
        control.focus();
        return false;
      }
      if (control.required && !control.checkValidity()) {
        control.reportValidity();
        return false;
      }
      if (control.type === "url" && control.value && !control.checkValidity()) {
        control.reportValidity();
        return false;
      }
    }
    return true;
  }

  nextButton?.addEventListener("click", () => {
    if (!validateCurrentStep()) {
      if (alert) alert.textContent = "Please complete the required fields before continuing.";
      return;
    }
    showStep(Math.min(3, currentStep + 1));
  });
  prevButton?.addEventListener("click", () => showStep(Math.max(1, currentStep - 1)));

  whatsappButton?.addEventListener("click", () => {
    if (!validateCurrentStep()) {
      if (alert) alert.textContent = "Please review the required fields and consent before sending.";
      return;
    }
    const message = [
      "Hello Nara Ink Studio, I would like to enquire about a tattoo appointment.",
      "",
      "Name: " + value("name"),
      "WhatsApp: " + value("phone"),
      "Email: " + (value("email") || "Not provided"),
      "Style: " + value("style"),
      "Placement: " + value("placement"),
      "Approximate size: " + value("size"),
      "Reference link: " + (value("reference") || "Not provided"),
      "Idea: " + value("idea"),
      "Preferred date: " + value("date"),
      "Preferred time: " + value("time"),
      "",
      "I understand this is an appointment request and availability needs to be confirmed by the studio."
    ].join("\n");
    const demoNumber = "6281234567890";
    window.open("https://wa.me/" + demoNumber + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
    if (alert) alert.textContent = "Your WhatsApp message is ready. Please attach any reference image directly in the chat.";
  });

  const dateInput = field("date");
  if (dateInput) {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = localDate;
  }
  showStep(1);
})();