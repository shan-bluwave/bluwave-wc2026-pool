# FIFA World Cup 2026 - Prediction Pool 🏆

A free, serverless prediction pool for the FIFA World Cup 2026 knockout rounds. Hosted on GitHub Pages with Google Sheets as the backend.

## How It Works

- **Frontend:** Static HTML/CSS/JS hosted free on GitHub Pages
- **Backend:** Google Apps Script (free serverless API)
- **Database:** Google Sheets (free, easy to manage)
- **Cost:** $0. Completely free.

## Setup Guide (15 minutes)

### Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Rename it to "FIFA WC 2026 Pool"
3. Create **4 tabs** (sheets) with these exact names:

#### Tab: `Config`
| A | B |
|---|---|
| activeRound | Round of 32 |

#### Tab: `Matches`
| A | B | C | D |
|---|---|---|---|
| id | round | team1 | team2 |
| 1 | Round of 32 | Team A | Team B |
| 2 | Round of 32 | Team C | Team D |
| ... | ... | ... | ... |

Fill in the actual teams when the knockout bracket is decided.

#### Tab: `Predictions`
| A | B | C | D |
|---|---|---|---|
| userName | round | predictions | timestamp |

(Leave empty - this fills automatically when users submit picks)

#### Tab: `Results`
| A | B | C |
|---|---|---|
| matchId | round | winner |

(You fill this in after each round to update the leaderboard)

### Step 2: Deploy the Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code in the editor
3. Copy-paste the entire contents of `google-apps-script/Code.gs` into the editor
4. Click **Deploy → New deployment**
5. Click the gear icon and select **Web app**
6. Set:
   - Description: "FIFA WC 2026 Pool API"
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**
8. Authorize the app when prompted
9. **Copy the Web app URL** — it looks like: `https://script.google.com/macros/s/XXXXX/exec`

### Step 3: Configure the Website

1. Open `js/config.js`
2. Replace `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` with the URL you copied in Step 2

### Step 4: Deploy to GitHub Pages

1. Create a new GitHub repository (e.g., `fifa-wc-2026-pool`)
2. Push all the files in this project to the repository
3. Go to **Settings → Pages**
4. Under "Source", select **Deploy from a branch**
5. Select **main** branch, root folder `/`
6. Click Save
7. Your site will be live at: `https://yourusername.github.io/fifa-wc-2026-pool/`

### Step 5: Share with Your Team!

Send the GitHub Pages URL to your team. They can access it from any browser, anywhere in the world.

---

## Admin Tasks (You)

### Before each round:
1. Update the `Matches` tab with the correct matchups
2. Update `Config` tab B1 with the active round name
3. Teams will see the new matches on the site

### After each round:
1. Fill in the `Results` tab with match IDs and winning team names
2. The leaderboard auto-calculates based on results

### Example Results entry:
| matchId | round | winner |
|---|---|---|
| 1 | Round of 32 | Brazil |
| 2 | Round of 32 | France |

---

## Points System

| Round | Matches | Points/Correct | Max Points |
|---|---|---|---|
| Round of 32 | 16 | 2 | 32 |
| Round of 16 | 8 | 4 | 32 |
| Quarter-Finals | 4 | 8 | 32 |
| Semi-Finals | 2 | 16 | 32 |
| Final | 1 | 32 | 32 |
| **Total** | **31** | | **160** |

---

## Project Structure

```
├── index.html          # Home page
├── predictions.html    # Make/update predictions
├── leaderboard.html    # Live leaderboard
├── rules.html          # Rules & scoring
├── css/
│   └── styles.css      # Custom styles
├── js/
│   ├── config.js       # Configuration (API URL, points)
│   └── api.js          # API service layer
├── google-apps-script/
│   └── Code.gs         # Backend code (deploy to Apps Script)
└── README.md           # This file
```

---

## FAQ

**Q: Do team members need a Google account?**
A: No. Anyone with the link can submit predictions.

**Q: Can someone cheat by changing their name?**
A: This is a fun office pool — it's honor-based. If needed, you can check the Predictions tab for duplicates.

**Q: What if a team member joins late?**
A: No problem! They just miss the points for rounds already completed.

**Q: Can I update my picks?**
A: Yes, you can update anytime before the round deadline.
