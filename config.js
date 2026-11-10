/* =====================================================================
   LEAGUE SETTINGS  —  the only file you need to edit.

   How to edit safely:
   - Change only the text between the quote marks "like this".
   - Keep every comma at the end of a line exactly where it is.
   - Lines starting with // are notes for you; the website ignores them.
   - Dates are always written YYYY-MM-DD (year-month-day), e.g. "2027-05-28".
   ===================================================================== */

window.LEAGUE = {

  // ---------- About the league ----------

  // Full league name (big headline on the home page, browser tab titles).
  name: "Rosedale Adult 3 Pitch",

  // Short name shown next to the logo in the top menu bar.
  shortName: "3 Pitch",

  // One-line description under the headline.
  tagline: "Adult Rosedale 3-Pitch League",

  // Name of the season, shown on the home page.
  seasonName: "Summer 2027",

  // Where games are played (shown on the home page).
  locationSummary: "Rosedale",

  // Logo picture file. Put the picture in the same folder as this file and
  // type its exact file name here (e.g. "logo.png"). A placeholder is included.
  logo: "logo.svg",

  // Email address for questions and registration.
  contactEmail: "r3pconvenor@gmail.com",


  // ---------- Season dates (YYYY-MM-DD) ----------

  // First game day: the home page counts down to this day.
  firstGameDay: "2027-05-28",

  // Last REGULAR-SEASON game day. Scores dated AFTER this day are treated as
  // playoff games: they don't count in the standings and feed the bracket.
  lastRegularSeasonDay: "2027-09-10",

  // Last day to register a team.
  registrationDeadline: "2027-05-01",


  // ---------- Your Google Sheet ----------

  // How your Google Sheet writes dates.
  //   "M/D/YYYY" means 1/9/2027 = January 9, 2027   (your setting)
  //   "D/M/YYYY" means 1/9/2027 = 1 September 2027
  // Dates written like 2027-01-09 always work too.
  sheetDateStyle: "M/D/YYYY",

  // One link per tab. Most reliable: in Google Sheets choose
  // File > Share > Publish to web > pick the tab > "Comma-separated values (.csv)"
  // > Publish, and paste that link here (one different link per tab).
  // A normal "share" link (ending in /edit...) also works as long as the sheet is
  // shared as "Anyone with the link can view": the website then finds each tab
  // by its name, written in sheetTabNames below.
  // Leave a link empty ("") to show a friendly "coming soon" message instead.
  sheetLinks: {
    teams:    "https://docs.google.com/spreadsheets/d/1L-FZELy4m6t8nnPF3OfGPKFBwynMeba3JBj_PaWDoA0/edit?usp=sharing",
    games:    "https://docs.google.com/spreadsheets/d/1L-FZELy4m6t8nnPF3OfGPKFBwynMeba3JBj_PaWDoA0/edit?usp=sharing",
    playoffs: "https://docs.google.com/spreadsheets/d/1L-FZELy4m6t8nnPF3OfGPKFBwynMeba3JBj_PaWDoA0/edit?usp=sharing",
    scores:   "https://docs.google.com/spreadsheets/d/1L-FZELy4m6t8nnPF3OfGPKFBwynMeba3JBj_PaWDoA0/edit?usp=sharing"
  },

  // The exact names of the tabs at the bottom of your Google Sheet.
  // Only used with the normal "share" links above. If your score form answers
  // land in a tab called "Form Responses 1", type that name for scores.
  sheetTabNames: {
    teams:    "Teams",
    games:    "Games",
    playoffs: "Playoffs",
    scores:   "Scores"
  },


  // ---------- Registration ----------

  // Your registration Google Form link. Paste either the normal link
  // (ending in /viewform) or the embed link (ending in ?embedded=true).
  // Leave empty ("") to show "Registration opens soon".
  registrationFormLink: "",

  // Team fee, shown on the Register page.
  teamFee: "$[fee] per team",

  // Who can play, shown on the Register page.
  whoCanPlay: "Adults 18 and over. Co-ed and open teams welcome.",

  // Steps to register, shown in order on the Register page.
  registrationSteps: [
    "Pick a team name and a team captain.",
    "Fill in the registration form below (one form per team).",
    "Pay the team fee. We'll email the captain how to pay.",
    "Once we receive payment, your team shows as Confirmed on the Teams page."
  ],


  // ---------- Divisions ----------

  // Division names, in the order you want them shown.
  // They must match the "Division" column of your Teams tab
  // (capital letters and extra spaces don't matter).
  // With only one division, the division buttons are hidden.
  divisions: ["Competitive", "Recreational"],

  // Maximum number of teams per division. When a division is full, the Teams
  // page says new registrations go on a waitlist.
  maxTeamsPerDivision: 8,


  // ---------- Diamonds (where games are played) ----------

  // One entry per field. "address" is shown on the League info page and
  // used for the Google Maps link. Leave address empty ("") until you know it.
  venues: [
    { name: "Diamond 1", address: "" },
    { name: "Diamond 2", address: "" },
    { name: "Diamond 3", address: "" }
  ],

  // Text used for the Google Maps link when a diamond has no address yet.
  mapSearchFallback: "Rosedale park baseball diamond",


  // ---------- League info page ----------

  // League rules (placeholder — replace with your own). One rule per line.
  rules: [
    "Each batter gets a maximum of 3 pitches, thrown by a player from their own team.",
    "A foul ball on the third pitch is an out. A ball not put in play after 3 pitches is an out.",
    "No walks, no bunting and no stealing. Runners may not leave the base until the ball is hit.",
    "Games are 7 innings or 75 minutes, whichever comes first. No new inning starts after 70 minutes.",
    "Teams need at least 8 players to start a game. A team that can't field 8 players 15 minutes after start time forfeits.",
    "Home team keeps the official score and submits it with the score form the same day.",
    "Mercy rule: a game ends when a team leads by 15 or more runs after 5 innings."
  ],

  // Frequently asked questions on the League info page.
  faq: [
    { q: "Where do I park?", a: "Free parking is available at the park. Please don't park on the grass or block the lanes. [Confirm parking details]" },
    { q: "Can friends and family watch?", a: "Yes, spectators are always welcome. Please stay behind the fences and away from the foul lines." },
    { q: "What should I bring?", a: "Your glove, running shoes or cleats (no metal spikes), water and sunscreen. Bats and balls are provided." },
    { q: "What happens if it rains?", a: "Cancellations are emailed to team captains at least 2 hours before game time. Rained-out games are rescheduled when possible." }
  ],

  // Code of conduct on the League info page.
  codeOfConduct: [
    "Play hard, play fair, and have fun. This is a recreational league.",
    "Respect the umpires, the other team, your teammates and spectators.",
    "No abusive language, threats or fighting. Players may be suspended by the convenor.",
    "No alcohol or drugs before or during games, at the diamonds or in the parking lot.",
    "Leave the dugouts and diamonds clean: take your garbage with you."
  ]
};
