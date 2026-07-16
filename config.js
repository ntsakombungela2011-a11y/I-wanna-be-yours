/**
 * ============================================================
 * CONFIGURATION FILE
 * ============================================================
 * Edit the values below to customize the website for your
 * recipient. Field names here match the placeholder text
 * in index.html, so you can search for them to see where
 * they appear.
 *
 * After editing, just refresh the browser to see changes.
 * ============================================================
 */

const CONFIG = {

  // --- Lock Screen ---
  // The passphrase hint shown to the visitor (e.g., "Everything in moderation...")
  passphraseHint: "Hint: the password is \"password\"",

  // The word/phrase the visitor must type (case-insensitive, checked with .includes())
  password: "password",

  // A bypass word that skips the ticket + departure board and jumps to stop 1
  bypass: "skip",

  // --- Ticket Screen ---
  // The greeting that appears before the ticket (e.g., "Hey there!")
  ticketGreeting: "Hey there!",

  // Ticket details
  ticketPassenger: "Jane Doe",
  ticketDate: "1 JAN 2026",
  ticketClass: "FIRST",

  // --- Departure Board ---
  // The name of the main "express" train (appears on the board as the clickable row)
  expressName: "BIRTHDAY EXPRESS",

  // Final destination heading (shown at the letter scene)
  finalDestinationTitle: "Final Destination: Your Special Day",
  finalDestinationSubtitle: "Hope you enjoyed the ride!",

  // --- Stops (Postcards) ---
  // Each stop has: day, month, stampLocation, title, reflection
  stops: [
    {
      day: "1",
      month: "JAN",
      stampLocation: "The Coffee Shop",
      title: "The First Meeting",
      reflection: "Write about your first memory together. What stood out? What made it special? This is where your story begins."
    },
    {
      day: "14",
      month: "FEB",
      stampLocation: "The Park",
      title: "The Adventure",
      reflection: "Describe a shared adventure or outing. What happened? What did you discover about each other? Paint the scene with your words."
    },
    {
      day: "10",
      month: "MAR",
      stampLocation: "The Kitchen",
      title: "The Quiet Moment",
      reflection: "Write about a small, everyday moment that meant something. Not every memory needs to be grand — sometimes the ordinary ones are the most meaningful."
    },
    {
      day: "22",
      month: "APR",
      stampLocation: "The Rooftop",
      title: "The Turning Point",
      reflection: "Describe a moment when something shifted — when your relationship deepened, or you saw them in a new light. What changed?"
    },
    {
      day: "5",
      month: "MAY",
      stampLocation: "The Beach",
      title: "The Road Trip",
      reflection: "Write about a journey you took together — literal or figurative. Where did you end up? What made it memorable?"
    }
  ],

  // --- Letter (Final Envelope) ---
  letterHeading: "Happy Birthday!",

  // Each string in this array becomes its own paragraph
  letterParagraphs: [
    "Write your opening here. Set the tone — playful, heartfelt, or a mix of both.",
    "Share something you admire about them. Be specific — the details are what make it personal.",
    "Tell them about a quality of theirs that surprised you, or something they do that always makes you smile.",
    "Write your birthday wish. What do you hope for them this year?",
  ],

  // The sign-off line (e.g., "Love, Your Name")
  letterSignoff: "With love, [Your Name]",

  // --- Footer ---
  footerLine: "Made with care and caffeine.",
  footerCopyright: "© 2026 • All feelings reserved.",

  // --- Page Title & Favicon ---
  pageTitle: "Happy Birthday",
  // Favicon initials shown in the browser tab (2 characters max)
  faviconInitials: "HB",
};
