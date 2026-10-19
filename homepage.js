/* ==========================================================================
   Squared — homepage (Phase 1 preview)
   Progressive enhancement only: the page is fully usable without JS.

   Controls:
   1. Mobile navigation drawer
   2. "More" dropdown in the primary nav
   3. Pricing region selector (Nigeria / International)
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * 1. Mobile navigation drawer
   * ------------------------------------------------------------------ */
  var navToggle = document.getElementById("navToggle");
  var navDrawer = document.getElementById("navDrawer");
  var header = document.querySelector(".site-header");

  function setDrawer(open) {
    if (!navToggle || !navDrawer) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navDrawer.hidden = !open;
  }

  if (navToggle && navDrawer) {
    navToggle.addEventListener("click", function () {
      setDrawer(navToggle.getAttribute("aria-expanded") !== "true");
    });

    // Close when a link inside the drawer is followed.
    navDrawer.addEventListener("click", function (event) {
      if (event.target.closest("a")) setDrawer(false);
    });

    // Reset the drawer when the layout switches to the desktop nav.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1180) setDrawer(false);
    });
  }

  /* ------------------------------------------------------------------ *
   * 1b. Drawer "More" disclosure
   *
   * Ships expanded, matching the approved menu-open frame.
   * ------------------------------------------------------------------ */
  var drawerMore = document.getElementById("drawerMore");
  var drawerSub = document.getElementById("drawerSub");

  if (drawerMore && drawerSub) {
    drawerMore.addEventListener("click", function () {
      var open = drawerMore.getAttribute("aria-expanded") !== "true";
      drawerMore.setAttribute("aria-expanded", open ? "true" : "false");
      drawerSub.hidden = !open;
    });
  }

  /* ------------------------------------------------------------------ *
   * 2. "More" dropdown
   * ------------------------------------------------------------------ */
  var moreToggle = document.getElementById("moreToggle");
  var moreMenu = document.getElementById("moreMenu");

  function setMenu(open) {
    if (!moreToggle || !moreMenu) return;
    moreToggle.setAttribute("aria-expanded", open ? "true" : "false");
    moreMenu.hidden = !open;
  }

  function isMenuOpen() {
    return moreToggle && moreToggle.getAttribute("aria-expanded") === "true";
  }

  if (moreToggle && moreMenu) {
    // Click / Enter / Space keeps the control operable by every input method.
    moreToggle.addEventListener("click", function () {
      setMenu(!isMenuOpen());
    });

    // Close when keyboard focus leaves the group.
    var moreWrap = moreToggle.closest(".nav__more");
    if (moreWrap) {
      moreWrap.addEventListener("focusout", function (event) {
        if (!moreWrap.contains(event.relatedTarget)) setMenu(false);
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * Shared dismissal: Escape + outside click
   * ------------------------------------------------------------------ */
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;

    if (moreMenu && !moreMenu.hidden) {
      setMenu(false);
      if (moreToggle) moreToggle.focus();
    }

    if (navDrawer && !navDrawer.hidden) {
      setDrawer(false);
      if (navToggle) navToggle.focus();
    }
  });

  document.addEventListener("click", function (event) {
    if (moreMenu && !moreMenu.hidden) {
      var wrap = moreToggle.closest(".nav__more");
      if (!wrap.contains(event.target)) setMenu(false);
    }

    if (
      navDrawer &&
      !navDrawer.hidden &&
      header &&
      !header.contains(event.target)
    ) {
      setDrawer(false);
    }
  });

  /* ------------------------------------------------------------------ *
   * 3. Pricing region selector
   *
   * Nigeria shows the three published Naira plans. International shows
   * the single USD membership card (monthly, $5.99). Only one region's
   * card row is rendered at a time.
   * ------------------------------------------------------------------ */
  var regionButtons = Array.prototype.slice.call(
    document.querySelectorAll(".region__btn")
  );
  var plansNigeria = document.getElementById("plans");
  var plansInternational = document.getElementById("plansIntl");
  var pricingSection = document.querySelector(".pricing");
  var currentRegion = "ng";

  function setRegion(region) {
    if (region === currentRegion) return;
    currentRegion = region;

    regionButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.dataset.region === region ? "true" : "false");
    });

    var isNigeria = region === "ng";
    if (plansNigeria) plansNigeria.hidden = !isNigeria;
    if (plansInternational) plansInternational.hidden = isNigeria;
    /* The frame-height floor on tablet and mobile assumes three cards. */
    if (pricingSection) pricingSection.classList.toggle("pricing--intl", !isNigeria);

    /* Fade the incoming region in. Opacity only — no layout movement. */
    var shown = isNigeria ? plansNigeria : plansInternational;
    if (shown) {
      shown.classList.remove("pricing__flat--enter");
      void shown.offsetWidth;
      shown.classList.add("pricing__flat--enter");
    }

    /* Pending cards inside a previously hidden region were never observed. */
    revealWithin(shown);
  }

  regionButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setRegion(btn.dataset.region);
    });
  });

  /* ------------------------------------------------------------------ *
   * 4. Motion
   *
   * The .motion class is set by the inline head script only when
   * IntersectionObserver is available and reduced motion is not requested.
   * If anything here fails, the class is removed and all content is shown.
   * ------------------------------------------------------------------ */
  function revealWithin(root) {
    if (!root) return;
    Array.prototype.forEach.call(root.querySelectorAll("[data-reveal]"), function (el) {
      el.classList.add("is-visible");
    });
  }

  var motionRoot = document.documentElement;

  if (motionRoot.classList.contains("motion")) {
    try {
      var revealElements = Array.prototype.slice.call(
        document.querySelectorAll("[data-reveal]")
      );

      /* 70ms between siblings in a card row; capped so long rows stay quick. */
      Array.prototype.forEach.call(
        document.querySelectorAll("[data-reveal-group]"),
        function (group) {
          Array.prototype.forEach.call(
            group.querySelectorAll("[data-reveal]"),
            function (el, index) {
              el.style.setProperty("--reveal-delay", Math.min(index * 70, 240) + "ms");
            }
          );
        }
      );

      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });

      motionRoot.setAttribute("data-motion-ready", "");
    } catch (error) {
      motionRoot.classList.remove("motion");
    }
  }
})();
