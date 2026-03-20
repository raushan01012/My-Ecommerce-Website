document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const pageLoader = document.getElementById("pageLoader");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.querySelector(".theme-icon");
  const header = document.querySelector(".header");
  const backToTop = document.querySelector(".back-to-top");
  const reveals = document.querySelectorAll(".reveal");

  let lastScrollY = window.scrollY;
  let prevScrollY = window.scrollY;
  let ticking = false;

  /* ─── THEME ─────────────────────────────────────────── */
  const savedTheme = localStorage.getItem("site-theme");
  if (savedTheme === "dark") body.classList.add("dark-mode");

  const updateThemeIcon = () => {
    if (!themeIcon) return;
    themeIcon.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
  };
  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      localStorage.setItem("site-theme", body.classList.contains("dark-mode") ? "dark" : "light");
      updateThemeIcon();
    });
  }

  /* ─── SCROLL UTILS ───────────────────────────────────── */
  const genderNavWrap = document.querySelector(".gender-nav-wrap");

  const updateHeaderStyle = () => {
    if (!header) return;
    header.classList.toggle("scrolled", lastScrollY > 10);
  };

  const updateBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("show", lastScrollY > 220);
  };

  // Smart hide: hide gender nav when scrolling down, show when scrolling up
  const updateGenderNav = () => {
    if (!genderNavWrap) return;
    const diff = lastScrollY - prevScrollY;
    if (lastScrollY < 60) {
      genderNavWrap.classList.remove("gender-nav-hidden");
    } else if (diff > 4) {
      genderNavWrap.classList.add("gender-nav-hidden");
    } else if (diff < -4) {
      genderNavWrap.classList.remove("gender-nav-hidden");
    }
    prevScrollY = lastScrollY;
  };

  const onScroll = () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeaderStyle();
        updateBackToTop();
        updateGenderNav();
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

  /* ─── REVEAL ON SCROLL ───────────────────────────────── */
  const triggerReveals = () => {
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
        { threshold: 0.10, rootMargin: "0px 0px -36px 0px" }
      );
      document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
    } else {
      document.querySelectorAll(".reveal").forEach((item) => item.classList.add("active"));
    }
  };

  triggerReveals();

  /* ─── GENDER TAB SWITCHER (shopping page only) ───────── */
  const genderTabs = document.querySelectorAll(".gender-tab");
  const genderSlider = document.getElementById("genderSlider");
  const menContent = document.getElementById("menContent");
  const womenContent = document.getElementById("womenContent");

  if (genderTabs.length && genderSlider) {

    // Position slider under given tab element
    const moveSlider = (tabEl) => {
      const nav = tabEl.closest(".gender-nav");
      const navRect = nav.getBoundingClientRect();
      const tabRect = tabEl.getBoundingClientRect();
      genderSlider.style.left = (tabRect.left - navRect.left + nav.scrollLeft) + "px";
      genderSlider.style.width = tabRect.width + "px";
    };

    // Init slider on active tab
    const activeTab = document.querySelector(".gender-tab.active");
    if (activeTab) {
      // Use rAF so layout is settled
      requestAnimationFrame(() => moveSlider(activeTab));
    }

    const showContent = (gender) => {
      const isMan = gender === "men";
      const showEl = isMan ? menContent : womenContent;
      const hideEl = isMan ? womenContent : menContent;

      if (!showEl || !hideEl) return;

      // Hide old
      hideEl.classList.remove("active-content", "fade-in");
      hideEl.style.display = "none";

      // Show new
      showEl.style.display = "block";
      // Re-trigger animation
      showEl.classList.remove("fade-in");
      void showEl.offsetWidth; // reflow
      showEl.classList.add("active-content", "fade-in");

      // Re-init reveal observers for newly visible content
      triggerReveals();

      // Scroll top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    genderTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab.classList.contains("active")) return;

        genderTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // Save preference
        const gender = tab.dataset.gender;
        localStorage.setItem("site-gender", gender);

        // Animate slider
        moveSlider(tab);

        // Switch content
        showContent(gender);
      });
    });

    // Restore gender preference
    const savedGender = localStorage.getItem("site-gender");
    if (savedGender && savedGender !== "men") {
      const targetTab = document.querySelector(`.gender-tab[data-gender="${savedGender}"]`);
      if (targetTab) {
        // Simulate click without scroll
        genderTabs.forEach((t) => t.classList.remove("active"));
        targetTab.classList.add("active");
        requestAnimationFrame(() => moveSlider(targetTab));
        showContent(savedGender);
      }
    }

    // Recalculate slider on resize
    window.addEventListener("resize", () => {
      const active = document.querySelector(".gender-tab.active");
      if (active) moveSlider(active);
    }, { passive: true });
  }

  /* ─── PAGE LOADER ────────────────────────────────────── */
  body.style.overflow = "hidden";
  body.style.touchAction = "none";

  let loaderHidden = false;

  const hideLoader = () => {
    if (loaderHidden) return;
    loaderHidden = true;
    if (pageLoader) pageLoader.classList.add("hide");
    body.style.overflow = "";
    body.style.touchAction = "";
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hideLoader();
    });
  });

  window.addEventListener("load", hideLoader, { once: true });
  setTimeout(hideLoader, 1500);
});
