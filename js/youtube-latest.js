/* BagusIn — latest YouTube bridge
   The scheduled GitHub Action refreshes data/youtube-latest.json.
   The page remains useful before the first video exists. */
(function () {
  "use strict";

  function init() {
    const root = document.querySelector("[data-youtube-latest]");
    if (!root) return;

    const title = root.querySelector("[data-youtube-title]");
    const description = root.querySelector("[data-youtube-description]");
    const status = root.querySelector("[data-youtube-status]");
    const thumbnail = root.querySelector("[data-youtube-thumbnail]");
    const placeholder = root.querySelector("[data-youtube-placeholder]");
    const links = root.querySelectorAll("[data-youtube-link]");

    fetch("/bagusin/data/youtube-latest.json", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("YouTube data unavailable");
        return response.json();
      })
      .then(function (data) {
        const video = data && data.video;
        if (!video || !video.url) return;

        links.forEach(function (link) {
          link.href = video.url;
        });

        if (title && video.title) title.textContent = video.title;
        if (description && video.description) description.textContent = video.description;
        if (status) status.textContent = video.publishedAt ? formatDate(video.publishedAt) : "Latest video";

        if (thumbnail && video.thumbnail) {
          thumbnail.src = video.thumbnail;
          thumbnail.alt = video.title ? "Thumbnail: " + video.title : "YouTube latest video";
          thumbnail.hidden = false;
          if (placeholder) placeholder.hidden = true;
        }
      })
      .catch(function () {
        /* Keep the intentional Coming Soon state. */
      });
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Latest video";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
