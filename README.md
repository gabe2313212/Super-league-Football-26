# ⚽ Super League Soccer

Super League Soccer is a browser-based football management, simulation and card-collection game.

You don't control individual players on the pitch. Instead, you build squads, collect players, simulate matches, earn points and progress through seasons.

---

# 🎮 Game Modes

## Build a Roster

Choose a real club from:

* Premier League
* LaLiga

Then select exactly **6 players** from that club.

Your team plays a **19-match season**.

### Points

* Win = 100 points
* Draw = 50 points
* Loss = 0 points

At the end of the season you receive a season presentation showing:

* Final season
* Matches played
* Wins
* Draws
* Losses
* Total points
* Match results

---

# 🏆 Super Squad

Create your own football club.

Example:

**GABe FC**

Build your club using players collected from Premier League and LaLiga clubs.

You need exactly **11 players** in your Starting XI before you can play.

Your collection is separate from your Starting XI, meaning you can collect players without putting them into your lineup.

---

# 🎯 Difficulty

Super Squad has two difficulties.

## Easy

Opponent rating:

**72–84**

Rewards:

* Win = 100 points
* Draw = 50 points
* Loss = 0 points

## Hard

Opponent rating:

**82–95**

Rewards:

* Win = 200 points
* Draw = 100 points
* Loss = 0 points

Hard mode gives better rewards but stronger opponents.

---

# 📦 Packs

Points are used to purchase player packs.

## Bronze Pack

Cost:

**50 points**

Contains:

**5 cards**

Odds:

* Common — 76%
* Rare — 20%
* Icon — 4%

---

## Gold Pack

Cost:

**100 points**

Contains:

**5 cards**

Odds:

* Common — 60%
* Rare — 30%
* Icon — 10%

---

## Icon Pack

Cost:

**1,000 points**

Contains:

**1 card**

Odds:

* Icon — 100%

---

# ⭐ Card Rarities

## Common

Standard player cards.

## Rare

Higher-tier player cards.

## Icon

Legendary footballers with prime-style ratings.

---

# 👑 Icons

The game contains 30 Icons:

1. Pelé
2. Diego Maradona
3. Johan Cruyff
4. Franz Beckenbauer
5. Paolo Maldini
6. Zinedine Zidane
7. Ronaldo Nazário
8. Ronaldinho
9. Thierry Henry
10. Xavi
11. Andrés Iniesta
12. David Beckham
13. Andrea Pirlo
14. Roberto Carlos
15. Cafu
16. Gianluigi Buffon
17. Iker Casillas
18. Lev Yashin
19. George Best
20. Eusébio
21. Marco van Basten
22. Ruud Gullit
23. Lothar Matthäus
24. Patrick Vieira
25. Luís Figo
26. Kaká
27. Alessandro Del Piero
28. Franco Baresi
29. Sergio Busquets
30. Samuel Eto'o

Icons use prime-style ratings.

---

# 🏟️ Seasons

Both game modes use **19-match seasons**.

Each season tracks:

* Season number
* Match number
* Wins
* Draws
* Losses
* Points
* Match history

After completing all 19 matches, you can view your season presentation and start another season.

---

# 💾 Save System

The game automatically saves progress using browser `localStorage`.

Saved information includes:

* Team name
* Players
* Collection
* Starting XI
* Points
* Coins
* Difficulty
* Season
* Match number
* Wins
* Draws
* Losses
* Match history

The game also has a manual **Save Game** button.

---

# 🔄 Reset

The Settings menu contains a reset option.

Resetting the game removes saved progress and reloads the game.

This should only be used when you want to start again.

---

# 📁 Project Files

The game is split into several files so it is easier to maintain.

```text
super-league-soccer/
│
├── index.html
├── styles.css
├── config.js
├── utils.js
├── api.js
├── game.js
└── README.md
```

---

# 📄 index.html

Contains the game's structure and screens.

It contains:

* Main menu
* Build a Roster
* Super Squad
* Collection
* Match screen
* Season presentation
* Settings
* Modals
* Notifications

