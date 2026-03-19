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

  // ─── Theme ───────────────────────────────────────────────────────────────────

  const savedTheme = localStorage.getItem("site-theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
  }

  const updateThemeIcon = () => {
    if (!themeIcon) return;
    themeIcon.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
  };

  updateThemeIcon();

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

  // ─── Scroll handlers ─────────────────────────────────────────────────────────

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

  updateHeaderStyle();
  updateBackToTop();

  window.addEventListener("scroll", onScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ─── Reveal on scroll ────────────────────────────────────────────────────────

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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((item) => revealObserver.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add("active"));
  }

  // ─── Page loader ─────────────────────────────────────────────────────────────
  // FIX 1: body ko lock karo jab tak loader visible hai
  //         Isse loader ke neeche body scroll nahi hogi
  body.style.overflow = "hidden";
  body.style.touchAction = "none"; // mobile touch scroll bhi rok do

  let loaderHidden = false;

  const hideLoader = () => {
    if (loaderHidden) return; // ek baar se zyada na chale
    loaderHidden = true;

    if (pageLoader) {
      pageLoader.classList.add("hide");
    }

    // FIX 2: body unlock karo — scroll wapas enable karo
    body.style.overflow = "";
    body.style.touchAction = "";
  };

  // FIX 3: Double rAF — pehla frame schedule karta hai,
  //         doosra ensure karta hai browser ne actual paint kar liya,
  //         tab loader hide hoga. Single rAF pe paint se pehle
  //         hide ho jaata tha jisse flicker aata tha.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hideLoader();
    });
  });

  // Fallback: agar kuch resources slow hain toh load event pe bhi hide karo
  window.addEventListener("load", hideLoader, { once: true });

  // Safety fallback: max 1.5s ke baad loader force hide karo
  // Taaki kisi bhi case mein page stuck na rahe
  setTimeout(hideLoader, 1500);
});