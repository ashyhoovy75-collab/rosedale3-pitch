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
  // type its exact file name here (e.g. "logo.png").
  logo: "logo.png",

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


  // ---------- Schedule & scores page ----------

  // Important notice shown just under the "Schedule & scores" title.
  // Email addresses typed here become clickable automatically.
  // Leave empty ("") to hide the notice.
  scoreNotice: "Both teams are required to send in their scores by 9pm on the following Monday. Failure to do so will result in a forfeiture of the game only to the team who did not call in their score. A team is permitted a maximum of 4 forfeitures over the course of the season. Any more than 4 forfeitures will result in that team being ineligible for the year end tournament. Pictures of scores are to be emailed to both Taylor DeCoste & Lindsay Poyton at tdecoste13@gmail.com & poyton05@hotmail.com or via Game Sheets WhatsApp Group.",


  // ---------- Teams ----------

  // The teams shown on the Teams page, in the order you want them listed.
  // One team per line, in quote marks, with a comma after every line but the last.
  teams: [
    "Red Dirt Dusters",
    "Rampage",
    "Choke 'N' Poke",
    "Unstoppables",
    "Dirty Swingers",
    "Bat Intentions",
    "Trotters",
    "I'd Hit That",
    "McGlovins",
    "Tough Glove"
  ],


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

  // One entry per field. "address" is shown on the League Information page and
  // used for the Google Maps link. Leave address empty ("") until you know it.
  venues: [
    { name: "Diamond 1", address: "" },
    { name: "Diamond 2", address: "" },
    { name: "Diamond 3", address: "" }
  ],

  // Text used for the Google Maps link when a diamond has no address yet.
  mapSearchFallback: "Rosedale park baseball diamond",


  // ---------- League Information page ----------

  // The description at the top of the League Information page.
  leagueDescription: "Rosedale Co-Ed Adult 3-Pitch League is a fun, recreational softball league in Hamilton that brings men and women together for Friday nights on the diamond. Whether you're an experienced player or just looking to get out, stay active, meet new people and enjoy some friendly competition, it's a great way to spend your summer evenings!",

  // The next three sections show "Coming soon" while they are empty: [ ]
  // To fill one in, put each item in quote marks between the [ ], one per line,
  // with a comma after every line but the last. Example:
  //   rules: [
  //     "First rule.",
  //     "Second rule."
  //   ],

  // League rules (shown as a numbered list).
  rules: [],

  // League constitution (each line is shown as its own paragraph).
  constitution: [],

  // The constitution as a PDF file in the same folder as the website.
  // Visitors get buttons to open or download it. Leave empty ("") to hide them.
  constitutionFile: "constitution.pdf",

  // Team fees (shown as a list), e.g. "$500 per team, due by May 1".
  teamFees: [],

  // Frequently asked questions on the League Information page.
  faq: [
    { q: "Where do I park?", a: "Free parking is available at the park. Please don't park on the grass or block the lanes. [Confirm parking details]" },
    { q: "Can friends and family watch?", a: "Yes, spectators are always welcome. Please stay behind the fences and away from the foul lines." },
    { q: "What should I bring?", a: "Your glove, running shoes or cleats (no metal spikes), water and sunscreen. Bats and balls are provided." },
    { q: "What happens if it rains?", a: "Cancellations are emailed to team captains at least 2 hours before game time. Rained-out games are rescheduled when possible." }
  ],

  // Code of conduct on the League Information page.
  codeOfConduct: [
    "Play hard, play fair, and have fun. This is a recreational league.",
    "Respect the umpires, the other team, your teammates and spectators.",
    "No abusive language, threats or fighting. Players may be suspended by the convenor.",
    "No alcohol or drugs before or during games, at the diamonds or in the parking lot.",
    "Leave the dugouts and diamonds clean: take your garbage with you."
  ]
};
