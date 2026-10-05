/**
 * Theme Toggle Controller for TECH 3498 Portfolio
 * Sets Dark Mode as default with toggle to switch back to original light theme.
 * Persists user preference across all pages via localStorage.
 */

(function () {
  // Read saved theme or default to 'dark'
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  document.documentElement.setAttribute("data-bs-theme", savedTheme);

  // Apply saved color palette immediately in head
  function applyInitialPalette() {
    try {
      const raw = localStorage.getItem("siteCyberPalette");
      if (!raw) return;
      const palette = JSON.parse(raw);
      if (!palette || !palette.color) return;

      const { color, rgb } = palette;
      const cssRules = `
        :root {
          --primary-color: ${color} !important;
          --cyber-cyan: ${color} !important;
          --cyber-accent: ${color} !important;
          --bs-info: ${color} !important;
          --bs-info-rgb: ${rgb} !important;
          --bs-primary: ${color} !important;
          --bs-primary-rgb: ${rgb} !important;
          --border-color: rgba(${rgb}, 0.35) !important;
        }
        .text-info, a.text-info, i.text-info, span.text-info,
        .text-primary, a.text-primary, i.text-primary, span.text-primary {
          color: ${color} !important;
        }
        .navbar-brand span.text-info, .navbar-brand i.text-info {
          color: ${color} !important;
        }
        .btn-info, .btn-primary {
          background-color: ${color} !important;
          border-color: ${color} !important;
          color: #0b1120 !important;
        }
        .btn-outline-info, .btn-outline-primary {
          color: ${color} !important;
          border-color: ${color} !important;
        }
        .btn-outline-info:hover, .btn-outline-primary:hover {
          background-color: ${color} !important;
          border-color: ${color} !important;
          color: #0b1120 !important;
        }
        .badge.bg-info, .badge.bg-primary, .badge.bg-info-subtle, .badge.bg-primary-subtle {
          background-color: ${color} !important;
          color: #0b1120 !important;
        }
        .icon-box.bg-info, .icon-box.bg-primary {
          background-color: rgba(${rgb}, 0.15) !important;
          color: ${color} !important;
        }
        .border-info, .border-primary, .border-info-subtle, .border-primary-subtle {
          border-color: ${color} !important;
        }
        .feature-card:hover, .profile-card:hover, .sec-console-card:hover, .project-spotlight-card, .triad-card {
          border-color: ${color} !important;
        }
        .avatar-wrapper {
          background: linear-gradient(135deg, ${color}, rgba(${rgb}, 0.6)) !important;
          box-shadow: 0 0 25px rgba(${rgb}, 0.45) !important;
        }
        .avatar-wrapper .avatar-inner {
          color: ${color} !important;
        }
        .section-title::after {
          background: ${color} !important;
        }
        #chatbot-toggle, .chat-mic-btn {
          color: ${color} !important;
          border-color: rgba(${rgb}, 0.5) !important;
        }
        .chat-bubble.bot-bubble {
          border-left: 3px solid ${color} !important;
        }
        .chat-send-btn:hover {
          background-color: ${color} !important;
          color: #0b1120 !important;
        }
      `;

      let styleTag = document.getElementById("cyber-palette-override");
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "cyber-palette-override";
        const container = document.head || document.documentElement;
        container.appendChild(styleTag);
      }
      styleTag.textContent = cssRules;
    } catch (e) {
      console.warn("Palette loader error:", e);
    }
  }

  applyInitialPalette();

  function updateToggleButtons() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const buttons = document.querySelectorAll(".theme-toggle-btn");
    buttons.forEach((btn) => {
      if (currentTheme === "dark") {
        btn.innerHTML = '<i class="bi bi-sun-fill text-warning me-1"></i> <span class="theme-label">Light Theme</span>';
        btn.setAttribute("title", "Switch to Original Light Theme");
        btn.setAttribute("aria-label", "Switch to Original Light Theme");
        btn.classList.remove("btn-outline-info");
        btn.classList.add("btn-outline-warning");
      } else {
        btn.innerHTML = '<i class="bi bi-moon-stars-fill text-info me-1"></i> <span class="theme-label">Dark Mode</span>';
        btn.setAttribute("title", "Switch to Dark Mode");
        btn.setAttribute("aria-label", "Switch to Dark Mode");
        btn.classList.remove("btn-outline-warning");
        btn.classList.add("btn-outline-info");
      }
    });
  }

  // Update on DOM ready
  document.addEventListener("DOMContentLoaded", function () {
    updateToggleButtons();

    document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const current = document.documentElement.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", next);
        document.documentElement.setAttribute("data-bs-theme", next);
        localStorage.setItem("theme", next);

        updateToggleButtons();
      });
    });
  });
})();
