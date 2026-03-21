document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const pageLoader = document.getElementById("pageLoader");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.querySelector(".theme-icon");
  const header = document.querySelector(".header");
  const backToTop = document.querySelector(".back-to-top");

  let lastScrollY = window.scrollY;
  let prevScrollY = window.scrollY;
  let ticking = false;

  /* LOADER - hide instantly, never block */
  if (pageLoader) {
    pageLoader.classList.add("hide");
    pageLoader.style.display = "none";
  }

  /* THEME */
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

  /* SCROLL */
  const genderNavWrap = document.querySelector(".gender-nav-wrap");

  const updateHeaderStyle = () => {
    if (!header) return;
    header.classList.toggle("scrolled", lastScrollY > 10);
  };

  const updateBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("show", lastScrollY > 220);
  };

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

  /* REVEAL */
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

  /* GENDER TAB SWITCHER */
  const genderTabs = document.querySelectorAll(".gender-tab");
  const genderSlider = document.getElementById("genderSlider");
  const menContent = document.getElementById("menContent");
  const womenContent = document.getElementById("womenContent");

  if (genderTabs.length && genderSlider) {
    const moveSlider = (tabEl) => {
      const nav = tabEl.closest(".gender-nav");
      const navRect = nav.getBoundingClientRect();
      const tabRect = tabEl.getBoundingClientRect();
      genderSlider.style.left = (tabRect.left - navRect.left + nav.scrollLeft) + "px";
      genderSlider.style.width = tabRect.width + "px";
    };

    const activeTab = document.querySelector(".gender-tab.active");
    if (activeTab) requestAnimationFrame(() => moveSlider(activeTab));

    const showContent = (gender) => {
      const isMan = gender === "men";
      const showEl = isMan ? menContent : womenContent;
      const hideEl = isMan ? womenContent : menContent;
      if (!showEl || !hideEl) return;
      hideEl.classList.remove("active-content", "fade-in");
      hideEl.style.display = "none";
      showEl.style.display = "block";
      showEl.classList.remove("fade-in");
      void showEl.offsetWidth;
      showEl.classList.add("active-content", "fade-in");
      triggerReveals();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    genderTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab.classList.contains("active")) return;
        genderTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const gender = tab.dataset.gender;
        localStorage.setItem("site-gender", gender);
        moveSlider(tab);
        showContent(gender);
      });
    });

    const savedGender = localStorage.getItem("site-gender");
    if (savedGender && savedGender !== "men") {
      const targetTab = document.querySelector(`.gender-tab[data-gender="${savedGender}"]`);
      if (targetTab) {
        genderTabs.forEach((t) => t.classList.remove("active"));
        targetTab.classList.add("active");
        requestAnimationFrame(() => moveSlider(targetTab));
        showContent(savedGender);
      }
    }

    window.addEventListener("resize", () => {
      const active = document.querySelector(".gender-tab.active");
      if (active) moveSlider(active);
    }, { passive: true });
  }
});
