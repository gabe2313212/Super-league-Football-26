
/* =========================================================
   SUPER LEAGUE SOCCER
   config.js
   Central game configuration
   ========================================================= */

"use strict";

const GAME_CONFIG = Object.freeze({

    // ---------------------------------------------------------
    // GAME
    // ---------------------------------------------------------
    VERSION: "1.0.0",
    GAME_NAME: "Super League Soccer",

    SEASON: Object.freeze({
        MATCHES: 19
    }),

    // ---------------------------------------------------------
    // BUILD A ROSTER
    // ---------------------------------------------------------
    BUILD_ROSTER: Object.freeze({
        REQUIRED_PLAYERS: 6,

        POINTS: Object.freeze({
            WIN: 100,
            DRAW: 50,
            LOSS: 0
        })
    }),

    // ---------------------------------------------------------
    // SUPER SQUAD
    // ---------------------------------------------------------
    SUPER_SQUAD: Object.freeze({
        REQUIRED_PLAYERS: 11,

        DIFFICULTY: Object.freeze({
            EASY: Object.freeze({
                ID: "easy",
                NAME: "Easy",
                MIN_OPPONENT_RATING: 72,
                MAX_OPPONENT_RATING: 84,
                WIN_POINTS: 100,
                DRAW_POINTS: 50,
                LOSS_POINTS: 0
            }),

            HARD: Object.freeze({
                ID: "hard",
                NAME: "Hard",
                MIN_OPPONENT_RATING: 82,
                MAX_OPPONENT_RATING: 95,
                WIN_POINTS: 200,
                DRAW_POINTS: 100,
                LOSS_POINTS: 0
            })
        })
    }),

    // ---------------------------------------------------------
    // PACKS
    // ---------------------------------------------------------
    PACKS: Object.freeze({

        BRONZE: Object.freeze({
            ID: "bronze",
            NAME: "Bronze Pack",
            COST: 50,
            CARDS: 5,
            ODDS: Object.freeze({
                ICON: 4,
                RARE: 20,
                COMMON: 76
            })
        }),

        GOLD: Object.freeze({
            ID: "gold",
            NAME: "Gold Pack",
            COST: 100,
            CARDS: 5,
            ODDS: Object.freeze({
                ICON: 10,
                RARE: 30,
                COMMON: 60
            })
        }),

        ICON: Object.freeze({
            ID: "icon",
            NAME: "Icon Pack",
            COST: 1000,
            CARDS: 1,
            ODDS: Object.freeze({
                ICON: 100,
                RARE: 0,
                COMMON: 0
            })
        })
    }),

    // ---------------------------------------------------------
    // RARITIES
    // ---------------------------------------------------------
    RARITIES: Object.freeze({
        COMMON: "Common",
        RARE: "Rare",
        ICON: "Icon"
    }),

    // ---------------------------------------------------------
    // LEAGUES
    // ---------------------------------------------------------
    LEAGUES: Object.freeze({
        PREMIER_LEAGUE: "Premier League",
        LALIGA: "LaLiga"
    }),

    // ---------------------------------------------------------
    // PREMIER LEAGUE CLUBS
    // ---------------------------------------------------------
    PREMIER_LEAGUE_CLUBS: Object.freeze([
        "Arsenal",
        "Aston Villa",
        "Bournemouth",
        "Brentford",
        "Brighton",
        "Chelsea",
        "Crystal Palace",
        "Everton",
        "Fulham",
        "Ipswich Town",
        "Leicester City",
        "Liverpool",
        "Manchester City",
        "Manchester United",
        "Newcastle United",
        "Nottingham Forest",
        "Southampton",
        "Tottenham Hotspur",
        "West Ham United",
        "Wolverhampton Wanderers"
    ]),

    // ---------------------------------------------------------
    // LALIGA CLUBS
    // ---------------------------------------------------------
    LALIGA_CLUBS: Object.freeze([
        "Athletic Club",
        "Atlético Madrid",
        "Barcelona",
        "Celta Vigo",
        "Espanyol",
        "Getafe",
        "Girona",
        "Las Palmas",
        "Leganés",
        "Mallorca",
        "Osasuna",
        "Rayo Vallecano",
        "Real Betis",
        "Real Madrid",
        "Real Sociedad",
        "Sevilla",
        "Valencia",
        "Valladolid",
        "Villarreal"
    ]),

    // ---------------------------------------------------------
    // ICON PLAYERS
    // Prime-style ratings
    // ---------------------------------------------------------
    ICONS: Object.freeze([
        {
            id: "icon_pele",
            name: "Pelé",
            position: "ST",
            rating: 98,
            rarity: "Icon",
            club: "Brazil"
        },
        {
            id: "icon_maradona",
            name: "Diego Maradona",
            position: "CAM",
            rating: 98,
            rarity: "Icon",
            club: "Argentina"
        },
        {
            id: "icon_cruyff",
            name: "Johan Cruyff",
            position: "CF",
            rating: 97,
            rarity: "Icon",
            club: "Netherlands"
        },
        {
            id: "icon_beckenbauer",
            name: "Franz Beckenbauer",
            position: "CB",
            rating: 97,
            rarity: "Icon",
            club: "Germany"
        },
        {
            id: "icon_maldini",
            name: "Paolo Maldini",
            position: "LB",
            rating: 97,
            rarity: "Icon",
            club: "Italy"
        },
        {
            id: "icon_zidane",
            name: "Zinedine Zidane",
            position: "CAM",
            rating: 97,
            rarity: "Icon",
            club: "France"
        },
        {
            id: "icon_ronaldo",
            name: "Ronaldo Nazário",
            position: "ST",
            rating: 97,
            rarity: "Icon",
            club: "Brazil"
        },
        {
            id: "icon_ronaldinho",
            name: "Ronaldinho",
            position: "LW",
            rating: 96,
            rarity: "Icon",
            club: "Brazil"
        },
        {
            id: "icon_henry",
            name: "Thierry Henry",
            position: "ST",
            rating: 96,
            rarity: "Icon",
            club: "France"
        },
        {
            id: "icon_xavi",
            name: "Xavi",
            position: "CM",
            rating: 95,
            rarity: "Icon",
            club: "Spain"
        },
        {
            id: "icon_iniesta",
            name: "Andrés Iniesta",
            position: "CM",
            rating: 96,
            rarity: "Icon",
            club: "Spain"
        },
        {
            id: "icon_beckham",
            name: "David Beckham",
            position: "RM",
            rating: 94,
            rarity: "Icon",
            club: "England"
        },
        {
            id: "icon_pirlo",
            name: "Andrea Pirlo",
            position: "CM",
            rating: 95,
            rarity: "Icon",
            club: "Italy"
        },
        {
            id: "icon_roberto_carlos",
            name: "Roberto Carlos",
            position: "LB",
            rating: 95,
            rarity: "Icon",
            club: "Brazil"
        },
        {
            id: "icon_cafu",
            name: "Cafu",
            position: "RB",
            rating: 95,
            rarity: "Icon",
            club: "Brazil"
        },
        {
            id: "icon_buffon",
            name: "Gianluigi Buffon",
            position: "GK",
            rating: 96,
            rarity: "Icon",
            club: "Italy"
        },
        {
            id: "icon_casillas",
            name: "Iker Casillas",
            position: "GK",
            rating: 95,
            rarity: "Icon",
            club: "Spain"
        },
        {
            id: "icon_yashin",
            name: "Lev Yashin",
            position: "GK",
            rating: 97,
            rarity: "Icon",
            club: "Soviet Union"
        },
        {
            id: "icon_best",
            name: "George Best",
            position: "RW",
            rating: 96,
            rarity: "Icon",
            club: "Northern Ireland"
        },
        {
            id: "icon_eusebio",
            name: "Eusébio",
            position: "ST",
            rating: 97,
            rarity: "Icon",
            club: "Portugal"
        },
        {
            id: "icon_van_basten",
            name: "Marco van Basten",
            position: "ST",
            rating: 96,
            rarity: "Icon",
            club: "Netherlands"
        },
        {
            id: "icon_gullit",
            name: "Ruud Gullit",
            position: "CF",
            rating: 95,
            rarity: "Icon",
            club: "Netherlands"
        },
        {
            id: "icon_matthaus",
            name: "Lothar Matthäus",
            position: "CM",
            rating: 95,
            rarity: "Icon",
            club: "Germany"
        },
        {
            id: "icon_vieira",
            name: "Patrick Vieira",
            position: "CDM",
            rating: 95,
            rarity: "Icon",
            club: "France"
        },
        {
            id: "icon_figo",
            name: "Luís Figo",
            position: "RW",
            rating: 95,
            rarity: "Icon",
            club: "Portugal"
        },
        {
            id: "icon_kaka",
            name: "Kaká",
            position: "CAM",
            rating: 96,
            rarity: "Icon",
            club: "Brazil"
        },
        {
            id: "icon_del_piero",
            name: "Alessandro Del Piero",
            position: "CF",
            rating: 95,
            rarity: "Icon",
            club: "Italy"
        },
        {
            id: "icon_baresi",
            name: "Franco Baresi",
            position: "CB",
            rating: 96,
            rarity: "Icon",
            club: "Italy"
        },
        {
            id: "icon_busquets",
            name: "Sergio Busquets",
            position: "CDM",
            rating: 94,
            rarity: "Icon",
            club: "Spain"
        },
        {
            id: "icon_etoo",
            name: "Samuel Eto'o",
            position: "ST",
            rating: 95,
            rarity: "Icon",
            club: "Cameroon"
        }
    ]),

    // ---------------------------------------------------------
    // DEFAULTS
    // ---------------------------------------------------------
    DEFAULTS: Object.freeze({
        STARTING_POINTS: 0,
        STARTING_COINS: 0,
        STARTING_SEASON: 1,
        STARTING_MATCH: 1,
        DEFAULT_DIFFICULTY: "easy",
        DEFAULT_LEAGUE: "Premier League"
    }),

    // ---------------------------------------------------------
    // STORAGE KEYS
    // ---------------------------------------------------------
    STORAGE_KEYS: Object.freeze({
        BUILD_ROSTER: "buildRoster_gameState",
        SUPER_SQUAD: "superSquad_gameState"
    }),

    // ---------------------------------------------------------
    // TEAM NAME RULES
    // ---------------------------------------------------------
    TEAM_NAME: Object.freeze({
        MIN_LENGTH: 2,
        MAX_LENGTH: 24
    }),

    // ---------------------------------------------------------
    // MATCH SETTINGS
    // ---------------------------------------------------------
    MATCH: Object.freeze({
        MIN_GOALS: 0,
        MAX_GOALS: 8,
        MIN_MINUTE: 1,
        MAX_MINUTE: 90
    })
});


