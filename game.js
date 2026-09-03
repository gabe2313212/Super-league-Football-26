/* =========================================================
   SUPER LEAGUE SOCCER
   game.js
   Main game engine
   ========================================================= */

"use strict";

/* =========================================================
   CONFIG COMPATIBILITY
   ========================================================= */

(function normaliseGameConfig() {
    const cfg = window.GAME_CONFIG || {};

    cfg.LEAGUES = cfg.LEAGUES || {
        PREMIER_LEAGUE:
            cfg.leagues?.premierLeague || "Premier League",

        LALIGA:
            cfg.leagues?.laLiga ||
            cfg.leagues?.laliga ||
            "LaLiga"
    };

    cfg.SEASON = cfg.SEASON || {};

    cfg.SEASON.MATCHES =
        Number.isInteger(cfg.SEASON.MATCHES)
            ? cfg.SEASON.MATCHES
            : Number.isInteger(cfg.seasonLength)
                ? cfg.seasonLength
                : 19;

    cfg.BUILD_ROSTER = cfg.BUILD_ROSTER || {};

    cfg.BUILD_ROSTER.REQUIRED_PLAYERS =
        Number.isInteger(
            cfg.BUILD_ROSTER.REQUIRED_PLAYERS
        )
            ? cfg.BUILD_ROSTER.REQUIRED_PLAYERS
            : Number.isInteger(
                cfg.buildRosterPlayersRequired
            )
                ? cfg.buildRosterPlayersRequired
                : 6;

    cfg.SUPER_SQUAD = cfg.SUPER_SQUAD || {};

    cfg.SUPER_SQUAD.REQUIRED_PLAYERS =
        Number.isInteger(
            cfg.SUPER_SQUAD.REQUIRED_PLAYERS
        )
            ? cfg.SUPER_SQUAD.REQUIRED_PLAYERS
            : Number.isInteger(
                cfg.superSquadPlayersRequired
            )
                ? cfg.superSquadPlayersRequired
                : 11;

    cfg.SUPER_SQUAD.DIFFICULTY =
        cfg.SUPER_SQUAD.DIFFICULTY || {};

    cfg.SUPER_SQUAD.DIFFICULTY.EASY =
        cfg.SUPER_SQUAD.DIFFICULTY.EASY || {
            MIN_OPPONENT_RATING:
                cfg.opponentRatings?.easy?.min ?? 72,

            MAX_OPPONENT_RATING:
                cfg.opponentRatings?.easy?.max ?? 84
        };

    cfg.SUPER_SQUAD.DIFFICULTY.HARD =
        cfg.SUPER_SQUAD.DIFFICULTY.HARD || {
            MIN_OPPONENT_RATING:
                cfg.opponentRatings?.hard?.min ?? 82,

            MAX_OPPONENT_RATING:
                cfg.opponentRatings?.hard?.max ?? 95
        };

    const costs =
        cfg.packCosts || {};

    const contents =
        cfg.packContents || {};

    const odds =
        cfg.packOdds || {};

    cfg.PACKS =
        cfg.PACKS || {};

    cfg.PACKS.BRONZE =
        cfg.PACKS.BRONZE || {
            NAME: "Bronze Pack",
            COST: costs.bronze ?? 50,
            CARDS: contents.bronze ?? 5,
            ODDS:
                odds.bronze ??
                {
                    Icon: 4,
                    Rare: 20,
                    Common: 76
                }
        };

    cfg.PACKS.GOLD =
        cfg.PACKS.GOLD || {
            NAME: "Gold Pack",
            COST: costs.gold ?? 100,
            CARDS: contents.gold ?? 5,
            ODDS:
                odds.gold ??
                {
                    Icon: 10,
                    Rare: 30,
                    Common: 60
                }
        };

    cfg.PACKS.ICON =
        cfg.PACKS.ICON || {
            NAME: "Icon Pack",
            COST: costs.icon ?? 1000,
            CARDS: contents.icon ?? 1,
            ODDS: {
                Icon: 100
            }
        };

    cfg.PREMIER_LEAGUE_CLUBS =
        cfg.PREMIER_LEAGUE_CLUBS ||
        (
            Array.isArray(cfg.clubs)
                ? cfg.clubs
                    .filter(function (club) {
                        return club.league ===
                            cfg.LEAGUES.PREMIER_LEAGUE;
                    })
                    .map(function (club) {
                        return club.name;
                    })
                : []
        );

    cfg.LALIGA_CLUBS =
        cfg.LALIGA_CLUBS ||
        (
            Array.isArray(cfg.clubs)
                ? cfg.clubs
                    .filter(function (club) {
                        return club.league ===
                            cfg.LEAGUES.LALIGA;
                    })
                    .map(function (club) {
                        return club.name;
                    })
                : []
        );

    cfg.STORAGE_KEYS =
        cfg.STORAGE_KEYS || {};

    cfg.STORAGE_KEYS.BUILD_ROSTER =
        cfg.STORAGE_KEYS.BUILD_ROSTER ||
        cfg.storageKeys?.buildRoster ||
        "buildRoster_gameState";

    cfg.STORAGE_KEYS.SUPER_SQUAD =
        cfg.STORAGE_KEYS.SUPER_SQUAD ||
        cfg.storageKeys?.superSquad ||
        "superSquad_gameState";

    window.GAME_CONFIG = cfg;
})();

/* =========================================================
   GAME STATE
   ========================================================= */

const GAME_STATE = {

    currentScreen: "mainMenu",

    buildRoster: {
        league: "",
        club: "",
        players: [],

        season: 1,
        matchNumber: 1,

        points: 0,

        wins: 0,
        draws: 0,
        losses: 0,

        history: []
    },

    superSquad: {
        teamName: "",

        collection: [],
        lineup: [],

        points: 0,
        coins: 0,

        difficulty: "easy",

        season: 1,
        matchNumber: 1,

        wins: 0,
        draws: 0,
        losses: 0,

        history: []
    },

    collectionFilter: "all",

    currentMatch: null,

    lastCompletedMode: null
};

/* =========================================================
   START GAME
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        try {

            loadAllGameData();

            repairGameState();

            setupEventListeners();

            updateAllUI();

            showScreen("mainMenu");

            console.log(
                "Super League Soccer loaded successfully."
            );

        } catch (error) {

            console.error(
                "Game initialisation error:",
                error
            );

            showNotification(
                "The game encountered a loading error.",
                "error"
            );
        }
    }
);

/* =========================================================
   REPAIR SAVED GAME DATA
   ========================================================= */

function repairGameState() {

    const br =
        GAME_STATE.buildRoster;

    const ss =
        GAME_STATE.superSquad;

    br.players =
        Array.isArray(br.players)
            ? br.players.filter(Boolean)
            : [];

    br.history =
        Array.isArray(br.history)
            ? br.history
            : [];

    br.matchNumber =
        Math.max(
            1,
            safeInteger(
                br.matchNumber,
                1
            )
        );

    br.season =
        Math.max(
            1,
            safeInteger(
                br.season,
                1
            )
        );

    br.points =
        Math.max(
            0,
            safeInteger(
                br.points,
                0
            )
        );

    br.wins =
        Math.max(
            0,
            safeInteger(
                br.wins,
                0
            )
        );

    br.draws =
        Math.max(
            0,
            safeInteger(
                br.draws,
                0
            )
        );

    br.losses =
        Math.max(
            0,
            safeInteger(
                br.losses,
                0
            )
        );

    ss.collection =
        Array.isArray(ss.collection)
            ? ss.collection.filter(Boolean)
            : [];

    ss.lineup =
        Array.isArray(ss.lineup)
            ? [...new Set(
                ss.lineup.filter(Boolean)
            )]
            : [];

    ss.history =
        Array.isArray(ss.history)
            ? ss.history
            : [];

    ss.lineup =
        ss.lineup.slice(
            0,
            GAME_CONFIG.SUPER_SQUAD.REQUIRED_PLAYERS
        );

    ss.matchNumber =
        Math.max(
            1,
            safeInteger(
                ss.matchNumber,
                1
            )
        );

    ss.season =
        Math.max(
            1,
            safeInteger(
                ss.season,
                1
            )
        );

    ss.points =
        Math.max(
            0,
            safeInteger(
                ss.points,
                0
            )
        );

    ss.coins =
        Math.max(
            0,
            safeInteger(
                ss.coins,
                0
            )
        );

    ss.wins =
        Math.max(
            0,
            safeInteger(
                ss.wins,
                0
            )
        );

    ss.draws =
        Math.max(
            0,
            safeInteger(
                ss.draws,
                0
            )
        );

    ss.losses =
        Math.max(
            0,
            safeInteger(
                ss.losses,
                0
            )
        );

    ss.difficulty =
        ss.difficulty === "hard"
            ? "hard"
            : "easy";
}

