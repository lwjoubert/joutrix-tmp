// Reveal-on-scroll (tiny, no libraries)
document.documentElement.classList.add("js");

const reveals = document.querySelectorAll(".reveal");

// Fallback for older browsers / unusual environments
if (!("IntersectionObserver" in window)) {
  reveals.forEach((el) => el.classList.add("on"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          io.unobserve(e.target); // reveal once, then stop observing (perf)
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => io.observe(el));
}
