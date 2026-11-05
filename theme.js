/**
 * Theme Toggle Controller for the TECH 3498 portfolio.
 * Defaults to dark mode and stores the preference in localStorage.
 *
 * Color palette overrides are handled by auth.js.
 */

(function () {
  "use strict";

  const THEME_STORAGE_KEY = "theme";
  const VALID_THEMES = new Set(["dark", "light"]);

  function readSavedTheme() {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return VALID_THEMES.has(savedTheme) ? savedTheme : "dark";
    } catch (error) {
      console.warn("Could not read the saved theme preference.", error);
      return "dark";
    }
  }

  function applyTheme(theme, persist = false) {
    const validTheme = VALID_THEMES.has(theme) ? theme : "dark";

    document.documentElement.setAttribute("data-theme", validTheme);
    document.documentElement.setAttribute("data-bs-theme", validTheme);
    updateToggleButtons(validTheme);

    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, validTheme);
      } catch (error) {
        console.warn("Could not save the theme preference.", error);
      }
    }
  }
window.setSiteTheme = theme => applyTheme(theme, true);

  function updateToggleButtons(theme) {
    document.querySelectorAll(".theme-toggle-btn").forEach(button => {
      const isDark = theme === "dark";

      button.innerHTML = isDark
        ? '<i class="bi bi-sun-fill text-warning me-1" aria-hidden="true"></i> <span class="theme-label">Light Theme</span>'
        : '<i class="bi bi-moon-stars-fill text-info me-1" aria-hidden="true"></i> <span class="theme-label">Dark Mode</span>';

      button.title = isDark
        ? "Switch to Light Theme"
        : "Switch to Dark Theme";

      button.setAttribute("aria-label", button.title);
      button.setAttribute("aria-pressed", String(!isDark));

      button.classList.toggle("btn-outline-warning", isDark);
      button.classList.toggle("btn-outline-info", !isDark);
    });
  }

  // Set the theme in the document head to reduce theme flicker on page load.
  applyTheme(readSavedTheme());

  document.addEventListener("DOMContentLoaded", () => {
    updateToggleButtons(
      document.documentElement.getAttribute("data-theme") || "dark"
    );
    document.querySelectorAll(".restore-appearance-btn").forEach(button => {
      button.addEventListener("click", () => {
        try {
          localStorage.removeItem("siteAppearancePrefs");
          localStorage.removeItem("siteCyberPalette");
        } catch (error) {
          console.warn("Could not clear saved appearance settings.", error);
        }
    
        // Restore the portfolio's default dark theme and clear appearance overrides.
        applyTheme("dark", true);
        ["--bg-main", "--bg-section-alt", "--bg-card", "--bg-subtle"]
          .forEach(name => document.documentElement.style.removeProperty(name));
    
        document.documentElement.style.fontSize = "";
        document.body.style.backgroundImage = "";
        document.getElementById("chatbot-appearance-overrides")?.remove();
        document.getElementById("cyber-palette-override")?.remove();
      });
    });
    
    document.querySelectorAll(".theme-toggle-btn").forEach(button => {
      button.addEventListener("click", () => {
        const currentTheme =
          document.documentElement.getAttribute("data-theme") || "dark";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        applyTheme(nextTheme, true);
      });
    });
  });

  // Keep other open tabs in sync when the saved theme changes.
  window.addEventListener("storage", event => {
    if (event.key === THEME_STORAGE_KEY) {
      applyTheme(event.newValue || "dark");
    }
  });
})();
