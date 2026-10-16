(() => {
  const root = document.documentElement;
  /*const menuButton = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");*/
  const menuToggle = document.getElementById("menuToggle");

  const navLinks = document.getElementById("navLinks");

  const navItems = document.querySelectorAll(".nav-links a");

  const progressBar = document.getElementById("progressBar");
  const toast = document.getElementById("toast");

  /*menuButton?.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(opened));
    menuButton.setAttribute("aria-label", opened ? "Close navigation" : "Open navigation");
    menuButton.textContent = opened ? "×" : "☰";
  });*/

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

  document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();

    const articleLinks = document.querySelectorAll(".dropdown-menu a");

    articleLinks.forEach((link) => {
      const linkPage = new URL(link.href, window.location.href).pathname
        .split("/")
        .pop();

      if (linkPage === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
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

  document
    .querySelectorAll("[data-year]")
    .forEach((el) => (el.textContent = new Date().getFullYear()));

  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  document.querySelector("[data-copy]")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Article link copied!");
    } catch (_) {
      showToast("Copy the page URL from your browser address bar.");
    }
  });

  document
    .querySelector("[data-share]")
    ?.addEventListener("click", async () => {
      const shareData = {
        title: document.title,
        text: "Thought you might enjoy this article.",
        url: window.location.href,
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (_) {}
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast("Link copied — share it anywhere.");
        } catch (_) {
          showToast("Copy the page URL from your browser address bar.");
        }
      }
    });

  // Smooth-scroll for in-page section links, with reduced-motion support from CSS.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      nav?.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
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
