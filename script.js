/* Elite Global Athletes — interactions */
(function () {
  "use strict";

  var root = document.documentElement;
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var themeToggle = document.getElementById("themeToggle");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Theme toggle */
  function syncThemeLabel() {
    var isDark = root.getAttribute("data-theme") === "dark";
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }
  }
  syncThemeLabel();
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("ega-theme", next); } catch (e) {}
      syncThemeLabel();
    });
  }

  /* Mobile menu */
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll(".nav__mobile a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Nav border on scroll */
  var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 24); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

})();

/* Representation form: post to Netlify without leaving the page, and say what happened. */
(function () {
  var form = document.querySelector(".apply__form");
  if (!form) return;
  var status = form.querySelector(".apply__status");
  var submit = form.querySelector(".apply__submit");
  var original = submit ? submit.textContent : "";

  function say(msg, ok) {
    if (!status) return;
    status.textContent = msg;
    status.hidden = false;
    status.classList.toggle("is-error", !ok);
  }

  var done = document.querySelector(".apply__done");
  var again = done && done.querySelector(".apply__again");
  var doneName = done && done.querySelector(".apply__done-name");

  function showDone(name) {
    if (!done) { say("Thanks — we've got it.", true); return; }
    var first = (name || "").trim().split(/\s+/)[0];
    doneName.textContent = first ? "Thanks, " + first + "." : "Thanks — we've got it.";
    if (status) status.hidden = true;
    form.hidden = true;
    done.hidden = false;
    done.setAttribute("data-play", "1");
    done.setAttribute("tabindex", "-1");
    done.focus({ preventScroll: true });
  }

  if (again) {
    again.addEventListener("click", function () {
      done.hidden = true;
      done.removeAttribute("data-play");
      form.hidden = false;
      if (submit) { submit.disabled = false; submit.textContent = original; }
      if (status) { status.hidden = true; status.textContent = ""; }
      var f = form.querySelector("#ap-name");
      if (f) f.focus();
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;

    if (submit) { submit.disabled = true; submit.textContent = "Sending…"; }
    say("Sending your details…", true);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        var who = (form.querySelector("#ap-name") || {}).value || "";
        form.reset();
        showDone(who);
      })
      .catch(function () {
        say("That didn't send. Email us directly and we'll pick it up from there.", false);
        if (submit) { submit.disabled = false; submit.textContent = original; }
      });
  });
})();
