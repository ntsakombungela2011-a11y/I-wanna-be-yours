# Journey Birthday Website Template

An animated, train-themed birthday website that takes the recipient on a journey through shared memories, ending with a personal letter and confetti.

## Demo Flow

1. **Lock screen** — Visitor enters a passphrase to prove they're the intended recipient
2. **Ticket** — A greeting and animated train ticket with "VALIDATED" stamp
3. **Departure board** — Split-flap style board; clicking the main row triggers a train animation
4. **5 Postcard stops** — Each card shows a date, location stamp, title, and handwritten reflection
5. **Final destination** — An envelope the visitor taps to reveal a personal letter + confetti

Navigation: arrow buttons, keyboard arrows, swipe on mobile, or clickable dots in the top navbar.

## Quick Start

1. Clone or download this folder
2. Open a terminal in the folder and run:
   ```
   python3 -m http.server 8080
   ```
3. Open `http://localhost:8080` in your browser
4. Enter `password` to unlock (or type `skip` to jump straight to stop 1)

## How to Customize

**All your content lives in one file: `config.js`**

Open `config.js` and edit the values. The field names match placeholder text visible in the HTML, so you can always search `index.html` for a field name to see where it renders.

### Fields Reference

| Field | What it controls |
|-------|-----------------|
| `passphraseHint` | The hint shown on the lock screen (e.g., "Everything in moderation...") |
| `password` | The word the visitor must type (checked with `.includes()`, case-insensitive) |
| `bypass` | A secret word that skips the ticket + board, jumping to stop 1 |
| `ticketGreeting` | The large handwritten greeting before the ticket appears |
| `ticketPassenger` | Name on the ticket |
| `ticketDate` | Date on the ticket |
| `ticketClass` | Class on the ticket (e.g., "FIRST", "VIP") |
| `expressName` | The train name on the departure board (the clickable row) |
| `finalDestinationTitle` | Heading shown at the letter scene |
| `finalDestinationSubtitle` | Subtitle below the heading |
| `stops[]` | Array of 5 objects, each with `day`, `month`, `stampLocation`, `title`, `reflection` |
| `letterHeading` | The heading inside the letter |
| `letterParagraphs[]` | Array of strings — each becomes a paragraph in the letter |
| `letterSignoff` | The sign-off line at the bottom of the letter |
| `footerLine` | The witty line in the footer |
| `footerCopyright` | Copyright line |
| `pageTitle` | Browser tab title |
| `faviconInitials` | 2-character initials in the browser tab icon |

### Changing the Favicon Initials

The favicon is an inline SVG in `index.html`. Search for `faviconInitials` — you'll see the `<text>` element. The `config.js` value is applied as the page title, but the favicon SVG text must be edited directly in the HTML (SVG in `href` can't be scripted). Just replace the two letters between `>` and `</text>`.

### Swapping Images

| File | Purpose | How to replace |
|------|---------|----------------|
| `v2_wallpaper.png` | Background texture (shows through at low opacity) | Replace with any image; works best at ~1200px wide with a soft/illustrated style |
| `union_pacific_4014_right_facing_transparent.png` | The train that crosses the screen between stops | Any right-facing transparent PNG; ~550px wide works well |
| `NavbarIcon.png` | Small train in the progress bar (CSS flips it) | Any small silhouette, transparent background |
| `foxglove-corner.svg` | Decorative corners on the letter | Any corner decoration SVG; rotated 180° for bottom-right |

### Adding or Removing Stops

The template has 5 stops hardcoded in the HTML. To change the number:

1. In `index.html`: duplicate or remove `<section id="scene-stop-N">` blocks
2. In `index.html`: add/remove `<span class="nav-stop">` dots in the navbar
3. In `script.js`: update the `scenes` array and `stopIndices` / `totalStops` values
4. In `config.js`: add/remove entries from the `stops[]` array

## Required Files

All files must be in the same directory:

- `index.html` — page structure
- `styles.css` — all styling
- `script.js` — animations and interactions
- `config.js` — your customizable content
- `v2_wallpaper.png` — background image
- `union_pacific_4014_right_facing_transparent.png` — train animation
- `NavbarIcon.png` — progress bar train icon
- `foxglove-corner.svg` — letter corner decorations

## Design Notes

- **Color palette**: Cream, gold accents, slate ink — edit CSS variables in `:root` at the top of `styles.css`
- **Fonts**: Playfair Display (headings), Caveat (handwritten text), Inter (body), Space Mono (departure board)
- **Accessibility**: Supports keyboard navigation, `prefers-reduced-motion`, ARIA labels, and focus-visible outlines
- **Mobile**: Fully responsive with swipe navigation

## Hosting

For sharing with someone:
- **Locally**: `python3 -m http.server 8080` (or any static file server)
- **GitHub Pages**: Push to a repo, enable Pages in Settings → serves from `main` branch
- **Netlify/Vercel**: Drag and drop the folder — zero config needed
- **Any static host**: Just upload all the files listed above

## License

MIT — use it however you like.
