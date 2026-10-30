(() => {
  const toggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const storageKey = "portfolio-theme";

  // Apply the selected theme
  function applyTheme(theme) {
    const isDark = theme === "dark";

    root.setAttribute("data-theme", isDark ? "dark" : "light");

    // Update the icon
    if (toggle) {
      const icon = toggle.querySelector("i");

      if (icon) {
        icon.classList.toggle("fa-moon", !isDark);
        icon.classList.toggle("fa-sun", isDark);
      }

      // Update accessibility labels
      const label = isDark ? "Switch to light mode" : "Switch to dark mode";

      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
    }
  }

  // Load the saved theme
  let savedTheme = "light";

  try {
    savedTheme = localStorage.getItem(storageKey) || "light";
  } catch (error) {
    // Continue using the default theme if storage is unavailable
  }

  applyTheme(savedTheme);

  // Toggle between light and dark themes
  if (toggle) {
    toggle.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      applyTheme(nextTheme);

      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch (error) {
        // Theme still works even if it cannot be saved
      }
    });
  }
})();
