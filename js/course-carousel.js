document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-course-track]").forEach(function (track) {
    const section = track.closest(".course-related");
    if (!section) return;
    const previous = section.querySelector("[data-course-prev]");
    const next = section.querySelector("[data-course-next]");
    const step = function () {
      const card = track.querySelector(".course-related__card");
      return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth;
    };
    const update = function () {
      const max = track.scrollWidth - track.clientWidth;
      if (previous) previous.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    };
    if (previous) previous.addEventListener("click", function () { track.scrollBy({left: -step(), behavior: "smooth"}); });
    if (next) next.addEventListener("click", function () { track.scrollBy({left: step(), behavior: "smooth"}); });
    track.addEventListener("scroll", update, {passive: true});
    window.addEventListener("resize", update);
    update();
  });
});