/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function setupEventListeners() {

    /* MAIN MENU */

    bindClick(
        "buildRosterButton",
        function () {
            showScreen("buildRoster");
        }
    );

    bindClick(
        "superSquadButton",
        function () {
            showScreen("superSquad");
        }
    );

    bindClick(
        "collectionButton",
        function () {

            renderCollection();

            showScreen("collection");
        }
    );

    bindClick(
        "settingsButton",
        function () {
            showScreen("settings");
        }
    );

    /* BUILD A ROSTER */

    bindClick(
        "buildPremierLeagueButton",
        function () {

            selectBuildLeague(
                GAME_CONFIG.LEAGUES.PREMIER_LEAGUE
            );
        }
    );

    bindClick(
        "buildLaLigaButton",
        function () {

            selectBuildLeague(
                GAME_CONFIG.LEAGUES.LALIGA
            );
        }
    );

    bindClick(
        "loadClubButton",
        loadBuildClub
    );

    bindClick(
        "startRosterSeasonButton",
        startRosterSeason
    );

    bindClick(
        "playRosterMatchButton",
        playBuildRosterMatch
    );

    bindClick(
        "simulateRosterSeasonButton",
        simulateBuildRosterSeason
    );

    /* SUPER SQUAD */

    bindClick(
        "createTeamButton",
        createSuperSquad
    );

    bindClick(
        "easyDifficultyButton",
        function () {
            setSuperSquadDifficulty("easy");
        }
    );

    bindClick(
        "hardDifficultyButton",
        function () {
            setSuperSquadDifficulty("hard");
        }
    );

    bindClick(
        "playSuperSquadMatchButton",
        playSuperSquadMatch
    );

    bindClick(
        "bronzePackButton",
        function () {
            openPack("bronze");
        }
    );

    bindClick(
        "goldPackButton",
        function () {
            openPack("gold");
        }
    );

    bindClick(
        "iconPackButton",
        function () {
            openPack("icon");
        }
    );

    /* COLLECTION */

    bindClick(
        "collectionAllButton",
        function () {
            setCollectionFilter("all");
        }
    );

    bindClick(
        "collectionCommonButton",
        function () {
            setCollectionFilter("Common");
        }
    );

    bindClick(
        "collectionRareButton",
        function () {
            setCollectionFilter("Rare");
        }
    );

    bindClick(
        "collectionIconButton",
        function () {
            setCollectionFilter("Icon");
        }
    );

    /* MATCH */

    bindClick(
        "matchBackButton",
        function () {

            if (GAME_STATE.currentMatch) {

                showScreen(
                    GAME_STATE.currentMatch.returnScreen
                );

            } else {

                showScreen("mainMenu");
            }
        }
    );

    bindClick(
        "simulateMatchButton",
        simulateCurrentMatch
    );

    /* PRESENTATION */

    bindClick(
        "newSeasonButton",
        startNewSeason
    );

    bindClick(
        "presentationMenuButton",
        function () {
            showScreen("mainMenu");
        }
    );

    /* SETTINGS */

    bindClick(
        "saveGameButton",
        function () {

            saveAllGameData();

            showNotification(
                "Game saved successfully.",
                "success"
            );
        }
    );

    bindClick(
        "resetGameButton",
        resetGame
    );

    /* MODAL */

    bindClick(
        "closeModalButton",
        closeModal
    );

    const modal =
        getElement("gameModal");

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {
                    closeModal();
                }
            }
        );
    }
}

/* =========================================================
   SAFE CLICK BINDING
   ========================================================= */

function bindClick(id, callback) {

    const element =
        getElement(id);

    if (!element) {

        console.warn(
            "Missing HTML element:",
            id
        );

        return;
    }

    element.addEventListener(
        "click",
        function (event) {

            try {

                callback(event);

            } catch (error) {

                console.error(
                    "Button error:",
                    error
                );

                showNotification(
                    "Something went wrong. Please try again.",
                    "error"
                );
            }
        }
    );
}

/* =========================================================
   SCREEN MANAGEMENT
   ========================================================= */

function showScreen(screenName) {

    const screens =
        document.querySelectorAll(
            ".screen"
        );

    screens.forEach(
        function (screen) {
            screen.hidden = true;
        }
    );

    const target =
        getElement(
            screenName + "Screen"
        );

    if (!target) {

        console.warn(
            "Screen not found:",
            screenName
        );

        return;
    }

    target.hidden = false;

    GAME_STATE.currentScreen =
        screenName;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    updateAllUI();
}

/* =========================================================
   LOAD SAVED DATA
   ========================================================= */

function loadAllGameData() {

    const buildSaved =
        loadFromStorage(
            GAME_CONFIG.STORAGE_KEYS.BUILD_ROSTER
        );

    const squadSaved =
        loadFromStorage(
            GAME_CONFIG.STORAGE_KEYS.SUPER_SQUAD
        );

    if (
        buildSaved &&
        typeof buildSaved === "object"
    ) {

        GAME_STATE.buildRoster =
            sanitiseBuildRosterState(
                buildSaved
            );
    }

    if (
        squadSaved &&
        typeof squadSaved === "object"
    ) {

        GAME_STATE.superSquad =
            sanitiseSuperSquadState(
                squadSaved
            );
    }
}

/* =========================================================
   SAVE GAME
   ========================================================= */

function saveAllGameData() {

    saveToStorage(
        GAME_CONFIG.STORAGE_KEYS.BUILD_ROSTER,
        GAME_STATE.buildRoster
    );

    saveToStorage(
        GAME_CONFIG.STORAGE_KEYS.SUPER_SQUAD,
        GAME_STATE.superSquad
    );
}

/* =========================================================
   BUILD ROSTER SAVE VALIDATION
   ========================================================= */

function sanitiseBuildRosterState(state) {

    const safe = {

        league: "",
        club: "",
        players: [],

        season: 1,
        matchNumber: 1,

        points: 0,

        wins: 0,
        draws: 0,
        losses: 0,

        history: []
    };

    safe.league =
        cleanText(
            state.league,
            100
        );

    safe.club =
        cleanText(
            state.club,
            100
        );

    if (
        Array.isArray(
            state.players
        )
    ) {

        safe.players =
            state.players
                .map(sanitizePlayer)
                .filter(Boolean)
                .slice(
                    0,
                    GAME_CONFIG
                        .BUILD_ROSTER
                        .REQUIRED_PLAYERS
                );
    }

    safe.season =
        clamp(
            safeInteger(
                state.season,
                1
            ),
            1,
            999999
        );

    safe.matchNumber =
        clamp(
            safeInteger(
                state.matchNumber,
                1
            ),
            1,
            GAME_CONFIG.SEASON.MATCHES + 1
        );

    safe.points =
        Math.max(
            0,
            safeInteger(
                state.points,
                0
            )
        );

    safe.wins =
        Math.max(
            0,
            safeInteger(
                state.wins,
                0
            )
        );

    safe.draws =
        Math.max(
            0,
            safeInteger(
                state.draws,
                0
            )
        );

    safe.losses =
        Math.max(
            0,
            safeInteger(
                state.losses,
                0
            )
        );

    if (
        Array.isArray(
            state.history
        )
    ) {

        safe.history =
            state.history
                .filter(
                    function (match) {
                        return (
                            match &&
                            typeof match === "object"
                        );
                    }
                )
                .slice(
                    0,
                    GAME_CONFIG.SEASON.MATCHES
                );
    }

    return safe;
}

/* =========================================================
   SUPER SQUAD SAVE VALIDATION
   ========================================================= */

