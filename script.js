document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.querySelector(".theme-icon");
  const header = document.querySelector(".header");
  const glow = document.querySelector(".cursor-glow");
  const backToTop = document.querySelector(".back-to-top");
  const reveals = document.querySelectorAll(".reveal");
  const cards = document.querySelectorAll(".box1");

  const savedTheme = localStorage.getItem("site-theme");

  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    if (themeIcon) themeIcon.textContent = "☀️";
  } else {
    if (themeIcon) themeIcon.textContent = "🌙";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");

      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("site-theme", "dark");
        if (themeIcon) themeIcon.textContent = "☀️";
      } else {
        localStorage.setItem("site-theme", "light");
        if (themeIcon) themeIcon.textContent = "🌙";
      }
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
        rootMargin: "0px 0px -60px 0px"
      }
    );

    reveals.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    reveals.forEach((item) => item.classList.add("active"));
  }

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 768) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }

      if (header) {
        if (window.scrollY > 60) {
          header.style.backdropFilter = "blur(22px)";
          header.style.webkitBackdropFilter = "blur(22px)";
          header.style.background = body.classList.contains("dark-mode")
            ? "rgba(17,20,27,0.88)"
            : "rgba(248,248,251,0.85)";
        } else {
          header.style.backdropFilter = "blur(16px)";
          header.style.webkitBackdropFilter = "blur(16px)";
          header.style.background = body.classList.contains("dark-mode")
            ? "rgba(17,20,27,0.72)"
            : "rgba(248,248,251,0.72)";
        }
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  const contactBtn = document.querySelector(".contact-btn");

  if (contactBtn) {
    contactBtn.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 768) return;

      const rect = contactBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      contactBtn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    contactBtn.addEventListener("mouseleave", () => {
      contactBtn.style.transform = "translate(0px, 0px)";
    });
  }

  if (glow) {
    window.addEventListener("mousemove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
  }
});