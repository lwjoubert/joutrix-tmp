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

// Home jump-link active state (only runs if jump links exist)
const jump = document.querySelector(".jump");
if (jump && "IntersectionObserver" in window) {
  const links = Array.from(jump.querySelectorAll("a[href^='#']"));
  const map = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));

  const sections = Array.from(document.querySelectorAll("section[id]"))
    .filter(s => map.has(s.id));

  const setActive = (id) => {
    links.forEach(a => a.classList.remove("is-active"));
    const el = map.get(id);
    if (el) el.classList.add("is-active");
  };

  const io2 = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(visible.target.id);
  }, { threshold: [0.2, 0.35, 0.5] });

  sections.forEach(s => io2.observe(s));
}