function sanitiseSuperSquadState(state) {

    const safe = {

        teamName: "",

        collection: [],
        lineup: [],

        points: 0,
        coins: 0,

        difficulty: "easy",

        season: 1,
        matchNumber: 1,

        wins: 0,
        draws: 0,
        losses: 0,

        history: []
    };

    const teamValidation =
        validateTeamName(
            state.teamName || ""
        );

    if (
        teamValidation.valid
    ) {

        safe.teamName =
            teamValidation.name;
    }

    if (
        Array.isArray(
            state.collection
        )
    ) {

        safe.collection =
            uniqueById(
                state.collection
                    .map(sanitizePlayer)
                    .filter(Boolean)
            );
    }

    if (
        Array.isArray(
            state.lineup
        )
    ) {

        safe.lineup =
            state.lineup
                .map(
                    function (id) {
                        return cleanText(
                            id,
                            100
                        );
                    }
                )
                .filter(Boolean)
                .filter(
                    function (id) {

                        return Boolean(
                            findPlayerById(
                                safe.collection,
                                id
                            )
                        );
                    }
                )
                .slice(
                    0,
                    GAME_CONFIG
                        .SUPER_SQUAD
                        .REQUIRED_PLAYERS
                );
    }

    safe.points =
        Math.max(
            0,
            safeInteger(
                state.points,
                0
            )
        );

    safe.coins =
        Math.max(
            0,
            safeInteger(
                state.coins,
                0
            )
        );

    safe.difficulty =
        state.difficulty === "hard"
            ? "hard"
            : "easy";

    safe.season =
        clamp(
            safeInteger(
                state.season,
                1
            ),
            1,
            999999
        );

    safe.matchNumber =
        clamp(
            safeInteger(
                state.matchNumber,
                1
            ),
            1,
            GAME_CONFIG.SEASON.MATCHES + 1
        );

    safe.wins =
        Math.max(
            0,
            safeInteger(
                state.wins,
                0
            )
        );

    safe.draws =
        Math.max(
            0,
            safeInteger(
                state.draws,
                0
            )
        );

    safe.losses =
        Math.max(
            0,
            safeInteger(
                state.losses,
                0
            )
        );

    if (
        Array.isArray(
            state.history
        )
    ) {

        safe.history =
            state.history
                .filter(
                    function (match) {
                        return (
                            match &&
                            typeof match === "object"
                        );
                    }
                )
                .slice(
                    0,
                    GAME_CONFIG.SEASON.MATCHES
                );
    }

    return safe;
}

/* =========================================================
   BUILD ROSTER — CHOOSE LEAGUE
   ========================================================= */

function selectBuildLeague(league) {

    if (
        league !==
            GAME_CONFIG.LEAGUES.PREMIER_LEAGUE &&
        league !==
            GAME_CONFIG.LEAGUES.LALIGA
    ) {

        showNotification(
            "Invalid league selected.",
            "error"
        );

        return;
    }

    GAME_STATE.buildRoster.league =
        league;

    GAME_STATE.buildRoster.club =
        "";

    GAME_STATE.buildRoster.players =
        [];

    const clubSelect =
        getElement("clubSelect");

    if (!clubSelect) {
        return;
    }

    let clubs = [];

    if (
        league ===
        GAME_CONFIG.LEAGUES.PREMIER_LEAGUE
    ) {

        clubs =
            GAME_CONFIG.PREMIER_LEAGUE_CLUBS;

    } else {

        clubs =
            GAME_CONFIG.LALIGA_CLUBS;
    }

    if (!Array.isArray(clubs)) {
        clubs = [];
    }

    clubSelect.innerHTML =
        '<option value="">Select a club</option>';

    clubs.forEach(
        function (club) {

            const option =
                document.createElement(
                    "option"
                );

            option.value = club;

            option.textContent =
                club;

            clubSelect.appendChild(
                option
            );
        }
    );

    showElement(
        "buildClubPanel"
    );

    hideElement(
        "rosterPlayerPanel"
    );

    renderRosterPlayers();
}

/* =========================================================
   BUILD ROSTER — LOAD CLUB
   ========================================================= */

async function loadBuildClub() {

    const clubSelect =
        getElement("clubSelect");

    if (!clubSelect) {
        return;
    }

    const club =
        cleanText(
            clubSelect.value,
            100
        );

    if (!club) {

        showNotification(
            "Please select a club.",
            "error"
        );

        return;
    }

    GAME_STATE.buildRoster.club =
        club;

    GAME_STATE.buildRoster.players =
        [];

    showNotification(
        "Loading " +
        club +
        " players...",
        "info"
    );

    try {

        let players =
            await getPlayersByClub(
                club
            );

        if (
            !Array.isArray(players)
        ) {
            players = [];
        }

        if (
            players.length < 6
        ) {

            players =
                createFallbackClubPlayers(
                    club,
                    players
                );
        }

        renderRosterPlayers(
            players
        );

        showElement(
            "rosterPlayerPanel"
        );

        showNotification(
            club +
            " loaded.",
            "success"
        );

    } catch (error) {

        console.error(
            "Unable to load club:",
            error
        );

        const players =
            createFallbackClubPlayers(
                club,
                []
            );

        renderRosterPlayers(
            players
        );

        showElement(
            "rosterPlayerPanel"
        );

        showNotification(
            "Using backup player data.",
            "info"
        );
    }
}
/* =========================================================
   BUILD ROSTER — FALLBACK PLAYERS
   ========================================================= */

function createFallbackClubPlayers(club, existingPlayers) {

    const players =
        Array.isArray(existingPlayers)
            ? existingPlayers.slice()
            : [];

    const positions = [
        "GK",
        "DEF",
        "DEF",
        "MID",
        "MID",
        "FWD"
    ];

    const baseRating =
        typeof getClubRating === "function"
            ? getClubRating(club)
            : 80;

    for (
        let i = players.length;
        i < 6;
        i++
    ) {

        players.push({
            id:
                "fallback-" +
                slugify(club) +
                "-" +
                i,

            name:
                "Player " +
                (i + 1),

            position:
                positions[i],

            rating:
                clamp(
                    baseRating -
                    5 +
                    randomInt(0, 8),
                    60,
                    99
                ),

            club:
                club,

            league:
                GAME_STATE.buildRoster.league,

            rarity:
                "Common"
        });
    }

    return players.slice(0, 6);
}

/* =========================================================
   ROSTER PLAYER DISPLAY
   ========================================================= */

function renderRosterPlayers(players) {

    const container =
        getElement("rosterPlayers");

    if (!container) {
        return;
    }

    let availablePlayers =
        players;

    if (
        !Array.isArray(
            availablePlayers
        )
    ) {

        availablePlayers =
            getPlayersByClub(
                GAME_STATE.buildRoster.club
            );
    }

    if (
        !Array.isArray(
            availablePlayers
        )
    ) {

        availablePlayers = [];
    }

    if (
        availablePlayers.length === 0 &&
        GAME_STATE.buildRoster.club
    ) {

        availablePlayers =
            createFallbackClubPlayers(
                GAME_STATE.buildRoster.club,
                []
            );
    }

    container.innerHTML = "";

    availablePlayers.forEach(
        function (player) {

            const safePlayer =
                sanitizePlayer(player);

            if (!safePlayer) {
                return;
            }

            const card =
                document.createElement(
                    "button"
                );

            card.type = "button";

            card.className =
                "player-card";

            card.dataset.playerId =
                safePlayer.id;

            const selected =
                GAME_STATE.buildRoster.players
                    .some(
                        function (selectedPlayer) {
                            return (
                                selectedPlayer.id ===
                                safePlayer.id
                            );
                        }
                    );

            if (selected) {
                card.classList.add(
                    "selected"
                );
            }

            card.innerHTML =
                createPlayerCardHTML(
                    safePlayer,
                    selected
                );

            card.addEventListener(
                "click",
                function () {

                    toggleBuildRosterPlayer(
                        safePlayer
                    );
                }
            );

            container.appendChild(
                card
            );
        }
    );

    updateRosterCount();

    updateStartRosterButton();
}

/* =========================================================
   PLAYER CARD HTML
   ========================================================= */

function createPlayerCardHTML(
    player,
    selected
) {

    const name =
        escapeHTML(
            player.name
        );

    const position =
        escapeHTML(
            player.position
        );

    const club =
        escapeHTML(
            player.club
        );

    const rating =
        escapeHTML(
            String(player.rating)
        );

    const rarity =
        escapeHTML(
            player.rarity || "Common"
        );

    return `
        <div class="player-card-top">
            <span class="player-rating">
                ${rating}
            </span>

            <span class="player-position">
                ${position}
            </span>
        </div>

        <div class="player-card-name">
            ${name}
        </div>

        <div class="player-card-club">
            ${club}
        </div>

        <div class="player-card-rarity rarity-${rarity.toLowerCase()}">
            ${rarity}
        </div>

        <div class="player-card-status">
            ${selected ? "✓ Selected" : "Click to select"}
        </div>
    `;
}

/* =========================================================
   BUILD ROSTER — ADD / REMOVE PLAYER
   ========================================================= */

function toggleBuildRosterPlayer(player) {

    const required =
        GAME_CONFIG
            .BUILD_ROSTER
            .REQUIRED_PLAYERS;

    const selected =
        GAME_STATE.buildRoster.players;

    const existingIndex =
        selected.findIndex(
            function (item) {
                return item.id === player.id;
            }
        );

    if (existingIndex !== -1) {

        selected.splice(
            existingIndex,
            1
        );

        renderRosterPlayers();

        return;
    }

    if (
        selected.length >= required
    ) {

        showNotification(
            "You can only select " +
            required +
            " players.",
            "error"
        );

        return;
    }

    selected.push(
        sanitizePlayer(player)
    );

    renderRosterPlayers();
}

