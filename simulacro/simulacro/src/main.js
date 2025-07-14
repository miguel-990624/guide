// main.js
const app = document.getElementById("app");

const routes = {
  "/": "/src/pages/login.html",
  "/register": "/src/pages/register.html",
  "/dashboard": "/src/pages/dashboard.html",
  "/public": "/src/pages/public.html"
};

function navigate(path) {
  const url = routes[path];
  if (!url) return app.innerHTML = "<h1>404 Not Found</h1>";
  fetch(url)
    .then(res => res.text())
    .then(html => app.innerHTML = html);
}

// Detect changes in URL
window.addEventListener("popstate", () => {
  navigate(location.pathname);
});

// Change URL via click and load view
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    const path = e.target.getAttribute("href");
    history.pushState(null, null, path);
    navigate(path);
  }
});

// Load initial route
navigate(location.pathname);
