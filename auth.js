/**
 * TECH 3498 portfolio navbar and color-palette controller.
 *
 * Supabase provides the signed-in user and admin-role check. Hiding links in
 * the navbar is only presentation; protected actions must still verify access
 * server-side or through database policies.
 */

(function () {
  "use strict";

  const PALETTE_STORAGE_KEY = "siteCyberPalette";
  let supabaseClient = null;

  function getValidPalette(input) {
    let palette = input;

    if (!palette) {
      try {
        palette = JSON.parse(
          localStorage.getItem(PALETTE_STORAGE_KEY) || "null"
        );
      } catch (error) {
        console.warn("Could not read saved color palette.", error);
        return null;
      }
    }

    if (!palette || typeof palette.color !== "string") return null;

    // Accept only six-digit hex values before inserting a color into CSS.
    const match = palette.color.match(/^#?([0-9a-f]{6})$/i);
    if (!match) return null;

    const hex = match[1];
    return {
      color: `#${hex.toLowerCase()}`,
      rgb: [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16)
      ].join(", ")
    };
  }

  function applyColorPalette(paletteData) {
    const palette = getValidPalette(paletteData);
    let styleTag = document.getElementById("cyber-palette-override");

    if (!palette) {
      if (styleTag) styleTag.remove();
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

      .text-info, .text-primary,
      a.text-info, a.text-primary,
      i.text-info, i.text-primary,
      span.text-info, span.text-primary {
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

      .badge.bg-info, .badge.bg-primary,
      .badge.bg-info-subtle, .badge.bg-primary-subtle {
        background-color: ${color} !important;
        color: #0b1120 !important;
      }

      .icon-box.bg-info, .icon-box.bg-primary {
        background-color: rgba(${rgb}, 0.15) !important;
        color: ${color} !important;
      }

      .border-info, .border-primary,
      .border-info-subtle, .border-primary-subtle {
        border-color: ${color} !important;
      }

      .feature-card:hover, .profile-card:hover,
      .sec-console-card:hover, .project-spotlight-card,
      .triad-card {
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
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = cssRules;
  }

  function setLinkContents(link, iconClass, label) {
    const icon = document.createElement("i");
    icon.className = `${iconClass} me-1`;
    icon.setAttribute("aria-hidden", "true");
    link.replaceChildren(icon, document.createTextNode(label));
  }

  function ensureRoleLink(nav, className, href, iconClass, label) {
    let item = nav.querySelector(`.${className}`);

    if (!item) {
      item = document.createElement("li");
      item.className = `nav-item ${className}`;

      const link = document.createElement("a");
      link.className = "nav-link";
      link.href = href;

      const icon = document.createElement("i");
      icon.className = `${iconClass} me-1`;
      icon.setAttribute("aria-hidden", "true");

      link.append(icon, document.createTextNode(label));
      item.appendChild(link);

      const contactItem = nav.querySelector('a[href*="#contact"]')?.closest("li");
      nav.insertBefore(item, contactItem || null);
    } else {
      item.classList.remove("d-none");
    }

    return item;
  }

  function hideRoleLinks(nav) {
    nav.querySelector(".nav-security-item")?.classList.add("d-none");
    nav.querySelector(".nav-user-item")?.classList.add("d-none");
  }

  async function syncNavbarAuthState() {
    const links = document.querySelectorAll(".nav-login-link");
    if (!links.length) return;

    // Fail closed in the navbar if Supabase is unavailable.
    if (!supabaseClient) {
      links.forEach(link => {
        link.href = "login.html";
        setLinkContents(link, "bi bi-box-arrow-in-right", "Login");
        link.classList.remove("text-info");
        link.title = "Sign in";
      });

      document.querySelectorAll(".navbar-nav").forEach(hideRoleLinks);
      return;
    }

    try {
      const { data, error } = await supabaseClient.auth.getUser();
      if (error) throw error;

      const user = data.user;

      if (!user) {
        links.forEach(link => {
          link.href = "login.html";
          setLinkContents(link, "bi bi-box-arrow-in-right", "Login");
          link.classList.remove("text-info");
          link.title = "Sign in";
        });

        document.querySelectorAll(".navbar-nav").forEach(hideRoleLinks);
        return;
      }

      let isAdmin = false;

      try {
        const { data: adminResult, error: roleError } =
          await supabaseClient.rpc("is_current_user_admin");

        if (roleError) throw roleError;
        isAdmin = adminResult === true;
      } catch (error) {
        // Treat role lookup failures as non-admin for display purposes.
        console.warn("Could not verify administrator role.", error);
      }

      links.forEach(link => {
        if (isAdmin) {
          link.href = "security.html";
          setLinkContents(
            link,
            "bi bi-person-check-fill text-success",
            "Admin Console"
          );
          link.title = "Open the admin console";
        } else {
          link.href = "user.html";
          setLinkContents(link, "bi bi-person-circle", "My Profile");
          link.title = "Open your profile";
        }

        link.classList.add("text-info");
      });

      document.querySelectorAll(".navbar-nav").forEach(nav => {
        if (isAdmin) {
          const item = ensureRoleLink(
            nav,
            "nav-security-item",
            "security.html",
            "bi bi-shield-shaded text-warning",
            "Security Control"
          );
          item.querySelector("a").classList.add("text-warning", "fw-semibold");
          nav.querySelector(".nav-user-item")?.classList.add("d-none");
        } else {
          nav.querySelector(".nav-security-item")?.classList.add("d-none");
          ensureRoleLink(
            nav,
            "nav-user-item",
            "user.html",
            "bi bi-person-circle",
            "My Profile"
          );
        }
      });
    } catch (error) {
      console.error("Could not sync Supabase navbar state.", error);
      document.querySelectorAll(".navbar-nav").forEach(hideRoleLinks);
    }
  }

  // Apply saved palette early.
  applyColorPalette();

  window.applyColorPalette = applyColorPalette;
  window.syncNavbarAuthState = syncNavbarAuthState;

  async function initializeSupabaseNavbar() {
    try {
      // auth.js is a classic script, so load the ES module dynamically.
      const module = await import("./supabase-client.js");
      supabaseClient = module.supabase;

      await syncNavbarAuthState();

      // Refresh navbar after sign-in or sign-out. Defer work out of the
      // Supabase callback to avoid doing additional auth calls inside it.
      supabaseClient.auth.onAuthStateChange(() => {
        setTimeout(() => {
          syncNavbarAuthState();
        }, 0);
      });
    } catch (error) {
      console.error("Could not initialize Supabase navbar state.", error);
      await syncNavbarAuthState();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSupabaseNavbar, {
      once: true
    });
  } else {
    initializeSupabaseNavbar();
  }

  window.addEventListener("storage", event => {
    if (event.key === PALETTE_STORAGE_KEY) {
      applyColorPalette();
    }
  });
})();