/* =========================================================
   ROSTER COUNT
   ========================================================= */

function updateRosterCount() {

    const element =
        getElement("rosterCount");

    if (!element) {
        return;
    }

    const selected =
        GAME_STATE.buildRoster.players.length;

    const required =
        GAME_CONFIG
            .BUILD_ROSTER
            .REQUIRED_PLAYERS;

    element.textContent =
        selected +
        " / " +
        required;
}

/* =========================================================
   START ROSTER BUTTON
   ========================================================= */

function updateStartRosterButton() {

    const button =
        getElement(
            "startRosterSeasonButton"
        );

    if (!button) {
        return;
    }

    const ready =
        GAME_STATE.buildRoster.players.length ===
        GAME_CONFIG
            .BUILD_ROSTER
            .REQUIRED_PLAYERS;

    button.disabled =
        !ready;
}

/* =========================================================
   START BUILD ROSTER SEASON
   ========================================================= */

function startRosterSeason() {

    const required =
        GAME_CONFIG
            .BUILD_ROSTER
            .REQUIRED_PLAYERS;

    const state =
        GAME_STATE.buildRoster;

    if (
        !state.club
    ) {

        showNotification(
            "Please choose a club first.",
            "error"
        );

        return;
    }

    if (
        state.players.length !== required
    ) {

        showNotification(
            "You need exactly " +
            required +
            " players.",
            "error"
        );

        return;
    }

    state.season =
        Math.max(
            1,
            safeInteger(
                state.season,
                1
            )
        );

    state.matchNumber = 1;
    state.points = 0;

    state.wins = 0;
    state.draws = 0;
    state.losses = 0;

    state.history = [];

    GAME_STATE.lastCompletedMode =
        null;

    saveAllGameData();

    renderRosterSeason();

    showScreen(
        "rosterSeason"
    );
}

/* =========================================================
   RENDER BUILD ROSTER SEASON
   ========================================================= */

function renderRosterSeason() {

    const state =
        GAME_STATE.buildRoster;

    setText(
        "rosterMatchNumber",
        String(
            Math.min(
                state.matchNumber,
                GAME_CONFIG.SEASON.MATCHES
            )
        )
    );

    setText(
        "rosterSeasonPoints",
        String(
            state.points
        )
    );

    setText(
        "rosterWins",
        String(
            state.wins
        )
    );

    setText(
        "rosterDraws",
        String(
            state.draws
        )
    );

    setText(
        "rosterLosses",
        String(
            state.losses
        )
    );

    const nextMatch =
        getElement(
            "rosterNextMatch"
        );

    if (nextMatch) {

        if (
            state.matchNumber >
            GAME_CONFIG.SEASON.MATCHES
        ) {

            nextMatch.textContent =
                "Season complete";

        } else {

            nextMatch.textContent =
                "Match " +
                state.matchNumber +
                " of " +
                GAME_CONFIG.SEASON.MATCHES;
        }
    }

    renderRosterHistory();

    renderLeagueTable();
}

/* =========================================================
   PLAY BUILD ROSTER MATCH
   ========================================================= */

function playBuildRosterMatch() {

    const state =
        GAME_STATE.buildRoster;

    if (
        state.players.length !==
        GAME_CONFIG
            .BUILD_ROSTER
            .REQUIRED_PLAYERS
    ) {

        showNotification(
            "Your roster is not complete.",
            "error"
        );

        return;
    }

    if (
        state.matchNumber >
        GAME_CONFIG.SEASON.MATCHES
    ) {

        showPresentation(
            "buildRoster"
        );

        return;
    }

    const opponent =
        getRandomOpponentClub(
            state.league,
            state.club
        );

    const squadRating =
        calculateSquadRating(
            state.players
        );

    const opponentRating =
        getClubRating(
            opponent
        );

    GAME_STATE.currentMatch = {

        mode: "buildRoster",

        competition:
            state.league,

        homeTeam:
            state.club,

        awayTeam:
            opponent,

        homeRating:
            squadRating,

        awayRating:
            opponentRating,

        matchNumber:
            state.matchNumber,

        returnScreen:
            "rosterSeason"
    };

    showMatchScreen();
}

/* =========================================================
   SIMULATE BUILD ROSTER SEASON
   ========================================================= */

function simulateBuildRosterSeason() {

    const state =
        GAME_STATE.buildRoster;

    if (
        state.players.length !==
        GAME_CONFIG
            .BUILD_ROSTER
            .REQUIRED_PLAYERS
    ) {

        showNotification(
            "Complete your roster first.",
            "error"
        );

        return;
    }

    if (
        state.matchNumber >
        GAME_CONFIG.SEASON.MATCHES
    ) {

        showPresentation(
            "buildRoster"
        );

        return;
    }

    while (
        state.matchNumber <=
        GAME_CONFIG.SEASON.MATCHES
    ) {

        const opponent =
            getRandomOpponentClub(
                state.league,
                state.club
            );

        const homeRating =
            calculateSquadRating(
                state.players
            );

        const awayRating =
            getClubRating(
                opponent
            );

        const result =
            simulateFootballMatch(
                homeRating,
                awayRating
            );

        finishBuildRosterMatch(
            opponent,
            result
        );
    }

    saveAllGameData();

    showPresentation(
        "buildRoster"
    );
}

/* =========================================================
   FINISH BUILD ROSTER MATCH
   ========================================================= */

function finishBuildRosterMatch(
    opponent,
    result
) {

    const state =
        GAME_STATE.buildRoster;

    const points =
        getResultPoints(
            result.result,
            "buildRoster"
        );

    const match = {

        matchNumber:
            state.matchNumber,

        opponent:
            opponent,

        opponentRating:
            result.awayRating,

        homeRating:
            result.homeRating,

        homeScore:
            result.homeScore,

        awayScore:
            result.awayScore,

        result:
            result.result,

        points:
            points,

        date:
            getTimestamp()
    };

    state.history.push(
        match
    );

    if (
        result.result === "win"
    ) {

        state.wins++;

    } else if (
        result.result === "draw"
    ) {

        state.draws++;

    } else {

        state.losses++;
    }

    state.points += points;

    state.matchNumber++;

    saveAllGameData();
}

/* =========================================================
   ROSTER HISTORY
   ========================================================= */

function renderRosterHistory() {

    const container =
        getElement(
            "rosterMatchHistory"
        );

    if (!container) {
        return;
    }

    const history =
        GAME_STATE
            .buildRoster
            .history;

    container.innerHTML = "";

    if (
        history.length === 0
    ) {

        container.innerHTML =
            "<p>No matches played yet.</p>";

        return;
    }

    history.forEach(
        function (match) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "history-row";

            row.innerHTML = `
                <span>
                    Match ${escapeHTML(
                        String(match.matchNumber)
                    )}
                </span>

                <span>
                    ${escapeHTML(
                        String(match.opponent)
                    )}
                </span>

                <span>
                    ${escapeHTML(
                        String(match.homeScore)
                    )}
                    -
                    ${escapeHTML(
                        String(match.awayScore)
                    )}
                </span>

                <strong>
                    ${escapeHTML(
                        String(match.result)
                    )}
                </strong>

                <span>
                    +${escapeHTML(
                        String(match.points)
                    )} pts
                </span>
            `;

            container.appendChild(
                row
            );
        }
    );
}

/* =========================================================
   LEAGUE TABLE
   ========================================================= */

function renderLeagueTable() {

    const container =
        getElement(
            "rosterLeagueTable"
        );

    if (!container) {
        return;
    }

    const state =
        GAME_STATE.buildRoster;

    const rows = [];

    rows.push({
        team:
            state.club ||
            "Your Team",

        played:
            state.history.length,

        wins:
            state.wins,

        draws:
            state.draws,

        losses:
            state.losses,

        points:
            state.points
    });

    state.history.forEach(
        function (match) {

            rows.push({
                team:
                    match.opponent,

                played:
                    1,

                wins:
                    match.result === "loss"
                        ? 1
                        : 0,

                draws:
                    match.result === "draw"
                        ? 1
                        : 0,

                losses:
                    match.result === "win"
                        ? 1
                        : 0,

                points:
                    match.result === "loss"
                        ? 100
                        : match.result === "draw"
                            ? 50
                            : 0
            });
        }
    );

    rows.sort(
        function (a, b) {

            return (
                b.points -
                a.points
            );
        }
    );

    container.innerHTML = `
        <div class="table-header">
            <span>#</span>
            <span>Team</span>
            <span>P</span>
            <span>W</span>
            <span>D</span>
            <span>L</span>
            <span>Pts</span>
        </div>
    `;

    rows.forEach(
        function (row, index) {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "table-row";

            if (
                row.team === state.club
            ) {

                element.classList.add(
                    "your-team"
                );
            }

            element.innerHTML = `
                <span>
                    ${index + 1}
                </span>

                <span>
                    ${escapeHTML(
                        String(row.team)
                    )}
                </span>

                <span>
                    ${row.played}
                </span>

                <span>
                    ${row.wins}
                </span>

                <span>
                    ${row.draws}
                </span>

                <span>
                    ${row.losses}
                </span>

                <span>
                    ${row.points}
                </span>
            `;

            container.appendChild(
                element
            );
        }
    );
}

