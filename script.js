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

});
