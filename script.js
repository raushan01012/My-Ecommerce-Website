document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const pageLoader = document.getElementById("pageLoader");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.querySelector(".theme-icon");
  const header = document.querySelector(".header");
  const backToTop = document.querySelector(".back-to-top");
  const reveals = document.querySelectorAll(".reveal");

  body.classList.add("loading");

  const updateHeaderStyle = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 10);
  };

  const updateThemeIcon = () => {
    if (!themeIcon) return;
    themeIcon.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
  };

  const hideLoader = () => {
    if (pageLoader) {
      pageLoader.classList.add("hide");
    }
    body.classList.remove("loading");
  };

  const savedTheme = localStorage.getItem("site-theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
  }

  updateThemeIcon();
  updateHeaderStyle();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      localStorage.setItem(
        "site-theme",
        body.classList.contains("dark-mode") ? "dark" : "light"
      );
      updateThemeIcon();
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
        rootMargin: "0px 0px -20px 0px",
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
        backToTop.classList.toggle("show", window.scrollY > 220);
      }
      updateHeaderStyle();
    },
    { passive: true }
  );

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  if (document.readyState === "complete") {
    setTimeout(hideLoader, 80);
  } else {
    window.addEventListener("load", () => {
      setTimeout(hideLoader, 80);
    });
  }
});