/* ===== YEAR ===== */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===== MOBILE MENU ===== */
const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

/* ===== SMOOTH SCROLL + CLOSE MENU ===== */
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (siteNav && menuToggle) {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
const sections = document.querySelectorAll("main section[id]");
if (sections.length && navLinks.length) {
  const navObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === `#${id}`)
        );
      });
    },
    { rootMargin: "-40% 0px -45% 0px", threshold: 0.1 }
  );
  sections.forEach((s) => navObs.observe(s));
}

/* ===== CV LINK CHECK ===== */
const cvLink = document.getElementById("cv-link");
const cvNote = document.getElementById("cv-note");
if (cvLink && cvNote) {
  fetch("/cv.pdf", { method: "HEAD" })
    .then((r) => { if (!r.ok) throw new Error("cv missing"); })
    .catch(() => {
      cvNote.hidden = false;
      cvLink.classList.add("is-disabled");
      cvLink.setAttribute("aria-disabled", "true");
      cvLink.setAttribute("href", "#");
    });
}

/* ===== TYPING ANIMATION ===== */
const roles = ["Data Scientist", "ML Engineer", "Data Analyst", "Python Developer"];
const typedEl = document.getElementById("typed-role");
if (typedEl) {
  let ri = 0, ci = 0, deleting = false, delay = 120;
  function typeLoop() {
    const current = roles[ri];
    typedEl.textContent = deleting
      ? current.slice(0, ci--)
      : current.slice(0, ci++);
    if (!deleting && ci > current.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && ci < 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
      ci = 0;
      delay = 320;
    } else {
      delay = deleting ? 55 : 120;
    }
    setTimeout(typeLoop, delay);
  }
  typeLoop();
}

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll("[data-reveal]");
if (revealEls.length) {
  const revObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const d = Number(entry.target.dataset.delay) || 0;
        setTimeout(() => entry.target.classList.add("revealed"), d);
        revObs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revObs.observe(el));
}

/* ===== SKILL BAR ANIMATION ===== */
const bars = document.querySelectorAll(".bar-fill");
if (bars.length) {
  const barObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.width = (entry.target.dataset.width || 0) + "%";
        barObs.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );
  bars.forEach((b) => barObs.observe(b));
}

/* ===== PARTICLE CANVAS ===== */
const canvas = document.getElementById("particles-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.8 + 0.6,
  }));

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56,189,248,${(1 - dist / 120) * 0.12})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56,189,248,0.45)";
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(drawParticles);
  }

  drawParticles();
}
