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
  var regionLabel = document.getElementById("regionLabel");
  var pricingSection = document.querySelector(".pricing");

  var REGION_LABELS = { ng: "Nigeria", intl: "International" };

  function setRegion(region) {
    regionButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.dataset.region === region ? "true" : "false");
    });

    if (regionLabel) regionLabel.textContent = REGION_LABELS[region] || region;

    var isNigeria = region === "ng";
    if (plansNigeria) plansNigeria.hidden = !isNigeria;
    if (plansInternational) plansInternational.hidden = isNigeria;
    /* The frame-height floor on tablet and mobile assumes three cards. */
    if (pricingSection) pricingSection.classList.toggle("pricing--intl", !isNigeria);
  }

  regionButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setRegion(btn.dataset.region);
    });
  });
})();