// ============================================================
// SAFETY VALIDATION
// ============================================================

(function validateGameConfig() {

    function assert(condition, message) {
        if (!condition) {
            throw new Error("GAME_CONFIG ERROR: " + message);
        }
    }

    assert(
        GAME_CONFIG.SEASON.MATCHES > 0,
        "Season must contain at least one match."
    );

    assert(
        GAME_CONFIG.BUILD_ROSTER.REQUIRED_PLAYERS === 6,
        "Build a Roster must require exactly 6 players."
    );

    assert(
        GAME_CONFIG.SUPER_SQUAD.REQUIRED_PLAYERS === 11,
        "Super Squad must require exactly 11 players."
    );

    const packs = [
        GAME_CONFIG.PACKS.BRONZE,
        GAME_CONFIG.PACKS.GOLD,
        GAME_CONFIG.PACKS.ICON
    ];

    packs.forEach(function (pack) {

        const totalOdds =
            pack.ODDS.COMMON +
            pack.ODDS.RARE +
            pack.ODDS.ICON;

        assert(
            totalOdds === 100,
            pack.NAME + " odds must total exactly 100%."
        );

        assert(
            Number.isInteger(pack.COST) && pack.COST >= 0,
            pack.NAME + " has an invalid cost."
        );

        assert(
            Number.isInteger(pack.CARDS) && pack.CARDS > 0,
            pack.NAME + " has an invalid card count."
        );
    });

    assert(
        GAME_CONFIG.ICONS.length === 30,
        "There must be exactly 30 Icon players."
    );

    const iconIds = new Set();

    GAME_CONFIG.ICONS.forEach(function (icon) {

        assert(
            icon.id &&
            icon.name &&
            icon.position &&
            icon.club,
            "Every Icon must have complete player information."
        );

        assert(
            Number.isFinite(icon.rating) &&
            icon.rating >= 1 &&
            icon.rating <= 100,
            icon.name + " has an invalid rating."
        );

        assert(
            !iconIds.has(icon.id),
            "Duplicate Icon ID detected: " + icon.id
        );

        iconIds.add(icon.id);
    });

    assert(
        GAME_CONFIG.PREMIER_LEAGUE_CLUBS.length === 20,
        "Premier League club list must contain 20 clubs."
    );

    assert(
        GAME_CONFIG.LALIGA_CLUBS.length === 19,
        "LaLiga club list must contain 19 clubs."
    );

    console.log(
        GAME_CONFIG.GAME_NAME +
        " configuration loaded successfully. Version " +
        GAME_CONFIG.VERSION
    );

})();
```