---

# 🎨 styles.css

Controls the appearance of the game.

It contains the styling for:

* Menus
* Buttons
* Player cards
* Pack cards
* Collection
* Match screen
* League table
* Season presentation
* Mobile layouts
* Accessibility

---

# ⚙️ config.js

Contains the game's main configuration.

This includes:

* Season length
* Required player counts
* Points
* Pack prices
* Pack odds
* Difficulty settings
* Clubs
* Icons
* Save keys

Keeping these values in one file makes the game easier to balance later.

---

# 🧰 utils.js

Contains reusable helper functions.

Examples include:

* Random number generation
* Rating calculations
* Validation
* Local storage helpers
* HTML escaping
* Team-name filtering
* Player validation

---

# 🌐 api.js

Handles player-data loading.

The game can use player data from the configured football data source.

A fallback player system is also included so the game can continue functioning if external player data isn't available.

---

# 🎮 game.js

This is the main game engine.

It handles:

* Game state
* Menus
* Player selection
* Starting XI
* Matches
* Match simulation
* Points
* Seasons
* Packs
* Collection
* Difficulty
* Presentations
* Saving
* Resetting

---

# 🛡️ Defensive Design

The game is designed to handle common problems safely.

Examples:

* Invalid players are rejected.
* Duplicate players are removed.
* Players cannot exceed lineup limits.
* Build a Roster cannot start without 6 players.
* Super Squad cannot play without 11 players.
* Invalid difficulty values are rejected.
* Invalid pack types are rejected.
* Players are sanitised when loaded.
* Saved data is validated before being used.
* Pack purchases are refunded if pack generation fails.
* Missing HTML elements don't immediately crash the whole game.
* Game progress is automatically saved.

---

# 📱 Responsive Design

The game is designed to work on:

* Desktop
* Laptop
* Tablet
* Mobile

The interface automatically adjusts to smaller screens.

---

# 🔐 API Keys

If an external football API is used, never publish a private API key in a public GitHub repository.

A frontend JavaScript API key can potentially be viewed by users.

For a public production version, the safer architecture is:

```text
Browser
   ↓
Your server
   ↓
Football API
```

rather than:

```text
Browser
   ↓
Football API
```

with a secret key exposed in the browser.

---

# 🚀 Running the Game

Place all project files inside the same folder.

Example:

```text
super-league-soccer/
├── index.html
├── styles.css
├── config.js
├── utils.js
├── api.js
├── game.js
└── README.md
```

Then open `index.html` in your browser.

For the best development experience, run the project through a local web server.

---

# 🏁 Game Loop

## Build a Roster

```text
Main Menu
    ↓
Build a Roster
    ↓
Choose League
    ↓
Choose Club
    ↓
Select 6 Players
    ↓
Start Season
    ↓
Play 19 Matches
    ↓
Earn Points
    ↓
Season Presentation
    ↓
Start New Season
```

---

## Super Squad

```text
Main Menu
    ↓
Super Squad
    ↓
Create Club
    ↓
Earn Points
    ↓
Open Packs
    ↓
Collect Players
    ↓
Build Starting XI
    ↓
Choose Difficulty
    ↓
Play 19 Matches
    ↓
Earn Points
    ↓
Season Presentation
    ↓
Start New Season
    ↓
Keep Collection
```

---

# 🔮 Future Expansion Ideas

The architecture can later support:

* More leagues
* More clubs
* More players
* More Icons
* Player chemistry
* Player positions
* Squad formations
* Injuries
* Suspensions
* Transfers
* Objectives
* Daily rewards
* Achievements
* Leaderboards
* Online multiplayer
* Tournaments
* Champions League-style competitions
* Special event cards
* Limited-time packs
* Player upgrades
* Manager cards
* Stadium upgrades
* Club customisation

---

# ⚽ Super League Soccer

Build your squad.

Collect legends.

Win matches.

Earn points.

Build your Super Squad.
