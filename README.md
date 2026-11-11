# Rosedale Adult 3 Pitch — league website

This folder is the whole website. It reads your Google Sheet by itself, so after it's online you
mostly work in the Google Sheet, not here. The only file you ever need to edit is **config.js**.

---

## 1. Put the site online (GitHub Pages, free)

1. Sign in at github.com and click **New repository**. Name it `rosedale3-pitch`, choose **Public**, click **Create repository**.
2. Click **uploading an existing file**, drag **all the files from this folder** into the box, then click **Commit changes**.
3. Go to **Settings > Pages**. Under "Branch" choose **main** and **/ (root)**, click **Save**.
4. After a minute or two your site is at `https://YOUR-GITHUB-NAME.github.io/rosedale3-pitch/`.

**Changing a file later:** open the file on GitHub, click the pencil icon, make the change, click **Commit changes**.
The site updates within a couple of minutes.

**Your own web address (optional):** "Rosedale3-pitch" isn't a full web address, so there is no CNAME file.
If you buy one (for example `rosedale3pitch.ca`), create a file named `CNAME` containing only that address,
and follow GitHub's instructions under **Settings > Pages > Custom domain**.

## 2. Connect your Google Sheet (important)

The site needs to be allowed to read each tab. Easiest and most reliable:

1. In the Google Sheet: **File > Share > Publish to web**.
2. Under "Link", pick the **Teams** tab and **Comma-separated values (.csv)**, click **Publish**, copy the link.
3. Paste it in **config.js** next to `teams:`. Repeat for **Games**, **Playoffs** and **Scores** (each tab gets its own link).

Right now config.js uses your normal share link for all four. That also works **if** the sheet is shared as
"Anyone with the link can view" **and** the tab names in `sheetTabNames` match your tabs exactly
(your score form answers often land in a tab called "Form Responses 1" — type that name for `scores`).

The site checks the sheet every 2 minutes and shows "Last checked …" under the tables.

## 3. How scores get on the site

1. After a game, someone fills in your score Google Form (date, home team, points, away team, points).
2. Google adds a row to the **Scores** tab.
3. Within 2 minutes the website shows the score on the Schedule page and updates the Standings. You never type standings.

Rules the site follows:
- Team names must match the Teams tab (capital letters and extra spaces don't matter).
- A score counts only when both points are whole numbers and not tied.
- Scores dated **after** the last regular-season day are playoff games: they don't change the standings.

## 4. Fix a wrong score

Either submit the form again for the same game (same date, home and away team): the **newest** answer
(lowest row) replaces the old one. Or open the Scores tab and correct or delete the wrong row.

## 5. Add or rename a team

The **Teams** page shows the `teams` list in **config.js**: add, remove or rename teams there.
Team names in the Games and Scores tabs must match those names (capital letters and extra spaces don't matter).
The **Teams** tab of the sheet only needs a `Team` column.

## 6. Set up the playoffs

Fill in the **Playoffs** tab: `Round | Game | Team A | Score A | Team B | Score B`.
- One row per game. Rounds appear left to right in the order they first appear (e.g. Semifinal, then Final).
- Number games 1, 2, 3… in each round. Games 1 and 2 feed Game 1 of the next round, 3 and 4 feed Game 2, and so on.
- Leave the scores empty: the site uses the score form answers between those two teams. Type Score A and
  Score B yourself only to override.
- The bracket appears on the Standings page as soon as this tab has rows. The final's winner is shown as Champion.

## 7. Change a setting

Open **config.js**. Every setting has a note above it. Change only the text inside the quote marks and
keep the commas. Dates are written `YYYY-MM-DD`. Things you'll likely change: the team list, team fees, tiebreaks and code of conduct.

The logo is `logo.png`. To replace it, upload a new picture with the same name (or a new name, and change `logo:` in config.js to match).
(The small icons `favicon.png`, `apple-touch-icon.png` and the sharing picture `og-image.png` are made from
the logo. If you change the logo, ask for new versions of these too.)

## What's in this folder

| File | What it is |
| --- | --- |
| index.html, schedule.html, standings.html, teams.html, info.html | The 5 pages (no need to edit) |
| rules.pdf, constitution.pdf | League rules and constitution, linked from the League Information page. To update one, upload a new PDF with the same name. |
| config.js | **Your settings** |
| style.css | Look and colours (colours are at the top) |
| site.js, league.js, pages.js | The workings (no need to edit) |
| logo.png, favicon.png, apple-touch-icon.png, og-image.png | League logo and icons made from it |

No cookies, ads, trackers or analytics.