/* =========================================================
   SUPER SQUAD — CREATE TEAM
   ========================================================= */

function createSuperSquad() {

    const input =
        getElement("teamName");

    if (!input) {
        return;
    }

    const validation =
        validateTeamName(
            input.value
        );

    if (
        !validation.valid
    ) {

        showNotification(
            validation.message,
            "error"
        );

        return;
    }

    const state =
        GAME_STATE.superSquad;

    if (
        !state.teamName
    ) {

        state.points = 0;
        state.coins = 500;

        state.collection = [];
        state.lineup = [];

        state.season = 1;
        state.matchNumber = 1;

        state.wins = 0;
        state.draws = 0;
        state.losses = 0;

        state.history = [];
    }

    state.teamName =
        validation.name;

    saveAllGameData();

    updateSuperSquadUI();

    showNotification(
        "Welcome to Super Squad, " +
        state.teamName +
        "!",
        "success"
    );

    showScreen(
        "superSquad"
    );
}

/* =========================================================
   SUPER SQUAD DIFFICULTY
   ========================================================= */

function setSuperSquadDifficulty(
    difficulty
) {

    if (
        difficulty !== "easy" &&
        difficulty !== "hard"
    ) {

        return;
    }

    GAME_STATE
        .superSquad
        .difficulty =
        difficulty;

    saveAllGameData();

    updateSuperSquadUI();

    showNotification(
        difficulty === "hard"
            ? "Hard difficulty selected."
            : "Easy difficulty selected.",
        "info"
    );
}

/* =========================================================
   SUPER SQUAD MATCH
   ========================================================= */

function playSuperSquadMatch() {

    const state =
        GAME_STATE.superSquad;

    if (!state.teamName) {

        showNotification(
            "Create your club first.",
            "error"
        );

        return;
    }

    if (
        state.lineup.length !==
        GAME_CONFIG
            .SUPER_SQUAD
            .REQUIRED_PLAYERS
    ) {

        showNotification(
            "You need exactly " +
            GAME_CONFIG
                .SUPER_SQUAD
                .REQUIRED_PLAYERS +
            " players in your starting XI.",
            "error"
        );

        return;
    }

    if (
        state.matchNumber >
        GAME_CONFIG.SEASON.MATCHES
    ) {

        showPresentation(
            "superSquad"
        );

        return;
    }

    const lineupPlayers =
        state.lineup
            .map(
                function (id) {

                    return findPlayerById(
                        state.collection,
                        id
                    );
                }
            )
            .filter(Boolean);

    if (
        lineupPlayers.length !==
        GAME_CONFIG
            .SUPER_SQUAD
            .REQUIRED_PLAYERS
    ) {

        showNotification(
            "Your starting XI contains invalid players.",
            "error"
        );

        return;
    }

    const opponent =
        getRandomOpponentClub(
            null,
            state.teamName
        );

    const homeRating =
        calculateSquadRating(
            lineupPlayers
        );

    const difficultyConfig =
        state.difficulty === "hard"
            ? GAME_CONFIG
                .SUPER_SQUAD
                .DIFFICULTY
                .HARD
            : GAME_CONFIG
                .SUPER_SQUAD
                .DIFFICULTY
                .EASY;

    const awayRating =
        randomInt(
            difficultyConfig
                .MIN_OPPONENT_RATING,

            difficultyConfig
                .MAX_OPPONENT_RATING
        );

    GAME_STATE.currentMatch = {

        mode: "superSquad",

        competition:
            "Super League Soccer",

        homeTeam:
            state.teamName,

        awayTeam:
            opponent,

        homeRating:
            homeRating,

        awayRating:
            awayRating,

        matchNumber:
            state.matchNumber,

        returnScreen:
            "superSquad"
    };

    showMatchScreen();
}

/* =========================================================
   UPDATE SUPER SQUAD UI
   ========================================================= */

function updateSuperSquadUI() {

    const state =
        GAME_STATE.superSquad;

    setText(
        "superSquadTeamName",
        state.teamName || "No Club"
    );

    setText(
        "superSquadPoints",
        String(state.points)
    );

    setText(
        "collectionCount",
        String(
            state.collection.length
        )
    );

    setText(
        "superSquadMatchNumber",
        String(
            Math.min(
                state.matchNumber,
                GAME_CONFIG.SEASON.MATCHES
            )
        )
    );

    const rating =
        calculateLineupRating();

    setText(
        "superSquadRating",
        String(rating)
    );

    setText(
        "startingXIcount",
        state.lineup.length +
        " / " +
        GAME_CONFIG
            .SUPER_SQUAD
            .REQUIRED_PLAYERS
    );

    renderStartingXI();

    updateDifficultyButtons();

    updatePackButtons();
}

/* =========================================================
   LINEUP RATING
   ========================================================= */

function calculateLineupRating() {

    const players =
        GAME_STATE
            .superSquad
            .lineup
            .map(
                function (id) {

                    return findPlayerById(
                        GAME_STATE
                            .superSquad
                            .collection,
                        id
                    );
                }
            )
            .filter(Boolean);

    if (
        players.length === 0
    ) {

        return 0;
    }

    return calculateSquadRating(
        players
    );
}

/* =========================================================
   STARTING XI DISPLAY
   ========================================================= */

function renderStartingXI() {

    const container =
        getElement(
            "startingXI"
        );

    if (!container) {
        return;
    }

    const state =
        GAME_STATE.superSquad;

    container.innerHTML = "";

    if (
        state.lineup.length === 0
    ) {

        container.innerHTML =
            "<p>No players selected.</p>";

        return;
    }

    state.lineup.forEach(
        function (id, index) {

            const player =
                findPlayerById(
                    state.collection,
                    id
                );

            if (!player) {
                return;
            }

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "lineup-player";

            element.innerHTML = `
                <span>
                    ${index + 1}.
                </span>

                <strong>
                    ${escapeHTML(
                        player.name
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        player.position
                    )}
                </span>

                <span>
                    ${player.rating}
                </span>

                <button
                    type="button"
                    class="remove-lineup-player"
                    data-player-id="${escapeAttribute(
                        player.id
                    )}"
                >
                    Remove
                </button>
            `;

            const removeButton =
                element.querySelector(
                    ".remove-lineup-player"
                );

            if (removeButton) {

                removeButton.addEventListener(
                    "click",
                    function () {

                        removeFromLineup(
                            player.id
                        );
                    }
                );
            }

            container.appendChild(
                element
            );
        }
    );
}

/* =========================================================
   REMOVE FROM LINEUP
   ========================================================= */

function removeFromLineup(
    playerId
) {

    const lineup =
        GAME_STATE
            .superSquad
            .lineup;

    const index =
        lineup.indexOf(
            playerId
        );

    if (
        index === -1
    ) {
        return;
    }

    lineup.splice(
        index,
        1
    );

    saveAllGameData();

    updateSuperSquadUI();
}

/* =========================================================
   DIFFICULTY BUTTONS
   ========================================================= */

function updateDifficultyButtons() {

    const easy =
        getElement(
            "easyDifficultyButton"
        );

    const hard =
        getElement(
            "hardDifficultyButton"
        );

    if (easy) {

        easy.classList.toggle(
            "active",
            GAME_STATE
                .superSquad
                .difficulty === "easy"
        );
    }

    if (hard) {

        hard.classList.toggle(
            "active",
            GAME_STATE
                .superSquad
                .difficulty === "hard"
        );
    }
}

/* =========================================================
   PACK BUTTONS
   ========================================================= */

