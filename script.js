(() => {
  const menuToggle = document.getElementById("menuToggle");

  const navLinks = document.getElementById("navLinks");

  const navItems = document.querySelectorAll(".nav-links a");

  const blogDropdown = document.getElementById("blogNavDropdown");
  const blogDropdownTrigger = blogDropdown?.querySelector(
    ".nav-dropdown-trigger",
  );

  const progressBar = document.getElementById("progressBar");

  /* =========================================
   MOBILE MENU
========================================= */

  const setMenuOpen = (isOpen) => {
    navLinks.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
    const icon = menuToggle.querySelector("i");
    icon.classList.toggle("fa-xmark", isOpen);
    icon.classList.toggle("fa-bars", !isOpen);
  };

  menuToggle.setAttribute("aria-controls", "navLinks");
  setMenuOpen(false);
  menuToggle.addEventListener("click", () => {
    setMenuOpen(!navLinks.classList.contains("open"));
  });

  /* Close menu after clicking */

  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  blogDropdownTrigger?.addEventListener("click", (event) => {
    if (window.innerWidth <= 900) {
      event.preventDefault();
      const isOpen = blogDropdown.classList.toggle("open");
      blogDropdownTrigger.setAttribute("aria-expanded", String(isOpen));
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMenuOpen(false);
  });

  /* =========================================
   ACTIVE NAVIGATION
========================================= */

  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;

      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop - sectionHeight * 0.25) {
        currentSection = section.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });

  const updateProgress = () => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progressBar)
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* =========================================
   DARK / LIGHT MODE
========================================= 

const applyTheme = theme => {
    const isLight = theme === "light";
    document.body.classList.toggle("light-mode", isLight);
    themeToggle.textContent = isLight ? "☾" : "☀";
    themeToggle.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} theme`);
    themeToggle.title = `Switch to ${isLight ? "dark" : "light"} theme`;
};

const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme === "light" ? "light" : "dark");

themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
});


/* =========================================
   SCROLL PROGRESS
========================================= 

window.addEventListener("scroll", () => {

    const scrollTop =
        window.scrollY;

    const pageHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress =
        (scrollTop / pageHeight) * 100;

    scrollProgress.style.width =
        `${progress}%`;

});

const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();


/* =========================================
   SCROLL REVEAL
========================================= */

  const revealElements = document.querySelectorAll(
    ".section-heading, .about-card, .skill-box, .project-card, .timeline-item, .blog-card, .contact-button",
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
})();
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.querySelector(".nav-dropdown");

  if (!dropdown) return;

  const trigger = dropdown.querySelector(".nav-dropdown-trigger");
  const menu = dropdown.querySelector(".nav-dropdown-menu");
  const articleLinks = menu.querySelectorAll("a");
  const navLinks = document.querySelectorAll(
    ".nav-links > a:not(.nav-dropdown-trigger), " +
      ".nav-links > .nav-dropdown:not(:first-child) > a",
  );

  if (!trigger || !menu) return;

  // Set the initial accessibility state.
  trigger.setAttribute("aria-haspopup", "true");
  trigger.setAttribute("aria-expanded", "false");

  function closeDropdown() {
    dropdown.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  }

  function openDropdown() {
    dropdown.classList.add("open");
    trigger.setAttribute("aria-expanded", "true");
  }

  // Clicking Blog toggles the dropdown.
  trigger.addEventListener("click", (event) => {
    event.preventDefault();

    if (dropdown.classList.contains("open")) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  // Identify the current article, including on direct visits
  // and page refreshes.
  const currentPage = window.location.pathname.split("/").pop();

  articleLinks.forEach((link) => {
    const linkPage = new URL(link.href, window.location.href).pathname
      .split("/")
      .pop();

    const isCurrentArticle = linkPage === currentPage && currentPage !== "";

    link.classList.toggle("active", isCurrentArticle);

    if (isCurrentArticle) {
      link.setAttribute("aria-current", "page");
      trigger.classList.add("active");
    } else {
      link.removeAttribute("aria-current");
    }

    // Close the menu when an article is selected.
    // The next page load will highlight the selected article.
    link.addEventListener("click", () => {
      closeDropdown();
    });
  });

  // Close the dropdown when another navigation link is clicked.
  navLinks.forEach((link) => {
    link.addEventListener("click", closeDropdown);
  });

  // Close on Escape for keyboard accessibility.
  dropdown.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdown();
      trigger.focus();
    }
  });

  // Close when clicking outside the dropdown.
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      closeDropdown();
    }
  });
});
