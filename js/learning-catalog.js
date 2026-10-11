document.addEventListener("DOMContentLoaded", function () {
  const search = document.getElementById("legacy-course-search");
  const count = document.getElementById("legacy-course-count");
  const cards = Array.from(document.querySelectorAll("[data-legacy-course]"));
  const groups = Array.from(document.querySelectorAll("[data-legacy-group]"));
  if (!search || !cards.length) return;

  function updateCatalogue() {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    groups.forEach(function (group) {
      let groupVisible = 0;
      group.querySelectorAll("[data-legacy-course]").forEach(function (card) {
        const matches = !query || (card.dataset.legacySearch || card.textContent).toLocaleLowerCase().includes(query);
        card.hidden = !matches;
        if (matches) {
          visible += 1;
          groupVisible += 1;
        }
      });
      group.hidden = groupVisible === 0;
      if (query && groupVisible > 0) group.open = true;
      if (!query) group.open = group.dataset.legacyGroup === "productivity";
    });
    if (count) count.textContent = query
      ? (document.documentElement.lang === "en" ? visible + " matching topics" : visible + " materi cocok")
      : (document.documentElement.lang === "en" ? "Showing all " + visible + " reference topics" : "Menampilkan " + visible + " materi rujukan");
  }

  search.addEventListener("input", updateCatalogue);
  updateCatalogue();
});
