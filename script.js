document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const pageLoader = document.getElementById("pageLoader");
  const themeToggle = document.getElementById("themeToggle");
  const header = document.querySelector(".header");
  const glow = document.querySelector(".cursor-glow");
  const backToTop = document.querySelector(".back-to-top");
  const reveals = document.querySelectorAll(".reveal");
  const cards = document.querySelectorAll(".box1");
  const contactBtn = document.querySelector(".contact-btn");
  const boxes = document.querySelectorAll(".box");

  body.classList.add("loading");

  function updateHeaderStyle() {
    if (!header) return;

    if (window.scrollY > 10) {
      header.style.backdropFilter = "blur(14px)";
      header.style.webkitBackdropFilter = "blur(14px)";
      header.style.background = body.classList.contains("dark-mode")
        ? "rgba(17,20,27,0.88)"
        : "rgba(248,248,251,0.88)";
    } else {
      header.style.backdropFilter = "blur(10px)";
      header.style.webkitBackdropFilter = "blur(10px)";
      header.style.background = body.classList.contains("dark-mode")
        ? "rgba(17,20,27,0.72)"
        : "rgba(248,248,251,0.72)";
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

      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("site-theme", "dark");
      } else {
        localStorage.setItem("site-theme", "light");
      }

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
        rootMargin: "0px 0px -40px 0px"
      }
    );

    reveals.forEach((item) => revealObserver.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add("active"));
  }

  // Card tilt: lighter + optimized
  cards.forEach((card) => {
    let rafId = null;

    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 900) return;
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -2.2;
        const rotateY = ((x - centerX) / centerX) * 2.2;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        rafId = null;
      });
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // Important: horizontal sections should not "eat" vertical wheel
  boxes.forEach((box) => {
    box.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          return;
        }
      },
      { passive: true }
    );
  });

  window.addEventListener(
    "scroll",
    () => {
      if (backToTop) {
        if (window.scrollY > 200) {
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

  if (contactBtn) {
    let btnRaf = null;

    contactBtn.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 900) return;
      if (btnRaf) return;

      btnRaf = requestAnimationFrame(() => {
        const rect = contactBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        contactBtn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
        btnRaf = null;
      });
    });

    contactBtn.addEventListener("mouseleave", () => {
      contactBtn.style.transform = "translate(0px, 0px)";
    });
  }

  // Cursor glow: lighter and desktop only
  let glowRaf = null;
  window.addEventListener(
    "mousemove",
    (e) => {
      if (!glow || window.innerWidth <= 900) return;
      if (glowRaf) return;

      glowRaf = requestAnimationFrame(() => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
        glowRaf = null;
      });
    },
    { passive: true }
  );

  if (document.readyState === "complete") {
    setTimeout(hideLoader, 180);
  } else {
    window.addEventListener("load", () => {
      setTimeout(hideLoader, 180);
    });
  }
});