function updatePackButtons() {

    const state =
        GAME_STATE.superSquad;

    const packs = [
        {
            id: "bronzePackButton",
            type: "bronze"
        },
        {
            id: "goldPackButton",
            type: "gold"
        },
        {
            id: "iconPackButton",
            type: "icon"
        }
    ];

    packs.forEach(
        function (pack) {

            const button =
                getElement(pack.id);

            if (!button) {
                return;
            }

            const config =
                getPackConfig(
                    pack.type
                );

            button.disabled =
                state.points <
                config.COST;
        }
    );
}

/* =========================================================
   PACK CONFIG
   ========================================================= */

function getPackConfig(
    packType
) {

    switch (
        String(
            packType
        ).toLowerCase()
    ) {

        case "bronze":
            return GAME_CONFIG.PACKS.BRONZE;

        case "gold":
            return GAME_CONFIG.PACKS.GOLD;

        case "icon":
            return GAME_CONFIG.PACKS.ICON;

        default:
            return GAME_CONFIG.PACKS.BRONZE;
    }
}

/* =========================================================
   OPEN PACK
   ========================================================= */

function openPack(
    packType
) {

    const state =
        GAME_STATE.superSquad;

    if (!state.teamName) {

        showNotification(
            "Create your club first.",
            "error"
        );

        return;
    }

    const config =
        getPackConfig(
            packType
        );

    if (
        state.points <
        config.COST
    ) {

        showNotification(
            "You don't have enough points.",
            "error"
        );

        return;
    }

    state.points -=
        config.COST;

    let cards = [];

    try {

        cards =
            generatePackCards(
                packType,
                config.CARDS
            );

    } catch (error) {

        console.error(
            "Pack generation error:",
            error
        );

        state.points +=
            config.COST;

        showNotification(
            "The pack could not be opened. Your points were refunded.",
            "error"
        );

        return;
    }

    cards.forEach(
        function (card) {

            if (!card) {
                return;
            }

            const exists =
                state.collection.some(
                    function (item) {
                        return (
                            item.id ===
                            card.id
                        );
                    }
                );

            if (!exists) {

                state.collection.push(
                    card
                );
            }
        }
    );

    saveAllGameData();

    updateSuperSquadUI();

    renderCollection();

    showPackResults(
        packType,
        cards
    );
}

/* =========================================================
   GENERATE PACK CARDS
   ========================================================= */

function generatePackCards(
    packType,
    count
) {

    const cards = [];

    const safeCount =
        Math.max(
            1,
            safeInteger(
                count,
                1
            )
        );

    for (
        let i = 0;
        i < safeCount;
        i++
    ) {

        let rarity =
            choosePackRarity(
                packType
            );

        let player =
            getRandomPlayerByRarity(
                rarity
            );

        if (!player) {

            player =
                getRandomCollectionEligiblePlayer();
        }

        if (!player) {
            continue;
        }

        cards.push(
            sanitizePlayer(
                player
            )
        );
    }

    return cards;
}

/* =========================================================
   PACK RESULTS
   ========================================================= */

function showPackResults(
    packType,
    cards
) {

    const config =
        getPackConfig(
            packType
        );

    const title =
        config.NAME ||
        "Pack Opened";

    let body =
        "<div class=\"pack-results\">";

    if (
        !Array.isArray(cards) ||
        cards.length === 0
    ) {

        body +=
            "<p>No cards were generated.</p>";

    } else {

        cards.forEach(
            function (player) {

                body += `
                    <div class="pack-result-card">
                        <strong>
                            ${escapeHTML(
                                player.name
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                player.position
                            )}
                        </span>

                        <span>
                            ${player.rating}
                        </span>

                        <span>
                            ${escapeHTML(
                                player.rarity ||
                                "Common"
                            )}
                        </span>

                        <small>
                            ${escapeHTML(
                                player.club
                            )}
                        </small>
                    </div>
                `;
            }
        );
    }

    body += "</div>";

    showModal(
        title,
        body
    );
}

/* =========================================================
   PACK RARITY
   ========================================================= */

function choosePackRarity(
    packType
) {

    const config =
        getPackConfig(
            packType
        );

    const odds =
        config.ODDS ||
        {};

    const roll =
        randomInt(
            1,
            100
        );

    let total = 0;

    const rarities = [
        "Icon",
        "Rare",
        "Common"
    ];

    for (
        let i = 0;
        i < rarities.length;
        i++
    ) {

        const rarity =
            rarities[i];

        const chance =
            Number(
                odds[rarity] || 0
            );

        total +=
            chance;

        if (
            roll <= total
        ) {

            return rarity;
        }
    }

    return "Common";
}

/* =========================================================
   RANDOM PLAYER BY RARITY
   ========================================================= */

function getRandomPlayerByRarity(
    rarity
) {

    let players = [];

    if (
        typeof getPlayersByRarity ===
        "function"
    ) {

        players =
            getPlayersByRarity(
                rarity
            );
    }

    if (
        !Array.isArray(players) ||
        players.length === 0
    ) {

        if (
            rarity === "Icon" &&
            typeof getIcons ===
            "function"
        ) {

            players =
                getIcons();
        }
    }

    if (
        !Array.isArray(players) ||
        players.length === 0
    ) {

        return null;
    }

    return players[
        randomInt(
            0,
            players.length - 1
        )
    ];
}

/* =========================================================
   FALLBACK RANDOM PLAYER
   ========================================================= */

function getRandomCollectionEligiblePlayer() {

    let players = [];

    if (
        typeof getAllPlayers ===
        "function"
    ) {

        players =
            getAllPlayers();
    }

    if (
        !Array.isArray(players)
    ) {

        players = [];
    }

    if (
        players.length === 0
    ) {

        return null;
    }

    return players[
        randomInt(
            0,
            players.length - 1
        )
    ];
}
/* =========================================================
   MATCH SCREEN
   ========================================================= */

function showMatchScreen() {

    const match =
        GAME_STATE.currentMatch;

    if (!match) {

        showNotification(
            "No match is ready.",
            "error"
        );

        return;
    }

    setText(
        "matchCompetition",
        match.competition
    );

    setText(
        "homeTeamName",
        match.homeTeam
    );

    setText(
        "awayTeamName",
        match.awayTeam
    );

    setText(
        "homeRating",
        String(match.homeRating)
    );

    setText(
        "awayRating",
        String(match.awayRating)
    );

    setText(
        "homeScore",
        "0"
    );

    setText(
        "awayScore",
        "0"
    );

    setText(
        "matchMinute",
        "0'"
    );

    setText(
        "matchVenue",
        "Super League Stadium"
    );

    const events =
        getElement("matchEvents");

    if (events) {
        events.innerHTML =
            "<p>Match ready to begin.</p>";
    }

    const result =
        getElement("matchResult");

    if (result) {
        result.innerHTML = "";
    }

    const button =
        getElement(
            "simulateMatchButton"
        );

    if (button) {
        button.disabled = false;
    }

    showScreen("match");
}

/* =========================================================
   SIMULATE CURRENT MATCH
   ========================================================= */

function simulateCurrentMatch() {

    const match =
        GAME_STATE.currentMatch;

    if (!match) {

        showNotification(
            "No match found.",
            "error"
        );

        return;
    }

    const button =
        getElement(
            "simulateMatchButton"
        );

    if (button) {
        button.disabled = true;
    }

    const result =
        simulateFootballMatch(
            match.homeRating,
            match.awayRating
        );

    displayMatchResult(
        match,
        result
    );

    setTimeout(
        function () {

            if (
                match.mode ===
                "buildRoster"
            ) {

                finishBuildRosterMatch(
                    match.awayTeam,
                    result
                );

            } else if (
                match.mode ===
                "superSquad"
            ) {

                finishSuperSquadMatch(
                    match.awayTeam,
                    result
                );
            }

            GAME_STATE.currentMatch =
                null;

            saveAllGameData();

            updateAllUI();

            if (
                match.mode ===
                "buildRoster"
            ) {

                if (
                    GAME_STATE
                        .buildRoster
                        .matchNumber >
                    GAME_CONFIG.SEASON.MATCHES
                ) {

                    showPresentation(
                        "buildRoster"
                    );

                } else {

                    renderRosterSeason();

                    showScreen(
                        "rosterSeason"
                    );
                }

            } else {

                if (
                    GAME_STATE
                        .superSquad
                        .matchNumber >
                    GAME_CONFIG.SEASON.MATCHES
                ) {

                    showPresentation(
                        "superSquad"
                    );

                } else {

                    updateSuperSquadUI();

                    showScreen(
                        "superSquad"
                    );
                }
            }

        },
        900
    );
}

/* =========================================================
   DISPLAY MATCH RESULT
   ========================================================= */

