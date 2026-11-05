/* League data logic: reading the Google Sheet, scores, standings, bracket.
   You don't need to edit this file — settings live in config.js. */
(function (root) {
  "use strict";

  /* ---------- Small helpers ---------- */

  // Make any sheet value safe to put on the page.
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Trim and squash repeated spaces (for display).
  function clean(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); }

  // Key for matching team names and divisions: ignore capitals and extra spaces.
  function nameKey(s) { return clean(s).toLowerCase(); }

  // Key for matching column titles: also ignore punctuation.
  function headerKey(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }

  /* ---------- CSV parser (handles commas, quotes, line breaks in cells) ---------- */
  function parseCSV(text) {
    text = String(text || "").replace(/^﻿/, "");
    var rows = [], row = [], field = "", i = 0, inQuotes = false, c;
    while (i < text.length) {
      c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += c; i++; continue;
      }
      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === ",") { row.push(field); field = ""; i++; continue; }
      if (c === "\r") { i++; continue; }
      if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += c; i++;
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  // Turn CSV text into { headers: [...keys], rows: [ [cells], ... ] } without empty rows.
  function table(text) {
    var all = parseCSV(text);
    var headers = (all[0] || []).map(headerKey);
    var rows = all.slice(1).filter(function (r) {
      return r.some(function (cell) { return clean(cell) !== ""; });
    });
    return { headers: headers, rows: rows };
  }

  // Find a column by one of several possible titles. Returns -1 if missing.
  function col(t, names) {
    for (var n = 0; n < names.length; n++) {
      var idx = t.headers.indexOf(headerKey(names[n]));
      if (idx !== -1) return idx;
    }
    return -1;
  }
  function cell(row, idx) { return idx < 0 ? "" : clean(row[idx]); }

  /* ---------- Dates ---------- */

  // Read a sheet date as a calendar day. Returns a number like 20270528, or null.
  function dayKey(value, style) {
    var s = clean(value);
    if (!s) return null;
    var m = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/); // yyyy-mm-dd
    var y, mo, d;
    if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; }
    else {
      m = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})/);
      if (!m) return null;
      if (String(style || "M/D/YYYY").toUpperCase().charAt(0) === "D") { d = +m[1]; mo = +m[2]; }
      else { mo = +m[1]; d = +m[2]; }
      y = +m[3]; if (y < 100) y += 2000;
    }
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    return y * 10000 + mo * 100 + d;
  }
  // Settings dates (YYYY-MM-DD), read as local dates.
  function configDayKey(s) { return dayKey(s, "M/D/YYYY"); }
  function keyToLocalDate(k) { return new Date(Math.floor(k / 10000), Math.floor(k / 100) % 100 - 1, k % 100); }
  function todayKey(now) {
    now = now || new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  }

  function wholeNumber(s) {
    s = clean(s);
    return /^\d+$/.test(s) ? parseInt(s, 10) : null;
  }

  /* ---------- Sheet link → CSV address ---------- */
  function csvUrl(link, tabName) {
    link = clean(link);
    if (!link) return "";
    if (/output=csv|format=csv|tqx=out:csv/i.test(link)) return link;
    var pub = link.match(/^(https:\/\/docs\.google\.com\/spreadsheets\/d\/e\/[^\/]+)\/pub(html)?/i);
    if (pub) {
      var g = link.match(/[?&#]gid=(\d+)/);
      return pub[1] + "/pub?output=csv" + (g ? "&gid=" + g[1] : "");
    }
    var m = link.match(/^https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (m) {
      var gid = link.match(/[?&#]gid=(\d+)/);
      var base = "https://docs.google.com/spreadsheets/d/" + m[1] + "/gviz/tq?tqx=out:csv&headers=1";
      if (gid && !tabName) return base + "&gid=" + gid[1];
      return base + "&sheet=" + encodeURIComponent(tabName || "Sheet1");
    }
    return link;
  }

  /* ---------- Form link → embed + open links ---------- */
  function formLinks(link) {
    link = clean(link);
    if (!link) return null;
    var m = link.match(/^(https:\/\/docs\.google\.com\/forms\/(?:u\/\d+\/)?d\/(?:e\/)?[a-zA-Z0-9_-]+)/);
    if (m) return { embed: m[1] + "/viewform?embedded=true", open: m[1] + "/viewform" };
    var open = link.replace(/([?&])embedded=true&?/, "$1").replace(/[?&]$/, "");
    return { embed: link, open: open };
  }

  /* ---------- Teams tab ---------- */
  function parseTeams(text, config) {
    var t = table(text);
    var cTeam = col(t, ["Team", "Team Name"]), cDiv = col(t, ["Division"]), cStatus = col(t, ["Status"]);
    var teams = [];
    t.rows.forEach(function (r) {
      var name = cell(r, cTeam);
      if (!name) return;
      var status = nameKey(cell(r, cStatus));
      teams.push({
        name: name,
        key: nameKey(name),
        division: cell(r, cDiv),
        divKey: nameKey(cell(r, cDiv)),
        state: status === "paid" ? "confirmed" : status === "waitlist" ? "waitlist" : "registered"
      });
    });
    return teams;
  }

  // Divisions from config.js, plus any extra ones that appear in the Teams tab.
  function divisionList(config, teams) {
    var list = [], seen = {};
    (config.divisions || []).forEach(function (d) {
      var k = nameKey(d); if (k && !seen[k]) { seen[k] = 1; list.push({ name: clean(d), key: k }); }
    });
    (teams || []).forEach(function (tm) {
      if (tm.divKey && !seen[tm.divKey]) { seen[tm.divKey] = 1; list.push({ name: tm.division, key: tm.divKey }); }
    });
    return list;
  }

  function teamIndex(teams) {
    var idx = {};
    (teams || []).forEach(function (tm) { idx[tm.key] = tm; });
    return idx;
  }

  /* ---------- Games tab ---------- */
  function parseGames(text, config) {
    var t = table(text);
    var c = {
      date: col(t, ["Date"]), time: col(t, ["Time"]), loc: col(t, ["Location", "Diamond", "Field"]),
      home: col(t, ["Home", "Home Team"]), away: col(t, ["Away", "Away Team"]), notes: col(t, ["Notes", "Note"])
    };
    return t.rows.map(function (r, i) {
      var date = cell(r, c.date);
      return {
        row: i, date: date, day: dayKey(date, config.sheetDateStyle),
        time: cell(r, c.time), location: cell(r, c.loc),
        home: cell(r, c.home), away: cell(r, c.away), notes: cell(r, c.notes),
        homeKey: nameKey(cell(r, c.home)), awayKey: nameKey(cell(r, c.away))
      };
    }).filter(function (g) { return g.date || g.home || g.away; });
  }

  /* ---------- Scores tab ---------- */
  function parseScores(text, config) {
    var t = table(text);
    var cDate = col(t, ["Date", "Game Date"]);
    var cHome = col(t, ["Home Team", "Home"]);
    var cAway = col(t, ["Away Team", "Away"]);
    var cHomePts = col(t, ["Home Points", "Home Score"]);
    var cAwayPts = col(t, ["Away Points", "Away Score"]);
    // Both points columns are titled "Points": use the one right after each team column.
    if (cHomePts < 0 && cHome >= 0 && t.headers[cHome + 1] === "points") cHomePts = cHome + 1;
    if (cAwayPts < 0 && cAway >= 0 && t.headers[cAway + 1] === "points") cAwayPts = cAway + 1;

    var lastReg = configDayKey(config.lastRegularSeasonDay);
    var byGame = {}, order = [];
    t.rows.forEach(function (r, i) {
      var date = cell(r, cDate), day = dayKey(date, config.sheetDateStyle);
      var home = cell(r, cHome), away = cell(r, cAway);
      var hp = wholeNumber(cell(r, cHomePts)), ap = wholeNumber(cell(r, cAwayPts));
      // A submission counts only with whole-number points that are not equal.
      if (day == null || !home || !away || hp == null || ap == null || hp === ap) return;
      var s = {
        row: i, date: date, day: day, home: home, away: away,
        homeKey: nameKey(home), awayKey: nameKey(away), homePts: hp, awayPts: ap,
        playoff: lastReg != null && day > lastReg
      };
      // Same date + home + away submitted again: the lowest row (newest) wins.
      var k = day + "|" + s.homeKey + "|" + s.awayKey;
      if (!byGame[k]) order.push(k);
      byGame[k] = s;
    });
    return order.map(function (k) { return byGame[k]; }).sort(function (a, b) { return a.row - b.row; });
  }

  /* ---------- Match scores to scheduled games ---------- */
  // Returns { gameScores: {gameRow: submission}, unmatched: [submissions] }
  function matchScores(games, scores) {
    var gameScores = {}, used = {}, exact = {};
    // Pass 1: same home, away and calendar day.
    scores.forEach(function (s) {
      for (var i = 0; i < games.length; i++) {
        var g = games[i];
        if (g.day === s.day && g.homeKey === s.homeKey && g.awayKey === s.awayKey) {
          gameScores[g.row] = s; exact[g.row] = 1; used[s.row] = 1; return;
        }
      }
    });
    // Pass 2 (regular season only): those two teams have exactly one game with that home team.
    scores.forEach(function (s) {
      if (used[s.row] || s.playoff) return;
      var hits = games.filter(function (g) { return g.homeKey === s.homeKey && g.awayKey === s.awayKey; });
      if (hits.length === 1 && !exact[hits[0].row]) { gameScores[hits[0].row] = s; used[s.row] = 1; }
    });
    // A game can only show one score: if two submissions landed on it, the newest wins.
    var shown = {};
    Object.keys(gameScores).forEach(function (r) { shown[gameScores[r].row] = 1; });
    var unmatched = scores.filter(function (s) { return !shown[s.row]; });
    return { gameScores: gameScores, unmatched: unmatched };
  }

  /* ---------- Standings ---------- */
  function formatPct(w, gp) {
    if (!gp) return ".000";
    var p = (w / gp).toFixed(3);
    return p.charAt(0) === "0" ? p.slice(1) : p;
  }
  function formatGB(gb) {
    if (gb === 0) return "—";
    var whole = Math.floor(Math.abs(gb)), half = Math.abs(gb) % 1 !== 0;
    var txt = (whole ? whole : "") + (half ? ".5" : "") || "0";
    return (gb < 0 ? "-" : "") + txt;
  }

  // Returns [ { division: {name,key}, rows: [...] } ] in config order.
  function standings(config, teams, scores) {
    var idx = teamIndex(teams), recs = {}, extraOrder = [];
    function rec(name, key) {
      if (!recs[key]) {
        var tm = idx[key];
        recs[key] = { name: tm ? tm.name : name, key: key, divKey: tm ? tm.divKey : "", W: 0, L: 0, PF: 0, PA: 0 };
        if (!tm) extraOrder.push(key);
      }
      return recs[key];
    }
    teams.forEach(function (tm) { if (tm.state !== "waitlist") rec(tm.name, tm.key); });
    scores.forEach(function (s) {
      if (s.playoff) return;
      var h = rec(s.home, s.homeKey), a = rec(s.away, s.awayKey);
      h.PF += s.homePts; h.PA += s.awayPts; a.PF += s.awayPts; a.PA += s.homePts;
      if (s.homePts > s.awayPts) { h.W++; a.L++; } else { a.W++; h.L++; }
    });

    var divs = divisionList(config, teams), groups = [];
    var allKeys = Object.keys(recs);
    function build(division, members) {
      members.forEach(function (r) {
        r.GP = r.W + r.L; r.DIFF = r.PF - r.PA; r.pctValue = r.GP ? r.W / r.GP : 0;
      });
      members.sort(function (a, b) {
        return (b.pctValue - a.pctValue) || (b.DIFF - a.DIFF) || (b.PF - a.PF) ||
          a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      var lead = members[0];
      members.forEach(function (r, i) {
        r.PCT = formatPct(r.W, r.GP);
        var gb = ((lead.W - r.W) + (r.L - lead.L)) / 2;
        r.gbValue = i === 0 ? 0 : gb;
        r.GB = i === 0 ? "—" : formatGB(gb);
      });
      groups.push({ division: division, rows: members });
    }
    divs.forEach(function (d) {
      var members = allKeys.map(function (k) { return recs[k]; }).filter(function (r) { return r.divKey === d.key; });
      if (members.length) build(d, members);
    });
    var others = allKeys.map(function (k) { return recs[k]; }).filter(function (r) { return !r.divKey; });
    if (others.length) build({ name: divs.length ? "Other teams" : "Standings", key: "" }, others);
    return groups;
  }

  /* ---------- Playoffs / bracket ---------- */
  function parsePlayoffs(text, config, teams, scores) {
    var t = table(text), idx = teamIndex(teams);
    var c = {
      div: col(t, ["Division"]), round: col(t, ["Round"]), game: col(t, ["Game", "Game Number", "Game #"]),
      a: col(t, ["Team A"]), sa: col(t, ["Score A"]), b: col(t, ["Team B"]), sb: col(t, ["Score B"])
    };
    function canon(n) { var tm = idx[nameKey(n)]; return tm ? tm.name : n; }
    var playoffScores = (scores || []).filter(function (s) { return s.playoff; });
    var brackets = [], byDiv = {};
    t.rows.forEach(function (r, i) {
      var round = cell(r, c.round);
      if (!round) return;
      var divName = cell(r, c.div), dk = nameKey(divName);
      if (!byDiv[dk]) { byDiv[dk] = { name: divName, key: dk, rounds: [], roundIdx: {} }; brackets.push(byDiv[dk]); }
      var br = byDiv[dk], rk = nameKey(round);
      if (!(rk in br.roundIdx)) { br.roundIdx[rk] = br.rounds.length; br.rounds.push({ name: round, games: [] }); }
      var a = cell(r, c.a), b = cell(r, c.b);
      var sa = wholeNumber(cell(r, c.sa)), sb = wholeNumber(cell(r, c.sb));
      if (sa == null || sb == null) {
        sa = sb = null;
        // Otherwise use the newest playoff submission between these two teams.
        if (a && b) {
          var ak = nameKey(a), bk = nameKey(b);
          for (var j = playoffScores.length - 1; j >= 0; j--) {
            var s = playoffScores[j];
            if (s.homeKey === ak && s.awayKey === bk) { sa = s.homePts; sb = s.awayPts; break; }
            if (s.homeKey === bk && s.awayKey === ak) { sa = s.awayPts; sb = s.homePts; break; }
          }
        }
      }
      var num = parseFloat(cell(r, c.game));
      var winner = (sa != null && sb != null && sa !== sb) ? (sa > sb ? "a" : "b") : "";
      br.rounds[br.roundIdx[rk]].games.push({
        num: isNaN(num) ? null : num, row: i,
        a: a ? canon(a) : "", b: b ? canon(b) : "", sa: sa, sb: sb, winner: winner
      });
    });
    brackets.forEach(function (br) {
      br.rounds.forEach(function (rd) {
        rd.games.sort(function (x, y) {
          var nx = x.num == null ? Infinity : x.num, ny = y.num == null ? Infinity : y.num;
          return (nx - ny) || (x.row - y.row);
        });
      });
      // "Neat" = every round has exactly half the games of the one before, numbered 1, 2, 3...
      br.neat = br.rounds.every(function (rd, ri) {
        var numbered = rd.games.every(function (g, gi) { return g.num === gi + 1; });
        var halves = ri === 0 || rd.games.length * 2 === br.rounds[ri - 1].games.length;
        return numbered && halves;
      });
      var last = br.rounds[br.rounds.length - 1];
      br.champion = "";
      if (last && last.games.length === 1 && last.games[0].winner) {
        var fg = last.games[0];
        br.champion = fg.winner === "a" ? fg.a : fg.b;
      }
      delete br.roundIdx;
    });
    return brackets;
  }

  var api = {
    esc: esc, clean: clean, nameKey: nameKey, parseCSV: parseCSV, table: table,
    dayKey: dayKey, configDayKey: configDayKey, keyToLocalDate: keyToLocalDate, todayKey: todayKey,
    csvUrl: csvUrl, formLinks: formLinks, parseTeams: parseTeams, divisionList: divisionList,
    teamIndex: teamIndex, parseGames: parseGames, parseScores: parseScores, matchScores: matchScores,
    standings: standings, parsePlayoffs: parsePlayoffs, formatPct: formatPct, formatGB: formatGB
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.LeagueData = api;
})(this);
