(() => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const blogDropdown = document.getElementById("blogNavDropdown");
  const blogDropdownTrigger = blogDropdown?.querySelector(
    ".nav-dropdown-trigger",
  );
  const progressBar = document.getElementById("progressBar");

  if (!menuToggle || !navLinks) return;

  const navItems = navLinks.querySelectorAll("a");
  const sectionLinks = navLinks.querySelectorAll('a[href^="#"]');
  const sections = document.querySelectorAll("section[id]");

  const setDropdownOpen = (isOpen) => {
    if (!blogDropdown || !blogDropdownTrigger) return;
    blogDropdown.classList.toggle("open", isOpen);
    blogDropdownTrigger.setAttribute("aria-expanded", String(isOpen));
  };

  const setMenuOpen = (isOpen) => {
    navLinks.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );

    const icon = menuToggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-xmark", isOpen);
      icon.classList.toggle("fa-bars", !isOpen);
    }

    if (!isOpen) setDropdownOpen(false);
  };

  menuToggle.setAttribute("aria-controls", "navLinks");
  setMenuOpen(false);

  menuToggle.addEventListener("click", () => {
    setMenuOpen(!navLinks.classList.contains("open"));
  });

  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (
        link === blogDropdownTrigger &&
        window.matchMedia("(max-width: 900px)").matches
      ) {
        return;
      }
      setMenuOpen(false);
    });
  });

  blogDropdownTrigger?.addEventListener("click", (event) => {
    if (window.matchMedia("(max-width: 900px)").matches) {
      event.preventDefault();
      setDropdownOpen(!blogDropdown.classList.contains("open"));
    }
  });

  blogDropdown?.addEventListener("mouseenter", () => {
    if (window.matchMedia("(min-width: 901px)").matches) {
      setDropdownOpen(true);
    }
  });

  blogDropdown?.addEventListener("mouseleave", () => {
    if (
      window.matchMedia("(min-width: 901px)").matches &&
      !blogDropdown.contains(document.activeElement)
    ) {
      setDropdownOpen(false);
    }
  });

  blogDropdown?.addEventListener("focusin", () => setDropdownOpen(true));
  blogDropdown?.addEventListener("focusout", (event) => {
    if (!blogDropdown.contains(event.relatedTarget)) setDropdownOpen(false);
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
    if (event.key !== "Escape") return;

    if (blogDropdown?.classList.contains("open")) {
      setDropdownOpen(false);
      blogDropdownTrigger?.focus();
    } else {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMenuOpen(false);
  });

  const updateActiveNav = () => {
    let currentSection = "";
    const threshold = window.scrollY + 110;

    sections.forEach((section) => {
      if (threshold >= section.offsetTop) {
        currentSection = section.id;
      }
    });

    sectionLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentSection}`,
      );
    });
  };

  const updateProgress = () => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  };

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateActiveNav();
  updateProgress();
})();