function displayMatchResult(
    match,
    result
) {

    setText(
        "homeScore",
        String(result.homeScore)
    );

    setText(
        "awayScore",
        String(result.awayScore)
    );

    setText(
        "matchMinute",
        "90'"
    );

    const events =
        getElement("matchEvents");

    if (events) {

        events.innerHTML = "";

        const sortedEvents =
            Array.isArray(result.events)
                ? result.events.slice().sort(
                    function (a, b) {
                        return (
                            Number(a.minute || 0) -
                            Number(b.minute || 0)
                        );
                    }
                )
                : [];

        if (
            sortedEvents.length === 0
        ) {

            events.innerHTML =
                "<p>No major events.</p>";

        } else {

            sortedEvents.forEach(
                function (event) {

                    const row =
                        document.createElement(
                            "div"
                        );

                    row.className =
                        "match-event";

                    row.innerHTML = `
                        <span>
                            ${escapeHTML(
                                String(
                                    event.minute || 0
                                )
                            )}'
                        </span>

                        <span>
                            ${escapeHTML(
                                event.text ||
                                "Match event"
                            )}
                        </span>
                    `;

                    events.appendChild(
                        row
                    );
                }
            );
        }
    }

    const resultBox =
        getElement(
            "matchResult"
        );

    if (resultBox) {

        let title =
            "DRAW";

        if (
            result.result === "win"
        ) {

            title =
                match.mode ===
                "superSquad"
                    ? "YOU WIN!"
                    : "YOU WIN!";

        } else if (
            result.result === "loss"
        ) {

            title =
                "DEFEAT";
        }

        const points =
            getResultPoints(
                result.result,
                match.mode
            );

        resultBox.innerHTML = `
            <h2>
                ${escapeHTML(title)}
            </h2>

            <p>
                ${escapeHTML(
                    String(result.homeScore)
                )}
                -
                ${escapeHTML(
                    String(result.awayScore)
                )}
            </p>

            <p>
                Points earned:
                <strong>
                    ${points}
                </strong>
            </p>
        `;
    }
}

/* =========================================================
   SUPER SQUAD MATCH FINISH
   ========================================================= */

function finishSuperSquadMatch(
    opponent,
    result
) {

    const state =
        GAME_STATE.superSquad;

    const points =
        getResultPoints(
            result.result,
            "superSquad"
        );

    const match = {

        matchNumber:
            state.matchNumber,

        opponent:
            opponent,

        opponentRating:
            result.awayRating,

        homeRating:
            result.homeRating,

        homeScore:
            result.homeScore,

        awayScore:
            result.awayScore,

        result:
            result.result,

        points:
            points,

        difficulty:
            state.difficulty,

        date:
            getTimestamp()
    };

    state.history.push(
        match
    );

    if (
        result.result === "win"
    ) {

        state.wins++;

    } else if (
        result.result === "draw"
    ) {

        state.draws++;

    } else {

        state.losses++;
    }

    state.points +=
        points;

    state.matchNumber++;

    saveAllGameData();

    renderSuperSquadHistory();
}

/* =========================================================
   SUPER SQUAD HISTORY
   ========================================================= */

function renderSuperSquadHistory() {

    const container =
        getElement(
            "superSquadMatchHistory"
        );

    if (!container) {
        return;
    }

    const history =
        GAME_STATE
            .superSquad
            .history;

    container.innerHTML = "";

    if (
        history.length === 0
    ) {

        container.innerHTML =
            "<p>No matches played yet.</p>";

        return;
    }

    history.forEach(
        function (match) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "history-row";

            row.innerHTML = `
                <span>
                    Match ${escapeHTML(
                        String(match.matchNumber)
                    )}
                </span>

                <span>
                    ${escapeHTML(
                        String(match.opponent)
                    )}
                </span>

                <span>
                    ${escapeHTML(
                        String(match.homeScore)
                    )}
                    -
                    ${escapeHTML(
                        String(match.awayScore)
                    )}
                </span>

                <strong>
                    ${escapeHTML(
                        String(match.result)
                    )}
                </strong>

                <span>
                    +${escapeHTML(
                        String(match.points)
                    )} pts
                </span>
            `;

            container.appendChild(
                row
            );
        }
    );
}

/* =========================================================
   COLLECTION
   ========================================================= */

