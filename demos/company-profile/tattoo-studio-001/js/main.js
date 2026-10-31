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
        menuButton.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  const cards = [...document.querySelectorAll(".flash-card")];
  document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach(item => item.classList.toggle("is-active", item === button));
      const filter = button.dataset.filter;
      cards.forEach(card => { card.hidden = filter !== "all" && card.dataset.style !== filter; });
    });
  });

  const designField = document.querySelector('[name="design"]');
  document.querySelectorAll("[data-design]").forEach(button => {
    button.addEventListener("click", () => {
      if (designField) designField.value = button.dataset.design;
      document.querySelector("#booking")?.scrollIntoView({behavior:"smooth"});
      window.setTimeout(() => designField?.focus({preventScroll:true}), 450);
    });
  });

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
  dialog?.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

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
    const rows = [["Name",value("name")],["WhatsApp",value("phone")],["Design",value("design")],["Style",value("style")],["Placement",value("placement")],["Size",value("size")],["Date",value("date")],["Time",value("time")]];
    summary.innerHTML = rows.map(([label,text]) => '<p><small>'+safe(label)+'</small><strong>'+safe(text)+'</strong></p>').join("");
  }
  function showStep(step) {
    currentStep = step;
    panels.forEach(panel => { const active = Number(panel.dataset.stepPanel) === step; panel.hidden = !active; panel.classList.toggle("is-active",active); });
    labels.forEach(label => label.classList.toggle("is-active",Number(label.dataset.stepLabel) <= step));
    if(counter) counter.textContent = "STEP 0"+step+" / 03";
    if(progress) progress.style.width = (step/3*100)+"%";
    if(prevButton) prevButton.hidden = step === 1;
    if(nextButton) nextButton.hidden = step === 3;
    if(whatsappButton) whatsappButton.hidden = step !== 3;
    if(alert) alert.textContent = "";
    if(step === 3) updateSummary();
  }
  function validateStep() {
    const panel = panels.find(item => Number(item.dataset.stepPanel) === currentStep);
    if(!panel) return true;
    for(const control of panel.querySelectorAll("input,select,textarea")) {
      if(control.required && !control.checkValidity()) { control.reportValidity(); return false; }
    }
    return true;
  }
  nextButton?.addEventListener("click", () => {
    if(!validateStep()) { if(alert) alert.textContent = "Please complete the required fields before continuing."; return; }
    showStep(Math.min(3,currentStep+1));
  });
  prevButton?.addEventListener("click", () => showStep(Math.max(1,currentStep-1)));
  whatsappButton?.addEventListener("click", () => {
    if(!validateStep()) { if(alert) alert.textContent = "Please review the required fields and consent."; return; }
    const message = [
      "Hello Bagus Tattoo Studio, I would like to enquire about a tattoo.",
      "Name: "+value("name"),"WhatsApp: "+value("phone"),"Email: "+(value("email")||"Not provided"),
      "Design: "+(value("design")||"Custom idea"),"Style: "+value("style"),"Placement: "+value("placement"),
      "Size: "+value("size"),"Reference: "+(value("reference")||"Not provided"),"Idea: "+value("idea"),
      "Preferred date: "+value("date"),"Preferred time: "+value("time"),
      "I understand this is an enquiry and not a confirmed appointment."
    ].join("\n");
    const demoNumber = "6281234567890";
    window.open("https://wa.me/"+demoNumber+"?text="+encodeURIComponent(message),"_blank","noopener,noreferrer");
    if(alert) alert.textContent = "Your WhatsApp enquiry is ready. Attach your reference images in the chat if needed.";
  });
  const dateInput = field("date");
  if(dateInput) {
    const now = new Date();
    dateInput.min = new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);
  }
  showStep(1);
})();