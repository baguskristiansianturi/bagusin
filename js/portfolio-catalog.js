(() => {
  const page = document.querySelector(".portfolio-page");
  if (!page) return;
  const cards = [...page.querySelectorAll(".portfolio-project")];
  const controls = [...page.querySelectorAll("[data-portfolio-filter]")];
  const countNodes = [...page.querySelectorAll("[data-portfolio-count]")];
  const getCategory = card => {
    const label = card.querySelector(".portfolio-label")?.textContent?.trim().toLocaleLowerCase("id") || "";
    if (label.includes("eksperimen")) return "eksperimen";
    if (label.includes("konsep")) return "konsep";
    return "proyek";
  };
  const categories = new Map(cards.map(card => [card, getCategory(card)]));
  countNodes.forEach(node => {
    const key = node.dataset.portfolioCount;
    node.textContent = key === "all" ? String(cards.length) : String([...categories.values()].filter(value => value === key).length);
  });
  controls.forEach(button => button.addEventListener("click", () => {
    const selected = button.dataset.portfolioFilter;
    controls.forEach(control => {
      const active = control === button;
      control.classList.toggle("is-active", active);
      control.setAttribute("aria-pressed", String(active));
    });
    cards.forEach(card => { card.hidden = selected !== "all" && categories.get(card) !== selected; });
  }));
})();