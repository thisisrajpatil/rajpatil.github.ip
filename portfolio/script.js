(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const yearEl = document.getElementById("year");
  const typewriterEl = document.getElementById("typewriter");
  const copyEmailBtn = document.getElementById("copyEmail");

  // ----- Year -----
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ----- Theme persistence -----
  const storageKey = "portfolio-theme";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem(storageKey);
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initialTheme);

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(storageKey, next);
  });

  // ----- Smooth scroll -----
  const internalLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  internalLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  });

  // ----- Active link via IntersectionObserver -----
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
  const sectionIds = navLinks.map((a) => a.getAttribute("href"))
    .filter(Boolean)
    .map((href) => href?.slice(1));
  const sections = sectionIds
    .map((id) => (id ? document.getElementById(id) : null))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        const link = navLinks.find((a) => a.getAttribute("href") === `#${id}`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: [0, 1] });

    sections.forEach((s) => obs.observe(s));
  }

  // ----- Typewriter rotating roles -----
  const roles = [
    "building human‑centric products",
    "designing with motion & systems",
    "shipping fast, accessible UI",
    "sweating the micro‑interactions",
  ];
  let roleIdx = 0;
  let typing = true;
  let charIdx = 0;
  const baseDelay = 60;

  function step() {
    if (!typewriterEl) return;
    const current = roles[roleIdx % roles.length];
    if (typing) {
      charIdx++;
      typewriterEl.textContent = current.slice(0, charIdx);
      if (charIdx >= current.length) {
        typing = false;
        setTimeout(step, 1400);
        return;
      }
      setTimeout(step, baseDelay + Math.random() * 60);
      return;
    } else {
      charIdx--;
      typewriterEl.textContent = current.slice(0, Math.max(charIdx, 0));
      if (charIdx <= 0) {
        typing = true;
        roleIdx++;
        setTimeout(step, 400);
        return;
      }
      setTimeout(step, 28 + Math.random() * 40);
      return;
    }
  }
  step();

  // ----- Copy email -----
  copyEmailBtn?.addEventListener("click", () => {
    const email = copyEmailBtn.getAttribute("data-email");
    if (!email) return;
    navigator.clipboard?.writeText(email).then(() => {
      copyEmailBtn.textContent = "Copied!";
      setTimeout(() => (copyEmailBtn.textContent = "Copy email"), 1000);
    });
  });
})();