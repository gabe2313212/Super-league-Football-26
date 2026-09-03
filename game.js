```javascript
/* =========================================================
   SUPER LEAGUE SOCCER
   game.js
   Main game engine
   ========================================================= */

"use strict";

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
        coins: 500,
        difficulty: "easy",
        season: 1,
        matchNumber: 1,
        wins: 0,
        draws: 0,
        losses: 0,
        history: []
    },

    collectionFilter: "all",
    currentMatch: null
};


/* =========================================================
   CONFIG SAFETY
   ========================================================= */

(function setupConfig() {

    window.GAME_CONFIG = window.GAME_CONFIG || {};

    const config = window.GAME_CONFIG;

    config.LEAGUES = config.LEAGUES || {
        PREMIER_LEAGUE:
            config.leagues?.premierLeague ||
            "Premier League",

        LALIGA:
            config.leagues?.laLiga ||
            "LaLiga"
    };

    config.PREMIER_LEAGUE_CLUBS =
        Array.isArray(config.PREMIER_LEAGUE_CLUBS)
            ? config.PREMIER_LEAGUE_CLUBS
            : (
                Array.isArray(config.premierLeagueClubs)
                    ? config.premierLeagueClubs
                    : []
            );

    config.LALIGA_CLUBS =
        Array.isArray(config.LALIGA_CLUBS)
            ? config.LALIGA_CLUBS
            : (
                Array.isArray(config.laLigaClubs)
                    ? config.laLigaClubs
                    : []
            );

    config.SEASON = config.SEASON || {};

    config.SEASON.MATCHES =
        Number(config.SEASON.MATCHES) ||
        Number(config.seasonLength) ||
        19;

    config.BUILD_ROSTER =
        config.BUILD_ROSTER || {};

    config.BUILD_ROSTER.REQUIRED_PLAYERS =
        Number(config.BUILD_ROSTER.REQUIRED_PLAYERS) ||
        Number(config.buildRosterPlayersRequired) ||
        6;

    config.SUPER_SQUAD =
        config.SUPER_SQUAD || {};

    config.SUPER_SQUAD.REQUIRED_PLAYERS =
        Number(config.SUPER_SQUAD.REQUIRED_PLAYERS) ||
        Number(config.superSquadPlayersRequired) ||
        11;

    config.SUPER_SQUAD.DIFFICULTY =
        config.SUPER_SQUAD.DIFFICULTY || {};

    config.SUPER_SQUAD.DIFFICULTY.EASY =
        config.SUPER_SQUAD.DIFFICULTY.EASY || {
            MIN_OPPONENT_RATING:
                config.opponentRatingRanges?.easy?.[0] ?? 72,

            MAX_OPPONENT_RATING:
                config.opponentRatingRanges?.easy?.[1] ?? 84
        };

    config.SUPER_SQUAD.DIFFICULTY.HARD =
        config.SUPER_SQUAD.DIFFICULTY.HARD || {
            MIN_OPPONENT_RATING:
                config.opponentRatingRanges?.hard?.[0] ?? 82,

            MAX_OPPONENT_RATING:
                config.opponentRatingRanges?.hard?.[1] ?? 95
        };

    config.PACKS = config.PACKS || {};

    config.PACKS.BRONZE =
        config.PACKS.BRONZE || {
            NAME: "Bronze Pack",
            COST: Number(config.packCosts?.bronze) || 50
        };

    config.PACKS.GOLD =
        config.PACKS.GOLD || {
            NAME: "Gold Pack",
            COST: Number(config.packCosts?.gold) || 100
        };

    config.PACKS.ICON =
        config.PACKS.ICON || {
            NAME: "Icon Pack",
            COST: Number(config.packCosts?.icon) || 1000
        };

    config.STORAGE_KEYS =
        config.STORAGE_KEYS || {};

    config.STORAGE_KEYS.BUILD_ROSTER =
        config.STORAGE_KEYS.BUILD_ROSTER ||
        config.storageKeys?.buildRoster ||
        "buildRoster_gameState";

    config.STORAGE_KEYS.SUPER_SQUAD =
        config.STORAGE_KEYS.SUPER_SQUAD ||
        config.storageKeys?.superSquad ||
        "superSquad_gameState";

    if (!Array.isArray(config.clubs)) {
        config.clubs =
            config.PREMIER_LEAGUE_CLUBS.concat(
                config.LALIGA_CLUBS
            );
    }

})();


/* =========================================================
   DOM HELPERS
   ========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


function setText(id, value) {

    const element = getElement(id);

    if (element) {
        element.textContent =
            value === undefined ||
            value === null
                ? ""
                : String(value);
    }
}


function showElement(id) {

    const element = getElement(id);

    if (element) {
        element.hidden = false;
    }
}


function hideElement(id) {

    const element = getElement(id);

    if (element) {
        element.hidden = true;
    }
}


function bindClick(id, callback) {

    const element = getElement(id);

    if (!element) {
        console.warn(
            "Super League Soccer: missing element:",
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

                if (
                    typeof showNotification ===
                    "function"
                ) {
                    showNotification(
                        "Something went wrong. Please try again.",
                        "error"
                    );
                }
            }
        }
    );
}


/* =========================================================
   SCREEN MANAGEMENT
   ========================================================= */

function showScreen(screenName) {

    const screens =
        document.querySelectorAll(".screen");

    screens.forEach(function (screen) {
        screen.hidden = true;
    });

    const target =
        getElement(screenName + "Screen");

    if (!target) {

        console.error(
            "Super League Soccer: screen not found:",
            screenName
        );

        return;
    }

    target.hidden = false;

    GAME_STATE.currentScreen =
        screenName;

    updateAllUI();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   STORAGE
   ========================================================= */

function saveAllGameData() {

    try {

        saveToStorage(
            GAME_CONFIG.STORAGE_KEYS.BUILD_ROSTER,
            GAME_STATE.buildRoster
        );

        saveToStorage(
            GAME_CONFIG.STORAGE_KEYS.SUPER_SQUAD,
            GAME_STATE.superSquad
        );

    } catch (error) {

        console.error(
            "Save error:",
            error
        );
    }
}


function loadAllGameData() {

    try {

        const roster =
            loadFromStorage(
                GAME_CONFIG.STORAGE_KEYS.BUILD_ROSTER
            );

        const squad =
            loadFromStorage(
                GAME_CONFIG.STORAGE_KEYS.SUPER_SQUAD
            );

        if (roster && typeof roster === "object") {
            GAME_STATE.buildRoster =
                sanitizeRosterState(roster);
        }

        if (squad && typeof squad === "object") {
            GAME_STATE.superSquad =
                sanitizeSquadState(squad);
        }

    } catch (error) {

        console.error(
            "Load error:",
            error
        );
    }
}


function sanitizeRosterState(data) {

    const state = {
        league:
            typeof data.league === "string"
                ? data.league
                : "",

        club:
            typeof data.club === "string"
                ? data.club
                : "",

        players:
            Array.isArray(data.players)
                ? data.players.filter(isValidPlayer)
                : [],

        season:
            Math.max(
                1,
                safeInteger(data.season, 1)
            ),

        matchNumber:
            Math.max(
                1,
                safeInteger(data.matchNumber, 1)
            ),

        points:
            Math.max(
                0,
                safeInteger(data.points, 0)
            ),

        wins:
            Math.max(
                0,
                safeInteger(data.wins, 0)
            ),

        draws:
            Math.max(
                0,
                safeInteger(data.draws, 0)
            ),

        losses:
            Math.max(
                0,
                safeInteger(data.losses, 0)
            ),

        history:
            Array.isArray(data.history)
                ? data.history.slice(0, GAME_CONFIG.SEASON.MATCHES)
                : []
    };

    return state;
}


function sanitizeSquadState(data) {

    const collection =
        Array.isArray(data.collection)
            ? data.collection.filter(isValidPlayer)
            : [];

    const collectionIds =
        new Set(
            collection.map(function (player) {
                return player.id;
            })
        );

    const lineup =
        Array.isArray(data.lineup)
            ? data.lineup
                .filter(function (id) {
                    return collectionIds.has(id);
                })
                .slice(
                    0,
                    GAME_CONFIG.SUPER_SQUAD.REQUIRED_PLAYERS
                )
            : [];

    return {

        teamName:
            typeof data.teamName === "string"
                ? data.teamName
                : "",

        collection:
            uniqueById(collection),

        lineup:
            [...new Set(lineup)],

        points:
            Math.max(
                0,
                safeInteger(data.points, 0)
            ),

        coins:
            Math.max(
                0,
                safeInteger(data.coins, 500)
            ),

        difficulty:
            data.difficulty === "hard"
                ? "hard"
                : "easy",

        season:
            Math.max(
                1,
                safeInteger(data.season, 1)
            ),

        matchNumber:
            Math.max(
                1,
                safeInteger(data.matchNumber, 1)
            ),

        wins:
            Math.max(
                0,
                safeInteger(data.wins, 0)
            ),

        draws:
            Math.max(
                0,
                safeInteger(data.draws, 0)
            ),

        losses:
            Math.max(
                0,
                safeInteger(data.losses, 0)
            ),

        history:
            Array.isArray(data.history)
                ? data.history.slice(0, GAME_CONFIG.SEASON.MATCHES)
                : []
    };
}


/* =========================================================
   INITIALISE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        try {

            loadAllGameData();
            setupEventListeners();
            updateAllUI();
            showScreen("mainMenu");

            console.log(
                "Super League Soccer loaded successfully."
            );

        } catch (error) {

            console.error(
                "Game startup error:",
                error
            );

            if (
                typeof showNotification ===
                "function"
            ) {
                showNotification(
                    "There was a problem loading the game.",
                    "error"
                );
            }
        }
    }
);


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function setupEventListeners() {

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


    /* Build Roster */

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


    /* Super Squad */

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


    /* Collection */

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


    /* Match */

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


    /* Presentation */

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


    /* Settings */

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


    /* Modal */

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
   BUILD A ROSTER
   ========================================================= */

function selectBuildLeague(league) {

    GAME_STATE.buildRoster.league =
        league;

    GAME_STATE.buildRoster.club =
        "";

    GAME_STATE.buildRoster.players =
        [];

    const select =
        getElement("clubSelect");

    if (!select) {
        return;
    }

    select.innerHTML =
        '<option value="">Select a club</option>';

    const clubs =
        league ===
        GAME_CONFIG.LEAGUES.PREMIER_LEAGUE
            ? GAME_CONFIG.PREMIER_LEAGUE_CLUBS
            : GAME_CONFIG.LALIGA_CLUBS;

    clubs.forEach(function (club) {

        const option =
            document.createElement("option");

        option.value = club;
        option.textContent = club;

        select.appendChild(option);
    });

    showElement("buildClubPanel");

    renderRosterPlayers();
    updateRosterUI();

    saveAllGameData();
}


function loadBuildClub() {

    const select =
        getElement("clubSelect");

    if (!select) {
        return;
    }

    const club =
        cleanText(select.value);

    if (!club) {

        showNotification(
            "Please choose a club first.",
            "error"
        );

        return;
    }

    GAME_STATE.buildRoster.club =
        club;

    GAME_STATE.buildRoster.players =
        [];

    renderRosterPlayers();
    updateRosterUI();
}


function renderRosterPlayers() {

    const container =
        getElement("rosterPlayers");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const state =
        GAME_STATE.buildRoster;

    if (!state.club) {

        container.innerHTML =
            "<p>Choose a club to see its players.</p>";

        return;
    }

    let players =
        getPlayersByClub(state.club);

    if (!Array.isArray(players)) {
        players = [];
    }

    if (players.length === 0) {

        container.innerHTML =
            "<p>No players found for this club.</p>";

        return;
    }

    players.forEach(function (player) {

        const selected =
            state.players.some(
                function (item) {
                    return item.id === player.id;
                }
            );

        const card =
            document.createElement("button");

        card.type = "button";

        card.className =
            "player-card" +
            (selected ? " selected" : "");

        card.innerHTML = `
            <strong>${escapeHTML(player.name)}</strong>
            <span>${escapeHTML(player.position)}</span>
            <span>Rating: ${player.rating}</span>
            <span>${escapeHTML(player.club)}</span>
        `;

        card.addEventListener(
            "click",
            function () {

                toggleRosterPlayer(
                    player.id
                );
            }
        );

        container.appendChild(card);
    });
}


function toggleRosterPlayer(playerId) {

    const state =
        GAME_STATE.buildRoster;

    const index =
        state.players.findIndex(
            function (player) {
                return player.id === playerId;
            }
        );

    if (index >= 0) {

        state.players.splice(
            index,
            1
        );

    } else {

        if (
            state.players.length >=
            GAME_CONFIG.BUILD_ROSTER.REQUIRED_PLAYERS
        ) {

            showNotification(
                "You can only select 6 players.",
                "error"
            );

            return;
        }

        const player =
            findPlayerById(playerId);

        if (!player) {
            return;
        }

        state.players.push(
            sanitizePlayer(player)
        );
    }

    renderRosterPlayers();
    updateRosterUI();
    saveAllGameData();
}


function updateRosterCount() {

    setText(
        "rosterCount",
        GAME_STATE.buildRoster.players.length +
        " / " +
        GAME_CONFIG.BUILD_ROSTER.REQUIRED_PLAYERS
    );
}


function updateRosterUI() {

    const state =
        GAME_STATE.buildRoster;

    setText(
        "rosterMatchNumber",
        state.matchNumber
    );

    setText(
        "rosterSeasonPoints",
        state.points
    );

    setText(
        "rosterWins",
        state.wins
    );

    setText(
        "rosterDraws",
        state.draws
    );

    setText(
        "rosterLosses",
        state.losses
    );

    setText(
        "rosterNextMatch",
        state.matchNumber <=
        GAME_CONFIG.SEASON.MATCHES
            ? "Ready"
            : "Season Complete"
    );

    updateRosterCount();

    const startButton =
        getElement(
            "startRosterSeasonButton"
        );

    if (startButton) {

        startButton.disabled =
            !state.club ||
            state.players.length !==
            GAME_CONFIG.BUILD_ROSTER.REQUIRED_PLAYERS;
    }

    const playButton =
        getElement(
            "playRosterMatchButton"
        );

    if (playButton) {

        playButton.disabled =
            state.players.length !==
            GAME_CONFIG.BUILD_ROSTER.REQUIRED_PLAYERS ||
            state.matchNumber >
            GAME_CONFIG.SEASON.MATCHES;
    }

    renderRosterHistory();
    renderLeagueTable();
}


function startRosterSeason() {

    const state =
        GAME_STATE.buildRoster;

    if (
        state.players.length !==
        GAME_CONFIG.BUILD_ROSTER.REQUIRED_PLAYERS
    ) {

        showNotification(
            "You need exactly 6 players.",
            "error"
        );

        return;
    }

    if (!state.club) {

        showNotification(
            "Choose a club first.",
            "error"
        );

        return;
    }

    if (
        state.matchNumber >
        GAME_CONFIG.SEASON.MATCHES
    ) {

        showNotification(
            "This season is already complete.",
            "error"
        );

        return;
    }

    showScreen("rosterSeason");

    updateRosterUI();
}


function playBuildRosterMatch() {

    const state =
        GAME_STATE.buildRoster;

    if (
        state.players.length !==
        GAME_CONFIG.BUILD_ROSTER.REQUIRED_PLAYERS
    ) {

        showNotification(
            "Select exactly 6 players first.",
            "error"
        );

        return;
    }

    if (
        state.matchNumber >
        GAME_CONFIG.SEASON.MATCHES
    ) {

        finishSeason("buildRoster");
        return;
    }

    const opponent =
        getRandomOpponentClub(
            state.club
        );

    const playerRating =
        calculateSquadRating(
            state.players
        );

    const opponentRating =
        getClubRating(opponent);

    GAME_STATE.currentMatch = {
        mode: "buildRoster",
        returnScreen: "rosterSeason",
        matchNumber: state.matchNumber,
        homeTeam: state.club,
        awayTeam: opponent,
        homeRating: playerRating,
        awayRating: opponentRating
    };

    setupMatchScreen();

    showScreen("match");
}


function simulateBuildRosterSeason() {

    const state =
        GAME_STATE.buildRoster;

    if (
        state.players.length !==
        GAME_CONFIG.BUILD_ROSTER.REQUIRED_PLAYERS
    ) {

        showNotification(
            "Select exactly 6 players first.",
            "error"
        );

        return;
    }

    while (
        state.matchNumber <=
        GAME_CONFIG.SEASON.MATCHES
    ) {

        playBuildRosterMatchImmediately();
    }

    finishSeason("buildRoster");
}


function playBuildRosterMatchImmediately() {

    const state =
        GAME_STATE.buildRoster;

    const opponent =
        getRandomOpponentClub(
            state.club
        );

    const homeRating =
        calculateSquadRating(
            state.players
        );

    const awayRating =
        getClubRating(opponent);

    const score =
        simulateScore(
            homeRating,
            awayRating
        );

    completeBuildRosterMatch(
        opponent,
        homeRating,
        awayRating,
        score.home,
        score.away
    );
}


function completeBuildRosterMatch(
    opponent,
    homeRating,
    awayRating,
    homeScore,
    awayScore
) {

    const state =
        GAME_STATE.buildRoster;

    const result =
        getMatchResult(
            homeScore,
            awayScore
        );

    const points =
        getResultPoints(
            result,
            "buildRoster"
        );

    if (result === "win") {
        state.wins++;
    }

    if (result === "draw") {
        state.draws++;
    }

    if (result === "loss") {
        state.losses++;
    }

    state.points += points;

    state.history.push({
        matchNumber:
            state.matchNumber,

        opponent:
            opponent,

        homeScore:
            homeScore,

        awayScore:
            awayScore,

        result:
            result,

        points:
            points,

        homeRating:
            homeRating,

        awayRating:
            awayRating,

        date:
            getTimestamp()
    });

    state.matchNumber++;

    saveAllGameData();
}


/* =========================================================
   SUPER SQUAD
   ========================================================= */

function createSuperSquad() {

    const input =
        getElement("teamName");

    if (!input) {
        return;
    }

    const name =
        cleanText(input.value);

    const validation =
        validateTeamName(name);

    if (
        !validation ||
        validation.valid === false
    ) {

        showNotification(
            validation?.message ||
            "Please choose a valid team name.",
            "error"
        );

        return;
    }

    GAME_STATE.superSquad.teamName =
        name;

    showNotification(
        name + " created!",
        "success"
    );

    saveAllGameData();

    updateSuperSquadUI();
}


function setSuperSquadDifficulty(
    difficulty
) {

    if (
        difficulty !== "easy" &&
        difficulty !== "hard"
    ) {
        return;
    }

    GAME_STATE.superSquad.difficulty =
        difficulty;

    saveAllGameData();
    updateSuperSquadUI();

    showNotification(
        difficulty === "easy"
            ? "Easy difficulty selected."
            : "Hard difficulty selected.",
        "success"
    );
}


function getLineupPlayers() {

    const state =
        GAME_STATE.superSquad;

    return state.lineup
        .map(function (id) {
            return findPlayerById(id);
        })
        .filter(Boolean);
}


function renderSuperSquadCollection() {

    const container =
        getElement("collectionPlayers");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const state =
        GAME_STATE.superSquad;

    let players =
        state.collection.slice();

    if (
        GAME_STATE.collectionFilter !==
        "all"
    ) {

        players =
            players.filter(
                function (player) {
                    return (
                        String(player.rarity || "")
                            .toLowerCase() ===
                        GAME_STATE.collectionFilter
                            .toLowerCase()
                    );
                }
            );
    }

    if (players.length === 0) {

        container.innerHTML =
            "<p>No players in this collection filter.</p>";

        return;
    }

    players.forEach(function (player) {

        const selected =
            state.lineup.includes(
                player.id
            );

        const card =
            document.createElement("button");

        card.type = "button";

        card.className =
            "player-card" +
            (selected ? " selected" : "");

        card.innerHTML = `
            <strong>${escapeHTML(player.name)}</strong>
            <span>${escapeHTML(player.position)}</span>
            <span>Rating: ${player.rating}</span>
            <span>${escapeHTML(player.club)}</span>
            <span>${escapeHTML(player.rarity || "Common")}</span>
        `;

        card.addEventListener(
            "click",
            function () {

                toggleLineupPlayer(
                    player.id
                );
            }
        );

        container.appendChild(card);
    });
}


function toggleLineupPlayer(playerId) {

    const state =
        GAME_STATE.superSquad;

    const index =
        state.lineup.indexOf(playerId);

    if (index >= 0) {

        state.lineup.splice(
            index,
            1
        );

    } else {

        if (
            state.lineup.length >=
            GAME_CONFIG.SUPER_SQUAD.REQUIRED_PLAYERS
        ) {

            showNotification(
                "Your Starting XI already has 11 players.",
                "error"
            );

            return;
        }

        const player =
            findPlayerById(playerId);

        if (!player) {
            return;
        }

        if (
            !state.collection.some(
                function (item) {
                    return item.id === player.id;
                }
            )
        ) {
            return;
        }

        state.lineup.push(
            player.id
        );
    }

    saveAllGameData();
    updateSuperSquadUI();
}


function updateSuperSquadUI() {

    const state =
        GAME_STATE.superSquad;

    setText(
        "superSquadTeamName",
        state.teamName || "No Team"
    );

    setText(
        "superSquadRating",
        calculateSquadRating(
            getLineupPlayers()
        )
    );

    setText(
        "superSquadPoints",
        state.points
    );

    setText(
        "superSquadMatchNumber",
        state.matchNumber
    );

    setText(
        "startingXIcount",
        state.lineup.length +
        " / " +
        GAME_CONFIG.SUPER_SQUAD.REQUIRED_PLAYERS
    );

    setText(
        "collectionCount",
        state.collection.length
    );

    const lineup =
        getElement("startingXI");

    if (lineup) {

        lineup.innerHTML = "";

        const players =
            getLineupPlayers();

        if (players.length === 0) {

            lineup.innerHTML =
                "<p>Your Starting XI is empty.</p>";

        } else {

            players.forEach(function (player) {

                const item =
                    document.createElement("div");

                item.className =
                    "starting-xi-player";

                item.innerHTML = `
                    <strong>${escapeHTML(player.name)}</strong>
                    <span>${escapeHTML(player.position)}</span>
                    <span>${player.rating}</span>
                `;

                lineup.appendChild(item);
            });
        }
    }

    const playButton =
        getElement(
            "playSuperSquadMatchButton"
        );

    if (playButton) {

        playButton.disabled =
            !state.teamName ||
            state.lineup.length !==
            GAME_CONFIG.SUPER_SQUAD.REQUIRED_PLAYERS ||
            state.matchNumber >
            GAME_CONFIG.SEASON.MATCHES;
    }

    const easy =
        getElement("easyDifficultyButton");

    const hard =
        getElement("hardDifficultyButton");

    if (easy) {
        easy.classList.toggle(
            "active",
            state.difficulty === "easy"
        );
    }

    if (hard) {
        hard.classList.toggle(
            "active",
            state.difficulty === "hard"
        );
    }

    renderSuperSquadHistory();
}


function playSuperSquadMatch() {

    const state =
        GAME_STATE.superSquad;

    if (!state.teamName) {

        showNotification(
            "Create your team first.",
            "error"
        );

        return;
    }

    if (
        state.lineup.length !==
        GAME_CONFIG.SUPER_SQUAD.REQUIRED_PLAYERS
    ) {

        showNotification(
            "You need exactly 11 players.",
            "error"
        );

        return;
    }

    if (
        state.matchNumber >
        GAME_CONFIG.SEASON.MATCHES
    ) {

        finishSeason("superSquad");
        return;
    }

    const opponent =
        getRandomOpponentClub();

    const homeRating =
        calculateSquadRating(
            getLineupPlayers()
        );

    const difficulty =
        state.difficulty === "hard"
            ? GAME_CONFIG.SUPER_SQUAD.DIFFICULTY.HARD
            : GAME_CONFIG.SUPER_SQUAD.DIFFICULTY.EASY;

    const awayRating =
        randomInt(
            difficulty.MIN_OPPONENT_RATING,
            difficulty.MAX_OPPONENT_RATING
        );

    GAME_STATE.currentMatch = {
        mode: "superSquad",
        returnScreen: "superSquad",
        matchNumber: state.matchNumber,
        homeTeam: state.teamName,
        awayTeam: opponent,
        homeRating: homeRating,
        awayRating: awayRating
    };

    setupMatchScreen();

    showScreen("match");
}


/* =========================================================
   PACKS
   ========================================================= */

function openPack(packType) {

    const state =
        GAME_STATE.superSquad;

    let cost = 0;

    if (packType === "bronze") {
        cost = GAME_CONFIG.PACKS.BRONZE.COST;
    }

    if (packType === "gold") {
        cost = GAME_CONFIG.PACKS.GOLD.COST;
    }

    if (packType === "icon") {
        cost = GAME_CONFIG.PACKS.ICON.COST;
    }

    if (!cost) {
        return;
    }

    if (state.points < cost) {

        showNotification(
            "You do not have enough points.",
            "error"
        );

        return;
    }

    state.points -= cost;

    let cards = [];

    try {

        if (
            typeof generatePack ===
            "function"
        ) {
            cards =
                generatePack(packType);
        }

    } catch (error) {

        console.error(
            "Pack generation error:",
            error
        );

        cards = [];
    }

    if (!Array.isArray(cards)) {
        cards = [];
    }

    cards =
        cards.filter(isValidPlayer);

    if (cards.length === 0) {

        state.points += cost;

        showNotification(
            "The pack could not be opened. Your points were returned.",
            "error"
        );

        return;
    }

    state.collection =
        uniqueById(
            state.collection.concat(cards)
        );

    saveAllGameData();
    updateAllUI();

    const names =
        cards.map(function (player) {
            return player.name;
        }).join(", ");

    showModal(
        "Pack Opened!",
        "<p>You received:</p><p>" +
        escapeHTML(names) +
        "</p>"
    );
}


/* =========================================================
   COLLECTION
   ========================================================= */

function setCollectionFilter(
    filter
) {

    GAME_STATE.collectionFilter =
        filter;

    renderCollection();
}


function renderCollection() {

    const state =
        GAME_STATE.superSquad;

    const players =
        state.collection;

    const common =
        players.filter(
            function (player) {
                return String(player.rarity)
                    .toLowerCase() ===
                    "common";
            }
        ).length;

    const rare =
        players.filter(
            function (player) {
                return String(player.rarity)
                    .toLowerCase() ===
                    "rare";
            }
        ).length;

    const icons =
        players.filter(
            function (player) {
                return String(player.rarity)
                    .toLowerCase() ===
                    "icon";
            }
        ).length;

    setText(
        "totalCards",
        players.length
    );

    setText(
        "commonCards",
        common
    );

    setText(
        "rareCards",
        rare
    );

    setText(
        "iconCards",
        icons
    );

    renderSuperSquadCollection();
}


/* =========================================================
   MATCH SCREEN
   ========================================================= */

function setupMatchScreen() {

    const match =
        GAME_STATE.currentMatch;

    if (!match) {
        return;
    }

    setText(
        "matchCompetition",
        match.mode === "superSquad"
            ? "Super League Soccer"
            : match.homeTeam + " Season"
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
        match.homeRating
    );

    setText(
        "awayRating",
        match.awayRating
    );

    setText(
        "homeScore",
        0
    );

    setText(
        "awayScore",
        0
    );

    setText(
        "matchMinute",
        "0'"
    );

    setText(
        "matchVenue",
        "Super League Stadium"
    );

    setText(
        "matchResult",
        ""
    );

    const events =
        getElement("matchEvents");

    if (events) {
        events.innerHTML =
            "<p>Match ready.</p>";
    }
}


function simulateCurrentMatch() {

    const match =
        GAME_STATE.currentMatch;

    if (!match) {
        return;
    }

    const score =
        simulateScore(
            match.homeRating,
            match.awayRating
        );

    setText(
        "homeScore",
        score.home
    );

    setText(
        "awayScore",
        score.away
    );

    setText(
        "matchMinute",
        "90'"
    );

    const result =
        getMatchResult(
            score.home,
            score.away
        );

    let points = 0;

    if (match.mode === "superSquad") {

        points =
            getResultPoints(
                result,
                GAME_STATE.superSquad.difficulty
            );

        completeSuperSquadMatch(
            match.awayTeam,
            match.homeRating,
            match.awayRating,
            score.home,
            score.away
        );

    } else {

        points =
            getResultPoints(
                result,
                "buildRoster"
            );

        completeBuildRosterMatch(
            match.awayTeam,
            match.homeRating,
            match.awayRating,
            score.home,
            score.away
        );
    }

    setText(
        "matchResult",
        getResultText(
            result,
            points
        )
    );

    renderMatchEvents(
        score.home,
        score.away,
        result
    );

    const button =
        getElement("simulateMatchButton");

    if (button) {
        button.disabled = true;
    }

    saveAllGameData();
}


function renderMatchEvents(
    homeScore,
    awayScore,
    result
) {

    const container =
        getElement("matchEvents");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const events = [];

    for (
        let i = 0;
        i < homeScore;
        i++
    ) {

        events.push(
            "⚽ Goal for the home team"
        );
    }

    for (
        let i = 0;
        i < awayScore;
        i++
    ) {

        events.push(
            "⚽ Goal for " +
            (
                GAME_STATE.currentMatch?.awayTeam ||
                "the away team"
            )
        );
    }

    if (events.length === 0) {

        events.push(
            "🧤 No goals were scored."
        );
    }

    events.push(
        "🏁 Full time — " +
        getResultLabel(result)
    );

    events.forEach(function (eventText) {

        const item =
            document.createElement("div");

        item.className =
            "match-event";

        item.textContent =
            eventText;

        container.appendChild(item);
    });
}


function completeSuperSquadMatch(
    opponent,
    homeRating,
    awayRating,
    homeScore,
    awayScore
) {

    const state =
        GAME_STATE.superSquad;

    const result =
        getMatchResult(
            homeScore,
            awayScore
        );

    const points =
        getResultPoints(
            result,
            state.difficulty
        );

    if (result === "win") {
        state.wins++;
    }

    if (result === "draw") {
        state.draws++;
    }

    if (result === "loss") {
        state.losses++;
    }

    state.points += points;

    state.history.push({
        matchNumber:
            state.matchNumber,

        opponent:
            opponent,

        homeScore:
            homeScore,

        awayScore:
            awayScore,

        result:
            result,

        points:
            points,

        homeRating:
            homeRating,

        awayRating:
            awayRating,

        date:
            getTimestamp()
    });

    state.matchNumber++;

    saveAllGameData();
}


/* =========================================================
   MATCH CALCULATIONS
   ========================================================= */

function getMatchResult(
    homeScore,
    awayScore
) {

    if (homeScore > awayScore) {
        return "win";
    }

    if (homeScore < awayScore) {
        return "loss";
    }

    return "draw";
}


function getResultText(
    result,
    points
) {

    if (result === "win") {
        return "WIN! +" + points + " points";
    }

    if (result === "draw") {
        return "DRAW! +" + points + " points";
    }

    return "LOSS! +0 points";
}


/* =========================================================
   HISTORY
   ========================================================= */

function renderRosterHistory() {

    const container =
        getElement("rosterMatchHistory");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const history =
        GAME_STATE.buildRoster.history;

    if (history.length === 0) {

        container.innerHTML =
            "<p>No matches played yet.</p>";

        return;
    }

    history.forEach(function (match) {

        const item =
            document.createElement("div");

        item.className =
            "history-item";

        item.innerHTML = `
            <strong>Match ${match.matchNumber}</strong>
            <span>${escapeHTML(match.opponent)}</span>
            <span>${match.homeScore} - ${match.awayScore}</span>
            <span>${escapeHTML(getResultLabel(match.result))}</span>
            <span>+${match.points}</span>
        `;

        container.appendChild(item);
    });
}


function renderSuperSquadHistory() {

    const container =
        getElement("superSquadMatchHistory");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const history =
        GAME_STATE.superSquad.history;

    if (history.length === 0) {

        container.innerHTML =
            "<p>No matches played yet.</p>";

        return;
    }

    history.forEach(function (match) {

        const item =
            document.createElement("div");

        item.className =
            "history-item";

        item.innerHTML = `
            <strong>Match ${match.matchNumber}</strong>
            <span>${escapeHTML(match.opponent)}</span>
            <span>${match.homeScore} - ${match.awayScore}</span>
            <span>${escapeHTML(getResultLabel(match.result))}</span>
            <span>+${match.points}</span>
        `;

        container.appendChild(item);
    });
}


/* =========================================================
   BUILD ROSTER TABLE
   ========================================================= */

function renderLeagueTable() {

    const container =
        getElement("rosterLeagueTable");

    if (!container) {
        return;
    }

    const state =
        GAME_STATE.buildRoster;

    const rows = [
        {
            team:
                state.club || "Your Team",

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
        }
    ];

    state.history.forEach(function (match) {

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
                match.result === "win"
                    ? 100
                    : match.result === "draw"
                        ? 50
                        : 0
        });
    });

    rows.sort(function (a, b) {
        return b.points - a.points;
    });

    container.innerHTML = `
        <div class="league-table-row league-table-header">
            <span>#</span>
            <span>Team</span>
            <span>P</span>
            <span>W</span>
            <span>D</span>
            <span>L</span>
            <span>Pts</span>
        </div>
    `;

    rows.forEach(function (row, index) {

        const element =
            document.createElement("div");

        element.className =
            "league-table-row";

        element.innerHTML = `
            <span>${index + 1}</span>
            <span>${escapeHTML(row.team)}</span>
            <span>${row.played}</span>
            <span>${row.wins}</span>
            <span>${row.draws}</span>
            <span>${row.losses}</span>
            <span>${row.points}</span>
        `;

        container.appendChild(element);
    });
}


/* =========================================================
   SEASON PRESENTATION
   ========================================================= */

function finishSeason(mode) {

    const state =
        mode === "superSquad"
            ? GAME_STATE.superSquad
            : GAME_STATE.buildRoster;

    setText(
        "presentationTeamName",
        mode === "superSquad"
            ? state.teamName
            : state.club
    );

    setText(
        "presentationWins",
        state.wins
    );

    setText(
        "presentationDraws",
        state.draws
    );

    setText(
        "presentationLosses",
        state.losses
    );

    setText(
        "presentationPoints",
        state.points
    );

    const results =
        getElement("presentationResults");

    if (results) {

        results.innerHTML = "";

        state.history.forEach(function (match) {

            const item =
                document.createElement("div");

            item.className =
                "history-item";

            item.innerHTML = `
                <strong>Match ${match.matchNumber}</strong>
                <span>${escapeHTML(match.opponent)}</span>
                <span>${match.homeScore} - ${match.awayScore}</span>
                <span>${escapeHTML(getResultLabel(match.result))}</span>
                <span>+${match.points}</span>
            `;

            results.appendChild(item);
        });
    }

    saveAllGameData();

    showScreen("presentation");
}


function startNewSeason() {

    if (
        GAME_STATE.currentScreen !==
        "presentation"
    ) {
        return;
    }

    const build =
        GAME_STATE.buildRoster;

    const squad =
        GAME_STATE.superSquad;

    /*
     * Continue whichever mode has just
     * completed its 19 matches.
     */

    if (
        squad.history.length >=
        GAME_CONFIG.SEASON.MATCHES &&
        squad.matchNumber >
        GAME_CONFIG.SEASON.MATCHES
    ) {

        squad.season++;
        squad.matchNumber = 1;
        squad.wins = 0;
        squad.draws = 0;
        squad.losses = 0;
        squad.history = [];

        saveAllGameData();
        showScreen("superSquad");

        return;
    }

    if (
        build.history.length >=
        GAME_CONFIG.SEASON.MATCHES &&
        build.matchNumber >
        GAME_CONFIG.SEASON.MATCHES
    ) {

        build.season++;
        build.matchNumber = 1;
        build.wins = 0;
        build.draws = 0;
        build.losses = 0;
        build.history = [];

        saveAllGameData();
        showScreen("rosterSeason");

        return;
    }

    showScreen("mainMenu");
}


/* =========================================================
   GLOBAL UI
   ========================================================= */

function updateAllUI() {

    setText(
        "pointsDisplay",
        GAME_STATE.superSquad.points
    );

    setText(
        "points",
        GAME_STATE.superSquad.points
    );

    setText(
        "coinsDisplay",
        GAME_STATE.superSquad.coins
    );

    setText(
        "coins",
        GAME_STATE.superSquad.coins
    );

    updateRosterUI();
    updateSuperSquadUI();
    renderCollection();
}


/* =========================================================
   RESET
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
            GAME_CONFIG.STORAGE_KEYS.BUILD_ROSTER
        );

        removeFromStorage(
            GAME_CONFIG.STORAGE_KEYS.SUPER_SQUAD
        );

    } catch (error) {

        console.error(
            "Reset storage error:",
            error
        );
    }

    GAME_STATE.buildRoster = {
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

    GAME_STATE.superSquad = {
        teamName: "",
        collection: [],
        lineup: [],
        points: 0,
        coins: 500,
        difficulty: "easy",
        season: 1,
        matchNumber: 1,
        wins: 0,
        draws: 0,
        losses: 0,
        history: []
    };

    GAME_STATE.currentMatch = null;

    GAME_STATE.collectionFilter =
        "all";

    updateAllUI();

    showScreen("mainMenu");

    showNotification(
        "Game reset successfully.",
        "success"
    );
}


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }

        const modal =
            getElement("gameModal");

        if (
            modal &&
            !modal.hidden
        ) {
            closeModal();
        }
    }
);


/* =========================================================
   AUTO SAVE
   ========================================================= */

window.addEventListener(
    "beforeunload",
    function () {

        try {
            saveAllGameData();
        } catch (error) {
            console.error(
                "Auto-save failed:",
                error
            );
        }
    }
);


setInterval(
    function () {

        try {
            saveAllGameData();
        } catch (error) {
            console.error(
                "Automatic save failed:",
                error
            );
        }

    },
    30000
);
```
