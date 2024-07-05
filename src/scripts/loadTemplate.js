const qs = document.querySelector.bind(document);

function load(selector, path) {
  const cached = localStorage.getItem(path);
  if (cached) {
    qs(selector).innerHTML = cached;
  }

  fetch(path)
    .then((res) => res.text())
    .then((html) => {
      console.log(html);
      if (html !== cached) {
        qs(selector).innerHTML = html;
        localStorage.setItem(path, html);
      }
    });
}
