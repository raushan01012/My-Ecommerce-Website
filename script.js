document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const pageLoader = document.getElementById("pageLoader");
  const themeToggle = document.getElementById("themeToggle");
  const header = document.querySelector(".header");
  const backToTop = document.querySelector(".back-to-top");
  const reveals = document.querySelectorAll(".reveal");

  body.classList.add("loading");

  function updateHeaderStyle() {
    if (!header) return;

    if (window.scrollY > 10) {
      header.style.backdropFilter = "blur(12px)";
      header.style.webkitBackdropFilter = "blur(12px)";
      header.style.background = body.classList.contains("dark-mode")
        ? "rgba(17,20,27,0.88)"
        : "rgba(248,248,251,0.88)";
    } else {
      header.style.backdropFilter = "blur(10px)";
      header.style.webkitBackdropFilter = "blur(10px)";
      header.style.background = body.classList.contains("dark-mode")
        ? "rgba(17,20,27,0.78)"
        : "rgba(248,248,251,0.78)";
    }
  }

  function hideLoader() {
    if (pageLoader) {
      pageLoader.classList.add("hide");
    }
    body.classList.remove("loading");
  }

  const savedTheme = localStorage.getItem("site-theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
  }

  updateHeaderStyle();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      localStorage.setItem(
        "site-theme",
        body.classList.contains("dark-mode") ? "dark" : "light"
      );
      updateHeaderStyle();
    });
  }

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    reveals.forEach((item) => revealObserver.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add("active"));
  }

  window.addEventListener(
    "scroll",
    () => {
      if (backToTop) {
        if (window.scrollY > 220) {
          backToTop.classList.add("show");
        } else {
          backToTop.classList.remove("show");
        }
      }

      updateHeaderStyle();
    },
    { passive: true }
  );

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  if (document.readyState === "complete") {
    setTimeout(hideLoader, 120);
  } else {
    window.addEventListener("load", () => {
      setTimeout(hideLoader, 120);
    });
  }
});