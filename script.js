document.addEventListener("DOMContentLoaded", () => {

  // ✅ Enable animation mode
  document.documentElement.classList.add("js-enabled");

  /* ===============================
     SCROLL ANIMATION
  =============================== */
  const elements = document.querySelectorAll('.fade-in');

  if (elements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {

          const delay = entry.target.dataset.delay || 0;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    elements.forEach((el, index) => {
      el.dataset.delay = index * 120;
      observer.observe(el);
    });
  }

  /* ===============================
     EXPERIENCE CALCULATION
  =============================== */
  function calculateExperience() {
    const startDate = new Date("2022-08-01");
    const today = new Date();

    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    let text = [];

    if (years > 0) {
      text.push(`${years} yr${years > 1 ? "s" : ""}`);
    }

    if (months > 0) {
      text.push(`${months} mo${months > 1 ? "s" : ""}`);
    }

    if (text.length === 0) {
      text.push("Less than 1 month");
    }

    const el = document.getElementById("exp-duration");
    if (el) {
      el.textContent = `(${text.join(" ")})`;
    }
  }

  calculateExperience();

  /* ===============================
     MODAL (ABOUT POPUP)
  =============================== */
  const openBtn = document.getElementById("open-about");
  const modal = document.getElementById("about-modal");
  const closeBtn = document.querySelector(".close-btn");

  if (openBtn && modal && closeBtn) {

    openBtn.addEventListener("click", () => {
      modal.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  }

});
