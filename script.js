document.addEventListener("DOMContentLoaded", () => {

  // ✅ IMPORTANT: enables animation mode from CSS
  document.documentElement.classList.add("js-enabled");

  const elements = document.querySelectorAll('.fade-in');

  if (!elements.length) return;

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

   function calculateExperience() {
    const startDate = new Date("2022-08-01");
    const today = new Date();

    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    let text = "";

    if (years > 0) {
      text += `${years} yr${years > 1 ? "s" : ""} `;
    }

    if (months > 0) {
      text += `${months} mo${months > 1 ? "s" : ""}`;
    }

    const el = document.getElementById("exp-duration");
    if (el) {
      el.textContent = `(${text.trim()})`;
    }
  }

  calculateExperience();

  const openBtn = document.getElementById("open-about");
const modal = document.getElementById("about-modal");
const closeBtn = document.querySelector(".close-btn");

if (openBtn && modal) {
  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });
}

if (closeBtn && modal) {
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });
}

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

});
