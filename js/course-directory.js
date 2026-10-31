document.addEventListener("DOMContentLoaded", function () {
  const root = document.querySelector(".course-directory");
  if (!root) return;
  const track = root.querySelector("[data-category-track]");
  const groups = root.querySelector("[data-course-groups]");
  const status = root.querySelector("[data-course-status]");
  const buttons = Array.from(root.querySelectorAll("[data-course-category]"));
  let activeCategory = "all";
  let catalogue = null;

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[char]));

  function render() {
    if (!catalogue) return;
    const courses = catalogue.courses.filter(course => course.status === "available" &&
      (activeCategory === "all" || course.category === activeCategory));
    status.textContent = courses.length
      ? courses.length + " course tersedia"
      : "Belum ada course dalam kategori ini. Silakan lihat kategori lainnya.";

    const categories = activeCategory === "all"
      ? catalogue.categories
      : catalogue.categories.filter(category => category.id === activeCategory);

    groups.innerHTML = categories.map(category => {
      const items = courses.filter(course => course.category === category.id);
      if (!items.length) return "";
      return '<section class="course-directory__group" aria-labelledby="course-category-' + escapeHtml(category.id) + '">' +
        '<div class="course-directory__group-heading"><div><span class="section-kicker">Bidang pembelajaran</span><h3 id="course-category-' + escapeHtml(category.id) + '">' + escapeHtml(category.name) + '</h3></div><span class="course-directory__count">' + items.length + (items.length === 1 ? " course" : " course") + '</span></div>' +
        '<div class="course-directory__grid">' + items.map(course =>
          '<article class="course-directory-card">' +
            '<a class="course-directory-card__image" href="' + escapeHtml(course.url) + '" aria-label="Lihat detail ' + escapeHtml(course.title) + '">' +
              '<img src="' + escapeHtml(course.image) + '" alt="' + escapeHtml(course.imageAlt || course.title) + '" loading="lazy" width="1200" height="760">' +
              '<span class="course-directory-card__image-label">' + escapeHtml(course.categoryLabel || category.name) + '</span>' +
            '</a>' +
            '<div class="course-directory-card__body"><h4><a href="' + escapeHtml(course.url) + '">' + escapeHtml(course.title) + '</a></h4>' +
              '<p>' + escapeHtml(course.description) + '</p>' +
              '<div class="course-directory-card__meta"><span>' + escapeHtml(course.meetings) + '</span><span>' + escapeHtml(course.duration) + '</span></div>' +
              '<div class="course-directory-card__bottom"><div><small>Investasi program</small><strong>' + escapeHtml(course.price) + '</strong></div><a class="course-directory-card__link" href="' + escapeHtml(course.url) + '">Lihat detail <span aria-hidden="true">→</span></a></div>' +
            '</div></article>'
        ).join("") + '</div></section>';
    }).join("");
  }

  buttons.forEach(button => button.addEventListener("click", function () {
    activeCategory = button.dataset.courseCategory || "all";
    buttons.forEach(item => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    render();
  }));

  const previous = root.querySelector("[data-category-prev]");
  const next = root.querySelector("[data-category-next]");
  const scrollCategories = direction => track.scrollBy({left: direction * Math.max(180, track.clientWidth * .65), behavior:"smooth"});
  if (previous) previous.addEventListener("click", () => scrollCategories(-1));
  if (next) next.addEventListener("click", () => scrollCategories(1));

  fetch("/bagusin/data/courses.json").then(response => {
    if (!response.ok) throw new Error("Course data unavailable");
    return response.json();
  }).then(data => {
    catalogue = data;
    render();
  }).catch(() => {
    status.textContent = "Katalog belum dapat dimuat. Silakan coba beberapa saat lagi.";
    groups.innerHTML = '<p class="course-directory__error">Daftar course sedang tidak tersedia.</p>';
  });
});