function renderCollection() {

    const state =
        GAME_STATE.superSquad;

    const collection =
        Array.isArray(
            state.collection
        )
            ? state.collection
            : [];

    setText(
        "totalCards",
        String(
            collection.length
        )
    );

    setText(
        "commonCards",
        String(
            collection.filter(
                function (player) {
                    return (
                        player.rarity ===
                        "Common"
                    );
                }
            ).length
        )
    );

    setText(
        "rareCards",
        String(
            collection.filter(
                function (player) {
                    return (
                        player.rarity ===
                        "Rare"
                    );
                }
            ).length
        )
    );

    setText(
        "iconCards",
        String(
            collection.filter(
                function (player) {
                    return (
                        player.rarity ===
                        "Icon"
                    );
                }
            ).length
        )
    );

    const container =
        getElement(
            "collectionPlayers"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    let filtered =
        collection.slice();

    if (
        GAME_STATE.collectionFilter !==
        "all"
    ) {

        filtered =
            filtered.filter(
                function (player) {

                    return (
                        player.rarity ===
                        GAME_STATE.collectionFilter
                    );
                }
            );
    }

    if (
        filtered.length === 0
    ) {

        container.innerHTML =
            "<p>No cards found.</p>";

        return;
    }

    filtered
        .sort(
            function (a, b) {
                return (
                    Number(b.rating || 0) -
                    Number(a.rating || 0)
                );
            }
        )
        .forEach(
            function (player) {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "player-card";

                card.innerHTML =
                    createPlayerCardHTML(
                        player,
                        GAME_STATE
                            .superSquad
                            .lineup
                            .includes(
                                player.id
                            )
                    );

                const lineupButton =
                    document.createElement(
                        "button"
                    );

                lineupButton.type =
                    "button";

                const inLineup =
                    GAME_STATE
                        .superSquad
                        .lineup
                        .includes(
                            player.id
                        );

                lineupButton.textContent =
                    inLineup
                        ? "Remove from XI"
                        : "Add to XI";

                lineupButton.addEventListener(
                    "click",
                    function () {

                        toggleLineupPlayer(
                            player.id
                        );
                    }
                );

                card.appendChild(
                    lineupButton
                );

                container.appendChild(
                    card
                );
            }
        );
}

/* =========================================================
   COLLECTION FILTER
   ========================================================= */

function setCollectionFilter(
    filter
) {

    const validFilters = [
        "all",
        "Common",
        "Rare",
        "Icon"
    ];

    if (
        !validFilters.includes(
            filter
        )
    ) {

        filter = "all";
    }

    GAME_STATE.collectionFilter =
        filter;

    renderCollection();
}

/* =========================================================
   TOGGLE LINEUP PLAYER
   ========================================================= */

function toggleLineupPlayer(
    playerId
) {

    const state =
        GAME_STATE.superSquad;

    const lineup =
        state.lineup;

    const index =
        lineup.indexOf(
            playerId
        );

    if (
        index !== -1
    ) {

        lineup.splice(
            index,
            1
        );

    } else {

        if (
            lineup.length >=
            GAME_CONFIG
                .SUPER_SQUAD
                .REQUIRED_PLAYERS
        ) {

            showNotification(
                "Your starting XI is already full.",
                "error"
            );

            return;
        }

        const player =
            findPlayerById(
                state.collection,
                playerId
            );

        if (!player) {

            showNotification(
                "Player not found.",
                "error"
            );

            return;
        }

        lineup.push(
            playerId
        );
    }

    saveAllGameData();

    renderCollection();

    updateSuperSquadUI();
}

/* =========================================================
   PRESENTATION
   ========================================================= */

function showPresentation(
    mode
) {

    if (
        mode !== "buildRoster" &&
        mode !== "superSquad"
    ) {

        return;
    }

    GAME_STATE.lastCompletedMode =
        mode;

    let state;

    if (
        mode === "buildRoster"
    ) {

        state =
            GAME_STATE.buildRoster;

    } else {

        state =
            GAME_STATE.superSquad;
    }

    setText(
        "presentationTeamName",
        mode === "superSquad"
            ? state.teamName
            : state.club
    );

    setText(
        "presentationWins",
        String(state.wins)
    );

    setText(
        "presentationDraws",
        String(state.draws)
    );

    setText(
        "presentationLosses",
        String(state.losses)
    );

    setText(
        "presentationPoints",
        String(state.points)
    );

    setText(
        "presentationSeason",
        String(state.season)
    );

    const results =
        getElement(
            "presentationResults"
        );

    if (results) {

        results.innerHTML = "";

        const history =
            Array.isArray(
                state.history
            )
                ? state.history
                : [];

        history.forEach(
            function (match) {

                const row =
                    document.createElement(
                        "div"
                    );

                row.className =
                    "presentation-result";

                row.innerHTML = `
                    <span>
                        Match ${escapeHTML(
                            String(
                                match.matchNumber
                            )
                        )}
                    </span>

                    <span>
                        vs ${escapeHTML(
                            String(
                                match.opponent
                            )
                        )}
                    </span>

                    <span>
                        ${escapeHTML(
                            String(
                                match.homeScore
                            )
                        )}
                        -
                        ${escapeHTML(
                            String(
                                match.awayScore
                            )
                        )}
                    </span>

                    <strong>
                        ${escapeHTML(
                            String(
                                match.result
                            )
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            String(
                                match.points
                            )
                        )} pts
                    </span>
                `;

                results.appendChild(
                    row
                );
            }
        );
    }

    saveAllGameData();

    showScreen(
        "presentation"
    );
}

/* =========================================================
   NEW SEASON
   ========================================================= */

function startNewSeason() {

    const mode =
        GAME_STATE.lastCompletedMode;

    if (
        mode === "buildRoster"
    ) {

        const state =
            GAME_STATE.buildRoster;

        state.season++;

        state.matchNumber = 1;

        state.points = 0;

        state.wins = 0;
        state.draws = 0;
        state.losses = 0;

        state.history = [];

        saveAllGameData();

        renderRosterSeason();

        showScreen(
            "rosterSeason"
        );

        return;
    }

    if (
        mode === "superSquad"
    ) {

        const state =
            GAME_STATE.superSquad;

        state.season++;

        state.matchNumber = 1;

        state.wins = 0;
        state.draws = 0;
        state.losses = 0;

        state.history = [];

        saveAllGameData();

        updateSuperSquadUI();

        showScreen(
            "superSquad"
        );

        return;
    }

    showScreen(
        "mainMenu"
    );
}

/* =========================================================
   RESET GAME
   ========================================================= */

function resetGame() {

    const confirmed =
        window.confirm(
            "Are you sure you want to reset all game progress?"
        );

    if (!confirmed) {
        return;
    }

    try {

        removeFromStorage(
            GAME_CONFIG
                .STORAGE_KEYS
                .BUILD_ROSTER
        );

        removeFromStorage(
            GAME_CONFIG
                .STORAGE_KEYS
                .SUPER_SQUAD
        );

    } catch (error) {

        console.error(
            "Storage reset error:",
            error
        );
    }

    window.location.reload();
}

/* =========================================================
   UPDATE EVERYTHING
   ========================================================= */

function updateAllUI() {

    try {

        renderRosterSeason();

        updateSuperSquadUI();

        renderSuperSquadHistory();

        renderCollection();

        updateHeaderResources();

    } catch (error) {

        console.error(
            "UI update error:",
            error
        );
    }
}

/* =========================================================
   HEADER RESOURCES
   ========================================================= */

function updateHeaderResources() {

    const points =
        GAME_STATE
            .superSquad
            .points;

    const coins =
        GAME_STATE
            .superSquad
            .coins;

    setText(
        "headerPoints",
        String(points)
    );

    setText(
        "headerCoins",
        String(coins)
    );

    setText(
        "pointsDisplay",
        String(points)
    );

    setText(
        "coinsDisplay",
        String(coins)
    );
}

/* =========================================================
   FOOTBALL MATCH SIMULATION
   ========================================================= */

function simulateFootballMatch(
    homeRating,
    awayRating
) {

    const home =
        clamp(
            safeInteger(
                homeRating,
                75
            ),
            1,
            99
        );

    const away =
        clamp(
            safeInteger(
                awayRating,
                75
            ),
            1,
            99
        );

    /*
       Rating advantage influences the
       probability, but randomness keeps
       matches unpredictable.
    */

    const difference =
        home - away;

    const homeChance =
        clamp(
            50 +
            difference * 1.4,
            15,
            85
        );

    const roll =
        Math.random() * 100;

    let result;

    if (
        roll < homeChance - 12
    ) {

        result = "win";

    } else if (
        roll < homeChance + 12
    ) {

        result = "draw";

    } else {

        result = "loss";
    }

    let homeScore;
    let awayScore;

    if (
        result === "win"
    ) {

        homeScore =
            randomInt(1, 5);

        awayScore =
            randomInt(0, homeScore - 1);

    } else if (
        result === "loss"
    ) {

        awayScore =
            randomInt(1, 5);

        homeScore =
            randomInt(0, awayScore - 1);

    } else {

        homeScore =
            randomInt(0, 3);

        awayScore =
            homeScore;
    }

    const events = [];

    for (
        let i = 0;
        i < homeScore;
        i++
    ) {

        events.push({
            minute:
                randomInt(1, 90),

            text:
                "⚽ " +
                "Goal for the home team"
        });
    }

    for (
        let i = 0;
        i < awayScore;
        i++
    ) {

        events.push({
            minute:
                randomInt(1, 90),

            text:
                "⚽ " +
                "Goal for the away team"
        });
    }

    events.sort(
        function (a, b) {
            return (
                a.minute -
                b.minute
            );
        }
    );

    return {

        result:
            result,

        homeScore:
            homeScore,

        awayScore:
            awayScore,

        homeRating:
            home,

        awayRating:
            away,

        events:
            events
    };
}

/* =========================================================
   RESULT POINTS
   ========================================================= */

function getResultPoints(
    result,
    mode
) {

    if (
        mode === "superSquad"
    ) {

        const difficulty =
            GAME_STATE
                .superSquad
                .difficulty;

        if (
            difficulty === "hard"
        ) {

            if (
                result === "win"
            ) {
                return 200;
            }

            if (
                result === "draw"
            ) {
                return 100;
            }

            return 0;
        }
    }

    if (
        result === "win"
    ) {

        return 100;
    }

    if (
        result === "draw"
    ) {

        return 50;
    }

    return 0;
}

/* =========================================================
   RATING HELPERS
   ========================================================= */

function calculateSquadRating(
    players
) {

    if (
        !Array.isArray(players) ||
        players.length === 0
    ) {

        return 0;
    }

    const ratings =
        players
            .map(
                function (player) {
                    return Number(
                        player.rating
                    );
                }
            )
            .filter(
                function (rating) {
                    return Number.isFinite(
                        rating
                    );
                }
            );

    if (
        ratings.length === 0
    ) {

        return 0;
    }

    const total =
        ratings.reduce(
            function (sum, rating) {
                return (
                    sum +
                    rating
                );
            },
            0
        );

    return Math.round(
        total /
        ratings.length
    );
}

/* =========================================================
   OPPONENT HELPERS
   ========================================================= */

function getRandomOpponentClub(
    league,
    excludeClub
) {

    let clubs = [];

    if (
        league ===
        GAME_CONFIG.LEAGUES.PREMIER_LEAGUE
    ) {

        clubs =
            GAME_CONFIG
                .PREMIER_LEAGUE_CLUBS
                .slice();

    } else if (
        league ===
        GAME_CONFIG.LEAGUES.LALIGA
    ) {

        clubs =
            GAME_CONFIG
                .LALIGA_CLUBS
                .slice();

    } else {

        if (
            Array.isArray(
                GAME_CONFIG.clubs
            )
        ) {

            clubs =
                GAME_CONFIG.clubs
                    .map(
                        function (club) {

                            return typeof club ===
                                "string"
                                ? club
                                : club.name;
                        }
                    )
                    .filter(Boolean);
        }

        if (
            clubs.length === 0
        ) {

            clubs =
                [
                    ...(
                        GAME_CONFIG
                            .PREMIER_LEAGUE_CLUBS ||
                        []
                    ),
                    ...(
                        GAME_CONFIG
                            .LALIGA_CLUBS ||
                        []
                    )
                ];
        }
    }

    clubs =
        clubs.filter(
            function (club) {
                return (
                    club !==
                    excludeClub
                );
            }
        );

    if (
        clubs.length === 0
    ) {

        return "FC United";
    }

    return clubs[
        randomInt(
            0,
            clubs.length - 1
        )
    ];
}

/* =========================================================
   TEAM NAME SLUG
   ========================================================= */

function slugify(
    value
) {

    return String(
        value || ""
    )
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );
}

/* =========================================================
   FINAL SAFETY CHECK
   ========================================================= */

window.SUPER_LEAGUE_SOCCER =
    {

        state:
            GAME_STATE,

        save:
            saveAllGameData,

        reset:
            resetGame,

        showScreen:
            showScreen
    };

console.log(
    "Super League Soccer game.js loaded."
);
