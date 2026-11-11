/* What each page shows. You don't need to edit this file — settings live in config.js. */
(function () {
  "use strict";
  var C = Site.config, L = window.LeagueData, esc = L.esc;
  var main = document.getElementById("main");
  var page = document.body.getAttribute("data-page");

  function $(sel, rootEl) { return (rootEl || document).querySelector(sel); }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

  function sectionHead(label, title, intro) {
    return '<p class="eyebrow">' + esc(label) + '</p><h1 class="page-title">' + esc(title) + "</h1>" +
      (intro ? '<p class="lead">' + intro + "</p>" : "");
  }

  /* =========================== HOME =========================== */
  function home() {
    var first = L.configDayKey(C.firstGameDay), lastReg = L.configDayKey(C.lastRegularSeasonDay);
    main.innerHTML =
      '<section class="hero"><div class="wrap hero-inner">' +
        '<div class="hero-text">' +
          '<p class="eyebrow">' + esc(C.seasonName) + " &middot; " + esc(C.locationSummary) + "</p>" +
          '<h1 class="display">' + esc(C.name) + "</h1>" +
          '<p class="lead">' + esc(C.tagline) + "</p>" +
          '<div id="countdown" class="countdown"></div>' +
        "</div>" +
        '<img class="hero-logo" src="' + esc(C.logo) + '" alt="' + esc(C.name) + ' logo" width="640" height="500">' +
      "</div></section>" +

      '<section class="wrap section"><h2 class="visually-hidden">Key facts</h2><dl class="facts">' +
        fact("Season", esc(C.seasonName) + '<span class="fact-sub">' + esc(Site.shortDate(C.firstGameDay)) + " &ndash; " + esc(Site.shortDate(C.lastRegularSeasonDay)) + "</span>") +
        fact("Location", esc(C.locationSummary) + '<span class="fact-sub">' + esc((C.venues || []).map(function (v) { return v.name; }).join(" · ")) + "</span>") +
      "</dl></section>" +

      '<section class="wrap section"><p class="eyebrow">Explore</p><h2 class="h2">Everything about the league</h2><ul class="card-grid">' +
        Site.pages.filter(function (p) { return p.file !== "index.html" && p.file !== "register.html"; }).map(function (p) {
          return '<li><a class="card card-link" href="' + p.file + '"><span class="card-title">' + esc(p.title) +
            '</span><span class="card-text">' + esc(p.blurb) + '</span><span class="card-arrow" aria-hidden="true">&rarr;</span></a></li>';
        }).join("") + "</ul></section>" +

      '<section class="wrap section"><div class="card contact"><div><p class="eyebrow">Contact</p><h2 class="h2">Questions? Get in touch.</h2>' +
        '<p>Email the convenor about teams, schedules or scores.</p></div>' +
        '<a class="btn btn-dark" href="' + Site.mailto(C.name) + '">' + esc(C.contactEmail) + "</a></div></section>";

    function fact(label, value) { return '<div class="fact"><dt>' + esc(label) + "</dt><dd>" + value + "</dd></div>"; }

    var box = $("#countdown");
    function tick() {
      var now = new Date(), today = L.todayKey(now);
      if (first != null && today < first) {
        var ms = L.keyToLocalDate(first) - now;
        var d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
        var parts = [[d, "Days"], [h, "Hours"], [m, "Min"], [s, "Sec"]];
        box.innerHTML = '<p class="countdown-label">First pitch in</p><div class="countdown-grid" role="timer" aria-label="' +
          plural(d, "day", "days") + " until the first game day" + '">' +
          parts.map(function (p) { return '<div class="cd-unit"><span class="cd-num">' + (p[0] < 10 && p[1] !== "Days" ? "0" : "") + p[0] + '</span><span class="cd-lbl">' + p[1] + "</span></div>"; }).join("") +
          "</div>";
        return true;
      }
      if (lastReg == null || today <= lastReg) {
        box.innerHTML = '<p class="countdown-status"><span class="live-dot" aria-hidden="true"></span>Season in progress: <a href="schedule.html#latest">see this week\'s scores</a></p>';
      } else {
        box.innerHTML = '<p class="countdown-status">Thanks for a great season!</p>';
      }
      return false;
    }
    if (tick()) { var timer = setInterval(function () { if (!tick()) clearInterval(timer); }, 1000); }
  }

  /* =========================== SCHEDULE =========================== */
  function schedule() {
    main.innerHTML = '<div class="wrap section">' + sectionHead(C.seasonName, "Schedule & scores",
      "Scores appear here as soon as they're submitted. Times and diamonds can change, so check before you go.") +
      scoreNotice() +
      '<div id="controls" class="controls"></div><div id="out" aria-live="polite"><p class="loading">Loading the schedule&hellip;</p></div></div>';
    var state = { div: "all", team: "", scrolled: false };

    // The "IMPORTANT" box under the title. Email addresses become links.
    function scoreNotice() {
      var text = String(C.scoreNotice || "").trim();
      if (!text) return "";
      var html = esc(text).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, function (m) {
        return '<a href="mailto:' + m + '">' + m + "</a>";
      });
      return '<div class="notice notice-important" role="note"><p><strong>IMPORTANT:</strong> ' + html + "</p></div>";
    }

    function render(data) {
      var out = $("#out");
      if (data.games.status === "empty" && data.scores.status === "empty") {
        $("#controls").innerHTML = ""; out.innerHTML = Site.notice("Schedule coming soon."); return;
      }
      if (data.games.status === "error" && data.scores.status !== "ok") {
        out.innerHTML = Site.notice("Couldn't load the schedule right now. Try again in a minute.", "notice-warn"); return;
      }
      var teams = data.teams.status === "ok" ? L.parseTeams(data.teams.text, C) : [];
      var idx = L.teamIndex(teams);
      var games = data.games.status === "ok" ? L.parseGames(data.games.text, C) : [];
      var scores = data.scores.status === "ok" ? L.parseScores(data.scores.text, C) : [];
      var match = L.matchScores(games, scores);

      function display(name, key) { return idx[key] ? idx[key].name : name; }
      function divOf(key) { return idx[key] ? idx[key].divKey : ""; }

      // Build date groups in sheet order.
      var groups = [], byKey = {};
      games.forEach(function (g) {
        var k = g.day != null ? "d" + g.day : "t" + L.nameKey(g.date);
        if (!byKey[k]) { byKey[k] = { id: k, day: g.day, date: g.date, rows: [] }; groups.push(byKey[k]); }
        byKey[k].rows.push({ game: g, score: match.gameScores[g.row] || null });
      });
      // Scores that match no scheduled game: listed under their date.
      match.unmatched.forEach(function (s) {
        var k = "d" + s.day;
        if (!byKey[k]) {
          byKey[k] = { id: k, day: s.day, date: s.date, rows: [] };
          var pos = 0;
          groups.forEach(function (gr, i) { if (gr.day != null && gr.day < s.day) pos = i + 1; });
          groups.splice(pos, 0, byKey[k]);
        }
        byKey[k].rows.push({ game: null, score: s });
      });

      // Controls: "Show only my team".
      var teamChoices = teams.filter(function (t) { return t.state !== "waitlist" && (state.div === "all" || t.divKey === state.div); });
      if (state.team && !teamChoices.some(function (t) { return t.key === state.team; })) state.team = "";
      var ctrl = "";
      if (teamChoices.length) {
        ctrl += '<label class="select"><span>Show only my team</span><select id="team-filter"><option value="">All teams</option>' +
          teamChoices.slice().sort(function (a, b) { return a.name.localeCompare(b.name); }).map(function (t) {
            return '<option value="' + esc(t.key) + '"' + (t.key === state.team ? " selected" : "") + ">" + esc(t.name) + "</option>";
          }).join("") + "</select></label>";
      }
      $("#controls").innerHTML = ctrl;
      var sel = $("#team-filter");
      if (sel) sel.addEventListener("change", function () { state.team = sel.value; draw(); });

      function keep(r) {
        var h = r.game ? r.game.homeKey : r.score.homeKey, a = r.game ? r.game.awayKey : r.score.awayKey;
        if (state.team) return h === state.team || a === state.team;
        if (state.div !== "all") return divOf(h) === state.div || divOf(a) === state.div;
        return true;
      }

      function row(r) {
        var g = r.game, s = r.score;
        var home = g ? g.home : s.home, away = g ? g.away : s.away;
        var hk = g ? g.homeKey : s.homeKey, ak = g ? g.awayKey : s.awayKey;
        var awayWin = s && s.awayPts > s.homePts, homeWin = s && s.homePts > s.awayPts;
        var matchup = '<span class="' + (awayWin ? "win" : "") + '">' + esc(display(away, ak)) + '</span> <span class="at">@</span> <span class="' + (homeWin ? "win" : "") + '">' + esc(display(home, hk)) + "</span>";
        var score = s ? '<span class="score"><span class="' + (awayWin ? "win" : "") + '">' + s.awayPts + '</span><span class="dash">&ndash;</span><span class="' + (homeWin ? "win" : "") + '">' + s.homePts + "</span></span>"
          : '<span class="upcoming">Upcoming</span>';
        var notes = g ? esc(g.notes) : (s.playoff ? "Playoff game" : "Score submitted (not on the schedule)");
        return "<tr><td class=\"nowrap\">" + (g ? esc(g.time) || "&mdash;" : "&mdash;") + "</td><td class=\"nowrap\">" + (g ? esc(g.location) || "&mdash;" : "&mdash;") +
          '</td><td class="nowrap">' + matchup + '</td><td class="num">' + score + '</td><td class="muted notes">' + notes + "</td></tr>";
      }

      function draw() {
        var html = "", any = false;
        groups.forEach(function (gr) {
          var rows = gr.rows.filter(keep);
          if (!rows.length) return;
          any = true;
          html += '<section class="day" id="' + esc(gr.id) + '"><h2 class="day-title">' + esc(gr.date) + "</h2>" +
            '<div class="table-wrap" tabindex="0" role="region" aria-label="Games on ' + esc(gr.date) + '"><table class="table">' +
            '<thead><tr><th scope="col">Time</th><th scope="col">Location</th><th scope="col">Matchup (Away @ Home)</th><th scope="col" class="num">Score</th><th scope="col">Notes</th></tr></thead><tbody>' +
            rows.map(row).join("") + "</tbody></table></div></section>";
        });
        if (!groups.length) html = Site.notice("Schedule coming soon.");
        else if (!any) html = Site.notice("No games match this filter.");
        if (data.games.status === "error") html = Site.notice("Couldn't load the schedule right now. Try again in a minute.", "notice-warn") + html;
        out.innerHTML = html + Site.lastChecked(data);
        if (!state.scrolled && location.hash === "#latest") {
          state.scrolled = true;
          var today = L.todayKey(), target = null;
          groups.forEach(function (gr) { if (gr.day != null && gr.day <= today && (!target || gr.day >= target.day)) target = gr; });
          var el = target && document.getElementById(target.id);
          if (el) el.scrollIntoView();
        }
      }
      draw();
    }
    Site.loadSheets(["teams", "games", "scores"], render);
  }

  /* =========================== STANDINGS =========================== */
  function standingsPage() {
    main.innerHTML = '<div class="wrap section">' + sectionHead(C.seasonName, "Standings",
      'Calculated automatically from submitted scores. Playoff games don\'t count. <a href="info.html#tiebreaks">How ties are broken</a>.') +
      '<div id="out" aria-live="polite"><p class="loading">Loading the standings&hellip;</p></div>' +
      '<section id="bracket-section" class="bracket-section" hidden><p class="eyebrow">Playoffs</p><h2 class="h2">Playoff bracket</h2><div id="bracket"></div></section></div>';

    Site.loadSheets(["teams", "scores", "playoffs"], function (data) {
      var out = $("#out");
      var teams = data.teams.status === "ok" ? L.parseTeams(data.teams.text, C) : [];
      var scores = data.scores.status === "ok" ? L.parseScores(data.scores.text, C) : [];
      if (data.teams.status === "empty" && data.scores.status === "empty") out.innerHTML = Site.notice("Standings coming soon.");
      else if (data.teams.status === "error" && data.scores.status === "error") out.innerHTML = Site.notice("Couldn't load the standings right now. Try again in a minute.", "notice-warn");
      else {
        var groups = L.standings(C, teams, scores);
        out.innerHTML = (groups.length ? groups.map(function (g) {
          return '<section class="division"><h2 class="h3">' + esc(g.division.name) + "</h2>" +
            '<div class="table-wrap" tabindex="0" role="region" aria-label="' + esc(g.division.name) + ' standings"><table class="table standings">' +
            '<thead><tr><th scope="col" class="rank">#</th><th scope="col">Team</th>' +
            th("GP", "Games played") + th("W", "Wins") + th("L", "Losses") + th("PCT", "Winning percentage") + th("GB", "Games behind") +
            th("PF", "Runs scored") + th("PA", "Runs allowed") + th("DIFF", "Run differential") + "</tr></thead><tbody>" +
            g.rows.map(function (r, i) {
              return '<tr><td class="rank">' + (i + 1) + '</td><th scope="row" class="team">' + esc(r.name) + '</th><td class="num">' + r.GP + '</td><td class="num">' + r.W +
                '</td><td class="num">' + r.L + '</td><td class="num strong">' + r.PCT + '</td><td class="num">' + r.GB + '</td><td class="num">' + r.PF +
                '</td><td class="num">' + r.PA + '</td><td class="num">' + (r.DIFF > 0 ? "+" : "") + r.DIFF + "</td></tr>";
            }).join("") + "</tbody></table></div></section>";
        }).join("") : Site.notice("Standings coming soon.")) + Site.lastChecked(data);
      }

      // Playoff bracket: hidden until the Playoffs tab has rows.
      var section = $("#bracket-section");
      var brackets = data.playoffs.status === "ok" ? L.parsePlayoffs(data.playoffs.text, C, teams, scores) : [];
      if (!brackets.length) { section.hidden = true; return; }
      section.hidden = false;
      $("#bracket").innerHTML = brackets.map(function (b) { return bracketHTML(b, brackets.length > 1); }).join("");
    });

    function th(abbr, full) { return '<th scope="col" class="num"><abbr title="' + full + '">' + abbr + "</abbr></th>"; }
  }

  function gameCard(g) {
    function line(name, score, win) {
      return '<div class="bk-team' + (win ? " win" : "") + '"><span class="bk-name">' + (name ? esc(name) : '<span class="muted">TBD</span>') +
        '</span><span class="bk-score">' + (score == null ? "" : score) + "</span></div>";
    }
    return '<div class="bk-game">' + line(g.a, g.sa, g.winner === "a") + line(g.b, g.sb, g.winner === "b") + "</div>";
  }

  function bracketHTML(b, showTitle) {
    var R = b.rounds.length, html = "";
    if (showTitle && b.name) html += '<h3 class="h3">' + esc(b.name) + "</h3>";
    html += '<div class="bracket-scroll" tabindex="0" role="region" aria-label="' + esc(b.name ? b.name + " playoff bracket" : "Playoff bracket") + '">';
    if (b.neat) {
      var n0 = b.rounds[0].games.length;
      html += '<div class="bracket neat" style="grid-template-columns: repeat(' + R + ', minmax(12rem, 15rem)); grid-template-rows: auto repeat(' + n0 + ', minmax(4.75rem, auto));">';
      b.rounds.forEach(function (rd, r) {
        html += '<p class="bk-round" style="grid-column:' + (r + 1) + '; grid-row:1;">' + esc(rd.name) + "</p>";
        var span = Math.pow(2, r);
        rd.games.forEach(function (g, gi) {
          var start = gi * span + 2;
          var cls = "bk-slot" + (r > 0 ? " fed" : "") + (r < R - 1 ? (gi % 2 === 0 ? " feeds-top" : " feeds-bottom") : "");
          html += '<div class="' + cls + '" style="grid-column:' + (r + 1) + "; grid-row:" + start + " / " + (start + span) + ';">' + gameCard(g) + "</div>";
        });
      });
      html += "</div>";
    } else {
      html += '<div class="bracket loose">' + b.rounds.map(function (rd) {
        return '<div class="bk-col"><p class="bk-round">' + esc(rd.name) + '</p><div class="bk-col-games">' +
          rd.games.map(function (g) { return '<div class="bk-slot">' + gameCard(g) + "</div>"; }).join("") + "</div></div>";
      }).join("") + "</div>";
    }
    html += "</div>";
    if (b.champion) html += '<div class="champion"><p class="eyebrow">Champion</p><p class="champion-name">' + esc(b.champion) + "</p></div>";
    return '<div class="bracket-block">' + html + "</div>";
  }

  /* =========================== TEAMS =========================== */
  function teamsPage() {
    var list = (C.teams || []).filter(function (t) { return String(t).trim(); });
    main.innerHTML = '<div class="wrap section">' + sectionHead(C.seasonName, "Teams",
      list.length ? plural(list.length, "team", "teams") + " this season." : "") +
      (list.length ? '<ul class="team-grid">' + list.map(function (t) {
        return '<li class="card team-card">' + esc(t) + "</li>";
      }).join("") + "</ul>" : Site.notice("Teams coming soon.")) + "</div>";
  }

  /* =========================== REGISTER =========================== */
  function registerPage() {
    var form = L.formLinks(C.registrationFormLink);
    main.innerHTML = '<div class="wrap section">' + sectionHead(C.seasonName, "Register a team",
      "Get your team on the field for the " + esc(C.seasonName) + " season.") +
      '<dl class="facts">' +
        '<div class="fact"><dt>Team fee</dt><dd>' + esc(C.teamFee) + "</dd></div>" +
        '<div class="fact"><dt>Deadline</dt><dd>' + esc(Site.niceDate(C.registrationDeadline)) + "</dd></div>" +
        '<div class="fact fact-wide"><dt>Who can play</dt><dd class="fact-text">' + esc(C.whoCanPlay) + "</dd></div>" +
      "</dl>" +
      '<section class="section-tight"><h2 class="h3">How to register</h2><ol class="steps">' +
        (C.registrationSteps || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol></section>" +
      '<section class="section-tight"><h2 class="h3">Registration form</h2>' +
      (form ? '<div class="form-frame"><iframe src="' + esc(form.embed) + '" title="Team registration form" loading="lazy"></iframe></div>' +
        '<p><a href="' + esc(form.open) + '" target="_blank" rel="noopener">Open the form in a new tab</a></p>'
        : '<div class="card soon"><h3 class="h3">Registration opens soon</h3><p>Want a spot? Email us and we\'ll let you know as soon as the form is live.</p>' +
          '<a class="btn btn-primary" href="' + Site.mailto(C.name + " registration") + '">Email ' + esc(C.contactEmail) + "</a></div>") +
      "</section></div>";
  }

  /* =========================== INFO =========================== */
  function infoPage() {
    function mapLink(v) {
      var q = v.address || (v.name + " " + (C.mapSearchFallback || C.locationSummary || ""));
      return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
    }
    function items(list) { return (list || []).filter(function (x) { return String(x).trim(); }); }
    // Constitution: a PDF to open or download, plus any typed paragraphs.
    function constitutionBlock() {
      var file = String(C.constitutionFile || "").trim();
      var text = constitution.map(function (r) { return "<p>" + esc(r) + "</p>"; }).join("");
      if (!file) return text || soon("league constitution");
      return '<div class="card doc-card"><h3 class="h3">Rosedale 3 Pitch Council Agreement</h3>' +
        '<p>The league constitution, as a PDF.</p><div class="actions">' +
        '<a class="btn btn-primary btn-sm" href="' + esc(file) + '" target="_blank" rel="noopener">Read the constitution</a>' +
        '<a class="btn btn-outline btn-sm" href="' + esc(file) + '" download>Download PDF</a></div></div>' + text;
    }
    function soon(what) { return '<div class="card soon"><p><strong>Coming soon.</strong> The ' + what + " will be posted here.</p></div>"; }
    var rules = items(C.rules), constitution = items(C.constitution), fees = items(C.teamFees);
    main.innerHTML = '<div class="wrap section">' + sectionHead("Good to know", "League Information", "") +
      '<nav class="toc" aria-label="On this page"><a href="#about">About</a><a href="#rules">Rules</a><a href="#constitution">Constitution</a><a href="#fees">Team fees</a><a href="#diamonds">Diamonds</a><a href="#tiebreaks">Tiebreaks</a><a href="#faq">FAQ</a><a href="#conduct">Code of conduct</a></nav>' +
      '<section id="about" class="section-tight"><h2 class="h2">About the league</h2><p class="lead">' + esc(C.leagueDescription) + "</p></section>" +
      '<section id="rules" class="section-tight"><h2 class="h2">Rules</h2>' +
        (rules.length ? '<ol class="rules">' + rules.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ol>" : soon("league rules")) + "</section>" +
      '<section id="constitution" class="section-tight"><h2 class="h2">Constitution</h2>' +
        constitutionBlock() + "</section>" +
      '<section id="fees" class="section-tight"><h2 class="h2">Team fees</h2>' +
        (fees.length ? '<ul class="rules">' + fees.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>" : soon("team fees")) + "</section>" +
      '<section id="diamonds" class="section-tight"><h2 class="h2">Diamonds</h2><ul class="venue-grid">' +
        (C.venues || []).map(function (v) {
          return '<li class="card venue"><h3 class="h3">' + esc(v.name) + "</h3><p>" + (v.address ? esc(v.address) : esc(C.locationSummary) + ' <span class="muted">(full address coming soon)</span>') +
            '</p><a class="btn btn-outline btn-sm" href="' + esc(mapLink(v)) + '" target="_blank" rel="noopener">Open in Google Maps</a></li>';
        }).join("") + "</ul></section>" +
      '<section id="tiebreaks" class="section-tight"><h2 class="h2">Standings and tiebreaks</h2>' +
        "<p>Standings are calculated automatically from the submitted regular-season scores. Teams are ranked by:</p><ol class=\"rules\">" +
        "<li>Winning percentage (PCT): wins divided by games played.</li>" +
        "<li>Run differential (DIFF): runs scored minus runs allowed.</li>" +
        "<li>Runs scored (PF).</li><li>Team name, alphabetically.</li></ol>" +
        "<p class=\"muted\">Games behind (GB) shows how far a team is from first place. Playoff games never count in the standings.</p></section>" +
      '<section id="faq" class="section-tight"><h2 class="h2">FAQ</h2><div class="faq">' +
        (C.faq || []).map(function (f) { return "<details><summary>" + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>"; }).join("") + "</div></section>" +
      '<section id="conduct" class="section-tight"><h2 class="h2">Code of conduct</h2><ul class="rules">' +
        (C.codeOfConduct || []).map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>" +
        '<p>Questions or concerns? Email <a href="' + Site.mailto(C.name) + '">' + esc(C.contactEmail) + "</a>.</p></section></div>";
  }

  var routes = { home: home, schedule: schedule, standings: standingsPage, teams: teamsPage, register: registerPage, info: infoPage };
  if (routes[page]) routes[page]();
})();
