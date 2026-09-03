```javascript
/* =========================================================
   SUPER LEAGUE SOCCER
   api.js
   Player / club data layer
   ========================================================= */

"use strict";

/*
 * IMPORTANT:
 *
 * This game can run WITHOUT an API key.
 *
 * When an API is unavailable, the game automatically uses
 * safe built-in player data.
 *
 * This prevents the game from becoming unusable because of:
 * - missing API keys
 * - API downtime
 * - network errors
 * - rate limits
 * - invalid responses
 */


/* =========================================================
   API CONFIGURATION
   ========================================================= */

const API_CONFIG = Object.freeze({

    ENABLED: false,

    BASE_URL: "https://v3.football.api-sports.io",

    API_KEY: "",

    TIMEOUT: 8000,

    HEADERS: Object.freeze({
        "x-apisports-key": ""
    })

});


/* =========================================================
   FALLBACK PLAYER DATABASE
   ========================================================= */

/*
 * These players guarantee that the game can operate even
 * without an external football API.
 *
 * More players can be added later without changing the
 * rest of the game.
 */

const FALLBACK_PLAYERS = Object.freeze([

    // ---------------------------------------------------------
    // ARSENAL
    // ---------------------------------------------------------

    {
        id: "arsenal_saka",
        name: "Bukayo Saka",
        position: "RW",
        rating: 87,
        club: "Arsenal",
        rarity: "Rare"
    },

    {
        id: "arsenal_odegaard",
        name: "Martin Ødegaard",
        position: "CAM",
        rating: 88,
        club: "Arsenal",
        rarity: "Rare"
    },

    {
        id: "arsenal_rice",
        name: "Declan Rice",
        position: "CM",
        rating: 87,
        club: "Arsenal",
        rarity: "Rare"
    },

    {
        id: "arsenal_saliba",
        name: "William Saliba",
        position: "CB",
        rating: 87,
        club: "Arsenal",
        rarity: "Rare"
    },

    {
        id: "arsenal_martinelli",
        name: "Gabriel Martinelli",
        position: "LW",
        rating: 84,
        club: "Arsenal",
        rarity: "Common"
    },

    {
        id: "arsenal_raya",
        name: "David Raya",
        position: "GK",
        rating: 84,
        club: "Arsenal",
        rarity: "Common"
    },


    // ---------------------------------------------------------
    // ASTON VILLA
    // ---------------------------------------------------------

    {
        id: "villa_watkins",
        name: "Ollie Watkins",
        position: "ST",
        rating: 86,
        club: "Aston Villa",
        rarity: "Rare"
    },

    {
        id: "villa_martinez",
        name: "Emiliano Martínez",
        position: "GK",
        rating: 87,
        club: "Aston Villa",
        rarity: "Rare"
    },

    {
        id: "villa_tielemans",
        name: "Youri Tielemans",
        position: "CM",
        rating: 83,
        club: "Aston Villa",
        rarity: "Common"
    },


    // ---------------------------------------------------------
    // BOURNEMOUTH
    // ---------------------------------------------------------

    {
        id: "bournemouth_solanke",
        name: "Dominic Solanke",
        position: "ST",
        rating: 84,
        club: "Bournemouth",
        rarity: "Common"
    },

    {
        id: "bournemouth_sem", 
        name: "Antoine Semenyo",
        position: "RW",
        rating: 80,
        club: "Bournemouth",
        rarity: "Common"
    },


    // ---------------------------------------------------------
    // BRENTFORD
    // ---------------------------------------------------------

    {
        id: "brentford_toney",
        name: "Ivan Toney",
        position: "ST",
        rating: 85,
        club: "Brentford",
        rarity: "Rare"
    },

    {
        id: "brentford_mbeumo",
        name: "Bryan Mbeumo",
        position: "RW",
        rating: 84,
        club: "Brentford",
        rarity: "Common"
    },


    // ---------------------------------------------------------
    // BRIGHTON
    // ---------------------------------------------------------

    {
        id: "brighton_mitoma",
        name: "Kaoru Mitoma",
        position: "LW",
        rating: 84,
        club: "Brighton",
        rarity: "Common"
    },

    {
        id: "brighton_pedro",
        name: "João Pedro",
        position: "ST",
        rating: 82,
        club: "Brighton",
        rarity: "Common"
    },


    // ---------------------------------------------------------
    // CHELSEA
    // ---------------------------------------------------------

    {
        id: "chelsea_palmer",
        name: "Cole Palmer",
        position: "CAM",
        rating: 89,
        club: "Chelsea",
        rarity: "Rare"
    },

    {
        id: "chelsea_jackson",
        name: "Nicolas Jackson",
        position: "ST",
        rating: 82,
        club: "Chelsea",
        rarity: "Common"
    },

    {
        id: "chelsea_enzo",
        name: "Enzo Fernández",
        position: "CM",
        rating: 85,
        club: "Chelsea",
        rarity: "Rare"
    },


    // ---------------------------------------------------------
    // LIVERPOOL
    // ---------------------------------------------------------

    {
        id: "liverpool_salah",
        name: "Mohamed Salah",
        position: "RW",
        rating: 91,
        club: "Liverpool",
        rarity: "Rare"
    },

    {
        id: "liverpool_van_dijk",
        name: "Virgil van Dijk",
        position: "CB",
        rating: 89,
        club: "Liverpool",
        rarity: "Rare"
    },

    {
        id: "liverpool_alisson",
        name: "Alisson",
        position: "GK",
        rating: 89,
        club: "Liverpool",
        rarity: "Rare"
    },

    {
        id: "liverpool_alexander_arnold",
        name: "Trent Alexander-Arnold",
        position: "RB",
        rating: 87,
        club: "Liverpool",
        rarity: "Rare"
    },

    {
        id: "liverpool_mac_allister",
        name: "Alexis Mac Allister",
        position: "CM",
        rating: 86,
        club: "Liverpool",
        rarity: "Rare"
    },


    // ---------------------------------------------------------
    // MANCHESTER CITY
    // ---------------------------------------------------------

    {
        id: "city_haaland",
        name: "Erling Haaland",
        position: "ST",
        rating: 91,
        club: "Manchester City",
        rarity: "Rare"
    },

    {
        id: "city_de_bruyne",
        name: "Kevin De Bruyne",
        position: "CAM",
        rating: 90,
        club: "Manchester City",
        rarity: "Rare"
    },

    {
        id: "city_foden",
        name: "Phil Foden",
        position: "RW",
        rating: 88,
        club: "Manchester City",
        rarity: "Rare"
    },

    {
        id: "city_rodri",
        name: "Rodri",
        position: "CDM",
        rating: 91,
        club: "Manchester City",
        rarity: "Rare"
    },


    // ---------------------------------------------------------
    // MANCHESTER UNITED
    // ---------------------------------------------------------

    {
        id: "united_fernandes",
        name: "Bruno Fernandes",
        position: "CAM",
        rating: 88,
        club: "Manchester United",
        rarity: "Rare"
    },

    {
        id: "united_mainoo",
        name: "Kobbie Mainoo",
        position: "CM",
        rating: 80,
        club: "Manchester United",
        rarity: "Common"
    },

    {
        id: "united_martinez",
        name: "Lisandro Martínez",
        position: "CB",
        rating: 84,
        club: "Manchester United",
        rarity: "Common"
    },


    // ---------------------------------------------------------
    // NEWCASTLE UNITED
    // ---------------------------------------------------------

    {
        id: "newcastle_isak",
        name: "Alexander Isak",
        position: "ST",
        rating: 89,
        club: "Newcastle United",
        rarity: "Rare"
    },

    {
        id: "newcastle_gordon",
        name: "Anthony Gordon",
        position: "LW",
        rating: 84,
        club: "Newcastle United",
        rarity: "Common"
    },


    // ---------------------------------------------------------
    // TOTTENHAM HOTSPUR
    // ---------------------------------------------------------

    {
        id: "spurs_son",
        name: "Son Heung-min",
        position: "LW",
        rating: 88,
        club: "Tottenham Hotspur",
        rarity: "Rare"
    },

    {
        id: "spurs_maddison",
        name: "James Maddison",
        position: "CAM",
        rating: 85,
        club: "Tottenham Hotspur",
        rarity: "Rare"
    },


    // ---------------------------------------------------------
    // WEST HAM UNITED
    // ---------------------------------------------------------

    {
        id: "westham_bowen",
        name: "Jarrod Bowen",
        position: "RW",
        rating: 84,
        club: "West Ham United",
        rarity: "Common"
    },


    // ---------------------------------------------------------
    // REAL MADRID
    // ---------------------------------------------------------

    {
        id: "madrid_vinicius",
        name: "Vinícius Júnior",
        position: "LW",
        rating: 90,
        club: "Real Madrid",
        rarity: "Rare"
    },

    {
        id: "madrid_bellingham",
        name: "Jude Bellingham",
        position: "CAM",
        rating: 91,
        club: "Real Madrid",
        rarity: "Rare"
    },

    {
        id: "madrid_mbappe",
        name: "Kylian Mbappé",
        position: "ST",
        rating: 92,
        club: "Real Madrid",
        rarity: "Rare"
    },

    {
        id: "madrid_valverde",
        name: "Federico Valverde",
        position: "CM",
        rating: 88,
        club: "Real Madrid",
        rarity: "Rare"
    },


    // ---------------------------------------------------------
    // BARCELONA
    // ---------------------------------------------------------

    {
        id: "barcelona_yamal",
        name: "Lamine Yamal",
        position: "RW",
        rating: 89,
        club: "Barcelona",
        rarity: "Rare"
    },

    {
        id: "barcelona_pedri",
        name: "Pedri",
        position: "CM",
        rating: 86,
        club: "Barcelona",
        rarity: "Rare"
    },

    {
        id: "barcelona_lewandowski",
        name: "Robert Lewandowski",
        position: "ST",
        rating: 89,
        club: "Barcelona",
        rarity: "Rare"
    },

    {
        id: "barcelona_raphinha",
        name: "Raphinha",
        position: "LW",
        rating: 86,
        club: "Barcelona",
        rarity: "Rare"
    },


    // ---------------------------------------------------------
    // ATLETICO MADRID
    // ---------------------------------------------------------

    {
        id: "atleti_griezmann",
        name: "Antoine Griezmann",
        position: "CF",
        rating: 89,
        club: "Atlético Madrid",
        rarity: "Rare"
    },

    {
        id: "atleti_alvarez",
        name: "Julián Álvarez",
        position: "ST",
        rating: 87,
        club: "Atlético Madrid",
        rarity: "Rare"
    },


    // ---------------------------------------------------------
    // ATHLETIC CLUB
    // ---------------------------------------------------------

    {
        id: "athletic_nico",
        name: "Nico Williams",
        position: "LW",
        rating: 85,
        club: "Athletic Club",
        rarity: "Rare"
    },


    // ---------------------------------------------------------
    // REAL SOCIEDAD
    // ---------------------------------------------------------

    {
        id: "sociedad_kubo",
        name: "Takefusa Kubo",
        position: "RW",
        rating: 84,
        club: "Real Sociedad",
        rarity: "Common"
    },


    // ---------------------------------------------------------
    // SEVILLA
    // ---------------------------------------------------------

    {
        id: "sevilla_ocampos",
        name: "Lucas Ocampos",
        position: "LW",
        rating: 80,
        club: "Sevilla",
        rarity: "Common"
    }

]);


/* =========================================================
   ICON DATABASE
   ========================================================= */

function getIconPlayers() {

    if (
        typeof GAME_CONFIG === "undefined" ||
        !Array.isArray(GAME_CONFIG.ICONS)
    ) {
        return [];
    }

    return GAME_CONFIG.ICONS.map(function (icon) {

        return {
            id: icon.id,
            name: icon.name,
            position: icon.position,
            rating: icon.rating,
            club: icon.club,
            rarity: GAME_CONFIG.RARITIES.ICON
        };

    });
}


/* =========================================================
   PLAYER DATABASE
   ========================================================= */

function getAllFallbackPlayers() {

    const normalPlayers =
        FALLBACK_PLAYERS.map(sanitizePlayer)
            .filter(Boolean);

    const iconPlayers =
        getIconPlayers()
            .map(sanitizePlayer)
            .filter(Boolean);

    return uniqueById([
        ...normalPlayers,
        ...iconPlayers
    ]);
}


/**
 * Returns all currently available players.
 */
async function getAllPlayers() {

    if (API_CONFIG.ENABLED && API_CONFIG.API_KEY) {

        try {

            const players =
                await fetchPlayersFromAPI();

            if (
                Array.isArray(players) &&
                players.length > 0
            ) {
                return uniqueById(players);
            }

        } catch (error) {

            console.warn(
                "Football API unavailable. Using fallback players.",
                error
            );
        }
    }

    return getAllFallbackPlayers();
}


/* =========================================================
   CLUB PLAYER SEARCH
   ========================================================= */

async function getPlayersByClub(clubName) {

    const club = cleanText(clubName, 100);

    if (!club) {
        return [];
    }

    const allPlayers =
        await getAllPlayers();

    return allPlayers.filter(function (player) {

        return (
            String(player.club).toLowerCase() ===
            club.toLowerCase()
        );

    });
}


/* =========================================================
   LEAGUE PLAYER SEARCH
   ========================================================= */

async function getPlayersByLeague(leagueName) {

    const league = cleanText(leagueName, 100);

    if (!league) {
        return [];
    }

    let clubs = [];

    if (
        league === GAME_CONFIG.LEAGUES.PREMIER_LEAGUE
    ) {
        clubs =
            GAME_CONFIG.PREMIER_LEAGUE_CLUBS;

    } else if (
        league === GAME_CONFIG.LEAGUES.LALIGA
    ) {
        clubs =
            GAME_CONFIG.LALIGA_CLUBS;
    }

    if (clubs.length === 0) {
        return [];
    }

    const allPlayers =
        await getAllPlayers();

    const clubSet =
        new Set(
            clubs.map(function (club) {
                return club.toLowerCase();
            })
        );

    return allPlayers.filter(function (player) {

        return clubSet.has(
            String(player.club).toLowerCase()
        );

    });
}


/* =========================================================
   API REQUEST
   ========================================================= */

async function apiRequest(endpoint, params = {}) {

    if (!API_CONFIG.ENABLED) {
        throw new Error("Football API is disabled.");
    }

    if (!API_CONFIG.API_KEY) {
        throw new Error("Football API key is missing.");
    }

    const url =
        new URL(
            API_CONFIG.BASE_URL + endpoint
        );

    Object.entries(params).forEach(function ([key, value]) {

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            url.searchParams.set(key, String(value));
        }

    });

    const controller =
        new AbortController();

    const timeout =
        setTimeout(
            function () {
                controller.abort();
            },
            API_CONFIG.TIMEOUT
        );

    try {

        const response =
            await fetch(
                url.toString(),
                {
                    method: "GET",
                    headers: {
                        "x-apisports-key":
                            API_CONFIG.API_KEY
                    },
                    signal: controller.signal
                }
            );

        if (!response.ok) {

            throw new Error(
                "API request failed with HTTP " +
                response.status
            );
        }

        const data =
            await response.json();

        if (!data || typeof data !== "object") {
            throw new Error(
                "API returned invalid data."
            );
        }

        return data;

    } finally {

        clearTimeout(timeout);
    }
}


/* =========================================================
   API-FOOTBALL PLAYER CONVERSION
   ========================================================= */

function convertAPIPlayer(apiPlayer) {

    if (!apiPlayer || !apiPlayer.player) {
        return null;
    }

    const player =
        apiPlayer.player;

    const statistics =
        Array.isArray(apiPlayer.statistics)
            ? apiPlayer.statistics
            : [];

    const firstStats =
        statistics[0] || {};

    const team =
        firstStats.team || {};

    const position =
        firstStats.games &&
        firstStats.games.position
            ? firstStats.games.position
            : "MID";

    let normalisedPosition = "CM";

    switch (String(position).toUpperCase()) {

        case "GOALKEEPER":
            normalisedPosition = "GK";
            break;

        case "DEFENDER":
            normalisedPosition = "CB";
            break;

        case "MIDFIELDER":
            normalisedPosition = "CM";
            break;

        case "FORWARD":
            normalisedPosition = "ST";
            break;

        default:
            normalisedPosition = "CM";
    }

    return sanitizePlayer({

        id:
            "api_" +
            String(player.id || createId("player")),

        name:
            cleanText(
                player.name ||
                player.firstname ||
                "Unknown Player",
                100
            ),

        position:
            normalisedPosition,

        rating:
            75,

        club:
            cleanText(
                team.name ||
                "Unknown Club",
                100
            ),

        rarity:
            GAME_CONFIG.RARITIES.COMMON
    });
}


/* =========================================================
   FETCH PLAYERS FROM API
   ========================================================= */

async function fetchPlayersFromAPI() {

    const response =
        await apiRequest(
            "/players",
            {
                league: 39,
                season: new Date().getFullYear()
            }
        );

    if (!Array.isArray(response.response)) {
        throw new Error(
            "API player response was invalid."
        );
    }

    return response.response
        .map(convertAPIPlayer)
        .filter(Boolean);
}


/* =========================================================
   RANDOM PLAYER
   ========================================================= */

async function getRandomPlayer(options = {}) {

    const players =
        await getAllPlayers();

    if (players.length === 0) {
        return null;
    }

    let filtered =
        players;

    if (options.rarity) {

        filtered =
            filtered.filter(function (player) {
                return (
                    player.rarity ===
                    options.rarity
                );
            });
    }

    if (options.club) {

        filtered =
            filtered.filter(function (player) {
                return (
                    String(player.club)
                        .toLowerCase() ===
                    String(options.club)
                        .toLowerCase()
                );
            });
    }

    if (filtered.length === 0) {
        return null;
    }

    return randomItem(filtered);
}


/* =========================================================
   RANDOM NORMAL PLAYER
   ========================================================= */

async function getRandomNormalPlayer() {

    const players =
        await getAllPlayers();

    const normalPlayers =
        players.filter(function (player) {

            return (
                player.rarity ===
                GAME_CONFIG.RARITIES.COMMON ||
                player.rarity ===
                GAME_CONFIG.RARITIES.RARE
            );

        });

    return randomItem(normalPlayers);
}


/* =========================================================
   RANDOM ICON
   ========================================================= */

function getRandomIcon() {

    const icons =
        getIconPlayers();

    return randomItem(icons);
}


/* =========================================================
   PACK CARD GENERATION
   ========================================================= */

async function generatePackCard(packType) {

    const pack =
        String(packType ?? "")
            .toLowerCase();

    if (
        pack !== GAME_CONFIG.PACKS.BRONZE.ID &&
        pack !== GAME_CONFIG.PACKS.GOLD.ID &&
        pack !== GAME_CONFIG.PACKS.ICON.ID
    ) {
        return null;
    }


    // Icon Pack = guaranteed Icon.
    if (
        pack === GAME_CONFIG.PACKS.ICON.ID
    ) {
        return getRandomIcon();
    }


    const config =
        pack === GAME_CONFIG.PACKS.GOLD.ID
            ? GAME_CONFIG.PACKS.GOLD
            : GAME_CONFIG.PACKS.BRONZE;


    const roll =
        randomInt(1, 100);

    let rarity;

    if (
        roll <= config.ODDS.ICON
    ) {
        rarity =
            GAME_CONFIG.RARITIES.ICON;

    } else if (
        roll <=
        config.ODDS.ICON +
        config.ODDS.RARE
    ) {
        rarity =
            GAME_CONFIG.RARITIES.RARE;

    } else {
        rarity =
            GAME_CONFIG.RARITIES.COMMON;
    }


    if (
        rarity === GAME_CONFIG.RARITIES.ICON
    ) {
        return getRandomIcon();
    }


    const players =
        await getAllPlayers();

    const matchingPlayers =
        players.filter(function (player) {

            return (
                player.rarity === rarity
            );

        });


    /*
     * Safety fallback:
     * If the requested rarity doesn't exist,
     * return any normal player rather than crashing.
     */

    if (matchingPlayers.length === 0) {

        return getRandomNormalPlayer();
    }

    return randomItem(matchingPlayers);
}


/* =========================================================
   GENERATE COMPLETE PACK
   ========================================================= */

async function generatePack(packType) {

    const pack =
        String(packType ?? "")
            .toLowerCase();

    let config = null;

    if (
        pack === GAME_CONFIG.PACKS.BRONZE.ID
    ) {
        config =
            GAME_CONFIG.PACKS.BRONZE;

    } else if (
        pack === GAME_CONFIG.PACKS.GOLD.ID
    ) {
        config =
            GAME_CONFIG.PACKS.GOLD;

    } else if (
        pack === GAME_CONFIG.PACKS.ICON.ID
    ) {
        config =
            GAME_CONFIG.PACKS.ICON;
    }

    if (!config) {
        return [];
    }

    const cards = [];

    for (
        let i = 0;
        i < config.CARDS;
        i++
    ) {

        const card =
            await generatePackCard(pack);

        if (card) {
            cards.push(card);
        }
    }

    return cards;
}


/* =========================================================
   CLUB RATING
   ========================================================= */

function getClubRating(clubName) {

    const players =
        FALLBACK_PLAYERS.filter(function (player) {

            return (
                String(player.club).toLowerCase() ===
                String(clubName).toLowerCase()
            );

        });

    if (players.length === 0) {

        /*
         * Unknown clubs receive a sensible default.
         */
        return 78;
    }

    return calculateSquadRating(players);
}


/* =========================================================
   RANDOM OPPONENT CLUB
   ========================================================= */

function getRandomOpponentClub(excludedClub = "") {

    const allClubs = [
        ...GAME_CONFIG.PREMIER_LEAGUE_CLUBS,
        ...GAME_CONFIG.LALIGA_CLUBS
    ];

    const uniqueClubs =
        [...new Set(allClubs)];

    const available =
        uniqueClubs.filter(function (club) {

            return (
                String(club).toLowerCase() !==
                String(excludedClub).toLowerCase()
            );

        });

    return randomItem(available);
}


/* =========================================================
   API STATUS
   ========================================================= */

function getAPIStatus() {

    return {
        enabled: API_CONFIG.ENABLED,
        configured:
            Boolean(API_CONFIG.API_KEY),
        online:
            Boolean(
                API_CONFIG.ENABLED &&
                API_CONFIG.API_KEY
            )
    };
}


/* =========================================================
   STARTUP
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const status =
            getAPIStatus();

        if (!status.online) {

            console.log(
                "Super League Soccer: " +
                "using built-in player database."
            );

        } else {

            console.log(
                "Super League Soccer: " +
                "football API enabled."
            );
        }

    }
);
```
