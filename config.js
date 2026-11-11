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

  // Email address for questions.
  contactEmail: "r3pconvenor@gmail.com",


  // ---------- Season dates (YYYY-MM-DD) ----------

  // First game day: the home page counts down to this day.
  firstGameDay: "2027-05-28",

  // Last REGULAR-SEASON game day. Scores dated AFTER this day are treated as
  // playoff games: they don't count in the standings and feed the bracket.
  lastRegularSeasonDay: "2027-09-10",



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


  // ---------- Diamonds (where games are played) ----------

  // One entry per field. The names are shown on the home page.
  venues: [
    { name: "Diamond 1" },
    { name: "Diamond 2" },
    { name: "Diamond 3" }
  ],


  // ---------- League Information page ----------

  // The description at the top of the League Information page.
  leagueDescription: "Rosedale Co-Ed Adult 3-Pitch League is a fun, recreational softball league in Hamilton that brings men and women together for Friday nights on the diamond. Whether you're an experienced player or just looking to get out, stay active, meet new people and enjoy some friendly competition, it's a great way to spend your summer evenings!",

  // Each PDF below must be in the same folder as the website.
  // Visitors get buttons to open or download it. Leave empty ("") to hide them.

  // The league rules as a PDF.
  rulesFile: "rules.pdf",

  // The league constitution as a PDF.
  constitutionFile: "constitution.pdf",

  // Team fees (shown as a list), e.g. "$500 per team, due by May 1".
  // While the list is empty [ ], the page shows "Coming soon".
  teamFees: [],

  // Standings and tiebreaks, from the league rules (page 5).
  standingsTiebreakers: [
    "Points earned",
    "Winning percentage",
    "Head to head",
    "Plus/minus"
  ],
  tournamentTiebreakers: [
    "Games won",
    "Head to head",
    "Plus/minus",
    "Runs allowed"
  ],
  tiebreakNote: "Playoff and tournament games are to be played out until the winning team meets the plus 7 maximum run differential. The highest-ranking team at the end of the regular season has home team privileges.",

  // Code of conduct, from the league rules.
  codeOfConduct: [
    "The drinking of alcoholic beverages and the use of violence is strictly prohibited in public parks, in accordance with Parks By-law #77-221 and the City of Hamilton zero tolerance policy.",
    "By submitting a roster, the team representative confirms that all listed players have read and agree to abide by the City of Hamilton zero tolerance policy.",
    "Any disciplinary action taken against a rostered player under this policy may also lead to sanctions against the team representative, at the discretion of the Executive Council.",
    "All discussions about plays and rules during a game are decided by the umpire, involving the team reps only when necessary. Players are not to leave the bench area or their position to get involved."
  ],

  // City of Hamilton zero tolerance (RZone) box in the Code of conduct section.
  // cityPolicyQuote is the City's exact wording, shown in quotation marks.
  cityPolicyTitle: "Zero tolerance to violence: City of Hamilton RZone policy",
  cityPolicyQuote: "a zero-tolerance approach to violence, abuse and other inappropriate behaviours",
  cityPolicyText: [
    "Rosedale 3 Pitch follows the City of Hamilton RZone Respectful Environments Policy, which applies at all City facilities and properties, including the parks and diamonds where we play. RZone stands for respect for yourself, respect for others and responsibility for your actions.",
    "Under the policy, all forms of violence, vandalism and inappropriate behaviour are unacceptable. Depending on how serious it is, anyone who breaks the policy may be removed from City property right away, given a letter of warning and/or banned from a facility. Incidents should be reported within 24 hours, to City staff or online."
  ],
  cityPolicyLink: "https://www.hamilton.ca/city-council/plans-strategies/strategies/rzone-respectful-environments"
};
