document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const pageLoader = document.getElementById("pageLoader");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.querySelector(".theme-icon");
  const header = document.querySelector(".header");
  const backToTop = document.querySelector(".back-to-top");
  const reveals = document.querySelectorAll(".reveal");

  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeaderStyle = () => {
    if (!header) return;
    header.classList.toggle("scrolled", lastScrollY > 10);
  };

  const updateBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("show", lastScrollY > 220);
  };

  const onScroll = () => {
    lastScrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeaderStyle();
        updateBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  };

  const updateThemeIcon = () => {
    if (!themeIcon) return;
    themeIcon.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
  };

  const hideLoader = () => {
    if (pageLoader) {
      pageLoader.classList.add("hide");
    }
    body.classList.add("page-ready");
  };

  const savedTheme = localStorage.getItem("site-theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
  }

  updateThemeIcon();
  updateHeaderStyle();
  updateBackToTop();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      localStorage.setItem(
        "site-theme",
        body.classList.contains("dark-mode") ? "dark" : "light"
      );
      updateThemeIcon();
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
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    reveals.forEach((item) => revealObserver.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add("active"));
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // loader instantly hatao
  requestAnimationFrame(hideLoader);

  // fallback
  window.addEventListener("load", hideLoader, { once: true });
});