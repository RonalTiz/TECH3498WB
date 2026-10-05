/**
 * Authentication & Theme Palette Controller for TECH 3498 Portfolio
 * Manages admin authentication state, navigation visibility, and
 * executes live theme color palette modifications across all webpages.
 */

(function () {
  // Apply saved color palette dynamically
  function applyColorPalette(paletteData) {
    let palette = paletteData;
    if (!palette) {
      const raw = localStorage.getItem("siteCyberPalette");
      if (raw) {
        try {
          palette = JSON.parse(raw);
          console.log("Palette loaded from localStorage:", palette);
        } catch (e) {
          console.error("Error parsing palette JSON:", e);
          palette = null;
        }
      } else {
        console.warn("No palette data found in localStorage.");
      }
    }

    let styleTag = document.getElementById("cyber-palette-override");
    if (!palette || !palette.color) {
      if (styleTag) {
        styleTag.remove();
        console.log("Removed existing style tag due to missing palette.");
      }
      return;
    }

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

    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "cyber-palette-override";
      const container = document.head || document.documentElement;
      container.appendChild(styleTag);
      console.log("Created new style tag for palette override.");
    }
    styleTag.textContent = cssRules;
    console.log("Applied color palette:", palette);
  }

  // Sync Navbar Authentication & Security link
  function syncNavbarAuthState() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const authUser = sessionStorage.getItem("authUser") || "admin";
    console.log("Authentication state:", isLoggedIn ? "Logged in as " + authUser : "Not logged in");

// 1. Sync Navbar Auth Link
const loginLinks = document.querySelectorAll(".nav-login-link");
loginLinks.forEach((link) => {
  link.replaceChildren();

  const icon = document.createElement("i");

  if (isLoggedIn) {
    icon.className = "bi bi-person-check-fill text-success me-1";
    icon.setAttribute("aria-hidden", "true");
    link.append(icon, document.createTextNode(`Dashboard (${authUser})`));
    link.classList.add("text-info");
    link.setAttribute("title", "Admin Dashboard & Session");
  } else {
    icon.className = "bi bi-box-arrow-in-right me-1";
    icon.setAttribute("aria-hidden", "true");
    link.append(icon, document.createTextNode("Login"));
    link.classList.remove("text-info");
    link.setAttribute("title", "Log in to Admin Portal");
  }
});


    // 2. Synchronize "Security Control" Link in Navbar across all pages
    const navbars = document.querySelectorAll(".navbar-nav");
    navbars.forEach((nav) => {
      let secItem = nav.querySelector(".nav-security-item");
      if (isLoggedIn) {
        if (!secItem) {
          secItem = document.createElement("li");
          secItem.className = "nav-item nav-security-item";
          const currentPage = window.location.pathname.split("/").pop() || "index.html";
          const isActive = currentPage === "security.html" ? "active" : "";
          secItem.innerHTML = `
            <a class="nav-link text-warning fw-semibold ${isActive}" href="security.html" title="Administrative Security & Control Room">
              <i class="bi bi-shield-shaded me-1 text-warning"></i>Security Control
            </a>
          `;
          const contactLink = nav.querySelector('a[href*="#contact"]');
          if (contactLink && contactLink.closest("li")) {
            nav.insertBefore(secItem, contactLink.closest("li"));
          } else {
            nav.appendChild(secItem);
          }
          console.log("Added Security Control link to navbar.");
        } else {
          secItem.classList.remove("d-none");
          console.log("Displayed existing Security Control link.");
        }
      } else {
        if (secItem) {
          secItem.classList.add("d-none");
          console.log("Hid Security Control link for unauthenticated user.");
        }
      }
    });

    // Re-apply palette to ensure any dynamic elements pick it up
    applyColorPalette();
  }

  // Run immediately for instant palette rendering
  applyColorPalette();

  // Expose global methods
  window.applyColorPalette = applyColorPalette;
  window.syncNavbarAuthState = syncNavbarAuthState;

  document.addEventListener("DOMContentLoaded", syncNavbarAuthState);
  window.addEventListener("storage", function (e) {
    if (e.key === "siteCyberPalette") {
      console.log("Detected change in siteCyberPalette, reapplying palette.");
      applyColorPalette();
    }
  });
})();
