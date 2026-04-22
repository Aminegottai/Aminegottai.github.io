const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") {
      return;
    }

    const targetEl = document.querySelector(targetId);
    if (!targetEl) {
      return;
    }

    event.preventDefault();
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });

    if (siteNav && menuToggle) {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

const sections = document.querySelectorAll("main section[id]");
if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -45% 0px", threshold: 0.1 }
  );

  sections.forEach((section) => observer.observe(section));
}

const cvLink = document.getElementById("cv-link");
const cvNote = document.getElementById("cv-note");
if (cvLink && cvNote) {
  fetch("/cv.pdf", { method: "HEAD" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("cv missing");
      }
    })
    .catch(() => {
      cvNote.hidden = false;
      cvLink.classList.add("is-disabled");
      cvLink.setAttribute("aria-disabled", "true");
      cvLink.setAttribute("href", "#");
    });
}
