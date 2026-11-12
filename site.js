/* Shared code for every page: top bar, footer, page titles and sheet loading.
   You don't need to edit this file — settings live in config.js. */
(function () {
  "use strict";
  var C = window.LEAGUE || {};
  var L = window.LeagueData;
  var esc = L.esc;

  // The one list of pages. The top bar, footer and home page cards are built from it.
  var PAGES = [
    { file: "index.html", label: "Home", title: "Home", blurb: "League home page." },
    { file: "schedule.html", label: "Schedule", title: "Schedule & scores", blurb: "Every game, time and diamond, with final scores." },
    { file: "standings.html", label: "Standings", title: "Standings", blurb: "Wins, losses and the playoff bracket, updated automatically." },
    { file: "teams.html", label: "Teams", title: "Teams", blurb: "The teams playing this season." },
    { file: "info.html", label: "League Information", title: "League Information", blurb: "About the league, rules, constitution, team fees, tiebreaks and code of conduct." },
    { file: "banquet.html", label: "Banquet", title: "Banquet", blurb: "The year-end banquet." }
  ];

  function currentFile() {
    var f = location.pathname.split("/").pop();
    return f && /\.html$/.test(f) ? f : "index.html";
  }

  function mailto(subject) {
    return "mailto:" + encodeURIComponent(C.contactEmail || "").replace("%40", "@") +
      (subject ? "?subject=" + encodeURIComponent(subject) : "");
  }

  function niceDate(ymd) {
    var k = L.configDayKey(ymd);
    if (k == null) return "";
    return L.keyToLocalDate(k).toLocaleDateString("en-CA", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
  }
  function shortDate(ymd) {
    var k = L.configDayKey(ymd);
    if (k == null) return "";
    return L.keyToLocalDate(k).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" });
  }

  function buildHeader() {
    var here = currentFile();
    var links = PAGES.filter(function (p) { return p.file !== "index.html"; }).map(function (p) {
      var cur = p.file === here ? ' aria-current="page"' : "";
      return '<li><a class="' + (p.cta ? "btn btn-dark btn-sm nav-cta" : "nav-link") + '" href="' + p.file + '"' + cur + ">" + esc(p.label) + "</a></li>";
    }).join("");
    var header = document.createElement("header");
    header.className = "topbar";
    header.innerHTML =
      '<a class="skip" href="#main">Skip to content</a>' +
      '<div class="wrap topbar-inner">' +
        '<a class="brand" href="index.html"' + (here === "index.html" ? ' aria-current="page"' : "") + '>' +
          '<img src="' + esc(C.logo) + '" alt="" width="56" height="44">' +
          "<span>" + esc(C.shortName || C.name) + "</span></a>" +
        '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">' +
          '<span class="menu-icon" aria-hidden="true"></span><span>Menu</span></button>' +
        '<nav id="site-nav" class="nav" aria-label="Main"><ul>' + links + "</ul></nav>" +
      "</div>";
    document.body.insertBefore(header, document.body.firstChild);
    var btn = header.querySelector(".menu-btn"), nav = header.querySelector(".nav");
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("open", !open);
    });
  }

  function buildFooter() {
    var footer = document.createElement("footer");
    footer.className = "footer";
    footer.innerHTML =
      '<div class="wrap footer-inner">' +
        '<div class="footer-brand"><img src="' + esc(C.logo) + '" alt="" width="72" height="56">' +
          "<div><strong>" + esc(C.name) + "</strong><p>" + esc(C.tagline) + "</p></div></div>" +
        '<nav aria-label="Footer"><ul class="footer-links">' +
          PAGES.map(function (p) { return '<li><a href="' + p.file + '">' + esc(p.title) + "</a></li>"; }).join("") +
        "</ul></nav>" +
        '<p class="footer-contact">Questions? <a href="' + mailto(C.name) + '">' + esc(C.contactEmail) + "</a></p>" +
        '<p class="footer-small">&copy; ' + new Date().getFullYear() + " " + esc(C.name) + ". No cookies, no ads, no tracking.</p>" +
      "</div>";
    document.body.appendChild(footer);
  }

  // Keep the browser tab title and description in line with config.js.
  function updateHead() {
    var p = PAGES.filter(function (x) { return x.file === currentFile(); })[0] || PAGES[0];
    document.title = p.file === "index.html" ? (C.name + " | " + C.tagline) : (p.title + " | " + C.name);
  }

  /* ---------- Loading the Google Sheet ---------- */
  var REFRESH_MS = 2 * 60 * 1000;

  function fetchTab(key) {
    var link = (C.sheetLinks || {})[key];
    var url = L.csvUrl(link, (C.sheetTabNames || {})[key]);
    if (!url) return Promise.resolve({ status: "empty", text: "" });
    return fetch(url, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.text();
    }).then(function (text) {
      // A Google sign-in page instead of a CSV means the sheet isn't shared publicly.
      if (/^\s*<(!doctype|html)/i.test(text)) throw new Error("not csv");
      return { status: "ok", text: text };
    }).catch(function () { return { status: "error", text: "" }; });
  }

  // Load the needed tabs now and every 2 minutes; call render(data) each time.
  function loadSheets(keys, render) {
    var last = null;
    function run() {
      Promise.all(keys.map(fetchTab)).then(function (results) {
        var data = {};
        keys.forEach(function (k, i) {
          // If a refresh fails but we already had data, keep showing the old data.
          data[k] = (results[i].status === "error" && last && last[k].status === "ok") ? last[k] : results[i];
        });
        last = data;
        data.checkedAt = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        try { render(data); } catch (e) { /* never show technical errors */ }
      });
    }
    run();
    setInterval(run, REFRESH_MS);
  }

  function lastChecked(data) {
    return '<p class="checked" aria-live="polite">Last checked ' + esc(data.checkedAt) + "</p>";
  }

  function notice(text, extraClass) {
    return '<div class="notice ' + (extraClass || "") + '"><p>' + text + "</p></div>";
  }

  // Segmented control (division tabs). Real buttons, keyboard friendly.
  function segmented(options, active, label) {
    return '<div class="segmented" role="group" aria-label="' + esc(label) + '">' +
      options.map(function (o) {
        return '<button type="button" data-value="' + esc(o.value) + '" aria-pressed="' + (o.value === active) + '">' + esc(o.label) + "</button>";
      }).join("") + "</div>";
  }

  window.Site = {
    config: C, pages: PAGES, mailto: mailto, niceDate: niceDate, shortDate: shortDate,
    loadSheets: loadSheets, lastChecked: lastChecked, notice: notice, segmented: segmented
  };

  buildHeader();
  buildFooter();
  updateHead();
})();
