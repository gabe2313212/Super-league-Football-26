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

    currentMatch: null
};


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    try {
        loadAllGameData();
        setupEventListeners();
        updateAllUI();
        showScreen("mainMenu");

        console.log("Super League Soccer loaded successfully.");

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
});


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function setupEventListeners() {

    // Main menu
    bindClick("buildRosterButton", function () {
        showScreen("buildRoster");
    });

    bindClick("superSquadButton", function () {
        showScreen("superSquad");
    });

    bindClick("collectionButton", function () {
        renderCollection();
        showScreen("collection");
    });

    bindClick("settingsButton", function () {
        showScreen("settings");
    });


    // Build a Roster
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

    bindClick("loadClubButton", loadBuildClub);

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


    // Super Squad
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


    // Collection
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


    // Match
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


    // Presentation
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


    // Settings
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


    // Modal
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

                if (event.target === modal) {
                    closeModal();
                }

            }
        );
    }
}


/* =========================================================
   SAFE EVENT BINDING
   ========================================================= */

function bindClick(id, callback) {

    const element = getElement(id);

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
        document.querySelectorAll(".screen");

    screens.forEach(function (screen) {
        screen.hidden = true;
    });


    const target =
        getElement(screenName + "Screen");

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
   SAVE ALL DATA
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
   BUILD ROSTER STATE SANITISATION
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


    if (Array.isArray(state.players)) {

        safe.players =
            state.players
                .map(sanitizePlayer)
                .filter(Boolean)
                .slice(
                    0,
                    GAME_CONFIG.BUILD_ROSTER.REQUIRED_PLAYERS
                );
    }


    safe.season =
        clamp(
            safeInteger(state.season, 1),
            1,
            999999
        );

    safe.matchNumber =
        clamp(
            safeInteger(state.matchNumber, 1),
            1,
            GAME_CONFIG.SEASON.MATCHES + 1
        );

    safe.points =
        Math.max(
            0,
            safeInteger(state.points, 0)
        );

    safe.wins =
        Math.max(
            0,
            safeInteger(state.wins, 0)
        );

    safe.draws =
        Math.max(
            0,
            safeInteger(state.draws, 0)
        );

    safe.losses =
        Math.max(
            0,
            safeInteger(state.losses, 0)
        );


    if (Array.isArray(state.history)) {

        safe.history =
            state.history
                .filter(function (match) {
                    return match &&
                        typeof match === "object";
                })
                .slice(
                    0,
                    GAME_CONFIG.SEASON.MATCHES
                );
    }


    return safe;
}


/* =========================================================
   SUPER SQUAD STATE SANITISATION
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

    if (teamValidation.valid) {
        safe.teamName =
            teamValidation.name;
    }


    if (Array.isArray(state.collection)) {

        safe.collection =
            uniqueById(
                state.collection
                    .map(sanitizePlayer)
                    .filter(Boolean)
            );
    }


    if (Array.isArray(state.lineup)) {

        safe.lineup =
            state.lineup
                .map(function (id) {
                    return cleanText(id, 100);
                })
                .filter(Boolean)
                .filter(function (id) {

                    return Boolean(
                        findPlayerById(
                            safe.collection,
                            id
                        )
                    );

                })
                .slice(
                    0,
                    GAME_CONFIG.SUPER_SQUAD.REQUIRED_PLAYERS
                );
    }


    safe.points =
        Math.max(
            0,
            safeInteger(state.points, 0)
        );

    safe.coins =
        Math.max(
            0,
            safeInteger(state.coins, 0)
        );


    safe.difficulty =
        state.difficulty === "hard"
            ? "hard"
            : "easy";


    safe.season =
        clamp(
            safeInteger(state.season, 1),
            1,
            999999
        );


    safe.matchNumber =
        clamp(
            safeInteger(state.matchNumber, 1),
            1,
            GAME_CONFIG.SEASON.MATCHES + 1
        );


    safe.wins =
        Math.max(
            0,
            safeInteger(state.wins, 0)
        );

    safe.draws =
        Math.max(
            0,
            safeInteger(state.draws, 0)
        );

    safe.losses =
        Math.max(
            0,
            safeInteger(state.losses, 0)
        );


    if (Array.isArray(state.history)) {

        safe.history =
            state.history
                .filter(function (match) {
                    return match &&
                        typeof match === "object";
                })
                .slice(
                    0,
                    GAME_CONFIG.SEASON.MATCHES
                );
    }


    return safe;
}


/* =========================================================
   BUILD ROSTER — LEAGUE
   ========================================================= */

function selectBuildLeague(league) {

    if (
        league !== GAME_CONFIG.LEAGUES.PREMIER_LEAGUE &&
        league !== GAME_CONFIG.LEAGUES.LALIGA
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


    clubSelect.innerHTML =
        '<option value="">Select a club</option>';


    clubs.forEach(function (club) {

        const option =
            document.createElement("option");

        option.value = club;
        option.textContent = club;

        clubSelect.appendChild(option);
    });


    showElement("buildClubPanel");
    hideElement("rosterPlayerPanel");

    renderRosterPlayers();
}


/* =========================================================
   BUILD ROSTER — CLUB
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
        "Loading " + club + " players...",
        "info"
    );


    try {

        let players =
            await getPlayersByClub(club);


        /*
         * If the fallback database doesn't have enough
         * players, create safe generated players so the
         * selection screen can still function.
         */

        if (players.length < 6) {

            players =
                createFallbackClubPlayers(
                    club,
                    players
                );
        }


        renderRosterPlayers(players);

        showElement("rosterPlayerPanel");


        showNotification(
            club + " loaded.",
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


        renderRosterPlayers(players);
        showElement("rosterPlayerPanel");


        showNotification(
            "Using backup player data.",
            "info"
        );
    }
}


/* =========================================================
   CREATE FALLBACK CLUB PLAYERS
   ========================================================= */

function createFallbackClubPlayers(
    club,
    existingPlayers
) {

    const players =
        Array.isArray(existingPlayers)
            ? existingPlayers.map(sanitizePlayer)
                .filter(Boolean)
            : [];


    const positions = [
        "GK",
        "RB",
        "CB",
        "CB",
        "LB",
        "CM",
        "CM",
        "CAM",
        "RW",
        "LW",
        "ST",
        "ST"
    ];


    const result = [
        ...players
    ];


    let index = 0;


    while (result.length < 12) {

        const position =
            positions[index % positions.length];

        const player = {
            id:
                "generated_" +
                club.toLowerCase()
                    .replace(/[^a-z0-9]+/g, "_") +
                "_" +
                index,

            name:
                club +
                " Player " +
                (index + 1),

            position,

            rating:
                randomInt(70, 84),

            club,

            rarity:
                randomInt(1, 100) <= 25
                    ? "Rare"
                    : "Common"
        };


        result.push(
            sanitizePlayer(player)
        );

        index++;
    }


    return uniqueById(result);
}


/* =========================================================
   RENDER BUILD ROSTER PLAYERS
   ========================================================= */

function renderRosterPlayers(players) {

    const container =
        getElement("rosterPlayers");

    if (!container) {
        return;
    }


    /*
     * If players aren't provided, try loading them
     * from the selected club.
     */

    if (!Array.isArray(players)) {

        const club =
            GAME_STATE.buildRoster.club;

        if (!club) {
            container.innerHTML = "";
            updateRosterCount();
            return;
        }

        getPlayersByClub(club)
            .then(function (loadedPlayers) {

                if (
                    loadedPlayers.length < 6
                ) {

                    loadedPlayers =
                        createFallbackClubPlayers(
                            club,
                            loadedPlayers
                        );
                }

                renderRosterPlayers(
                    loadedPlayers
                );

            })
            .catch(function () {

                renderRosterPlayers(
                    createFallbackClubPlayers(
                        club,
                        []
                    )
                );

            });

        return;
    }


    container.innerHTML = "";


    const safePlayers =
        uniqueById(
            players
                .map(sanitizePlayer)
                .filter(Boolean)
        );


    safePlayers.forEach(function (player) {

        const card =
            document.createElement("button");

        card.type = "button";

        card.className =
            "player-card";


        const selected =
            GAME_STATE.buildRoster.players
                .some(function (selectedPlayer) {

                    return (
                        selectedPlayer.id ===
                        player.id
                    );

                });


        if (selected) {
            card.classList.add("selected");
        }


        card.innerHTML = `
            <span class="player-card-name">
                ${escapeHTML(player.name)}
            </span>

            <span class="player-card-position">
                ${escapeHTML(player.position)}
            </span>

            <span class="player-card-rating">
                ${player.rating}
            </span>

            <span class="player-card-club">
                ${escapeHTML(player.club)}
            </span>

            <span class="player-card-rarity rarity-${String(
                player.rarity
            ).toLowerCase()}">
                ${escapeHTML(player.rarity)}
            </span>
        `;


        card.addEventListener(
            "click",
            function () {
                toggleBuildRosterPlayer(player);
            }
        );


        container.appendChild(card);
    });


    updateRosterCount();
}


/* =========================================================
   TOGGLE BUILD ROSTER PLAYER
   ========================================================= */

function toggleBuildRosterPlayer(player) {

    if (!isValidPlayer(player)) {

        showNotification(
            "Invalid player.",
            "error"
        );

        return;
    }


    const selected =
        GAME_STATE.buildRoster.players;


    const existingIndex =
        selected.findIndex(function (item) {

            return item.id === player.id;

        });


    if (existingIndex >= 0) {

        selected.splice(
            existingIndex,
            1
        );

    } else {

        if (
            selected.length >=
            GAME_CONFIG.BUILD_ROSTER.REQUIRED_PLAYERS
        ) {

            showNotification(
                "You can only select 6 players.",
                "error"
            );

            return;
        }

        selected.push(
            sanitizePlayer(player)
        );
    }


    saveAllGameData();

    updateRosterCount();

    /*
     * Re-render the current list so selected cards
     * update visually.
     */

    const club =
        GAME_STATE.buildRoster.club;

    if (club) {

        getPlayersByClub(club)
            .then(function (players) {

                if (players.length < 6) {

                    players =
                        createFallbackClubPlayers(
                            club,
                            players
                        );
                }

                renderRosterPlayers(players);

            })
            .catch(function () {});
    }
}


/* =========================================================
   BUILD ROSTER COUNT
   ========================================================= */

function updateRosterCount() {

    setText(
        "rosterCount",
        GAME_STATE.buildRoster.players.length +
        " / " +
        GAME_CONFIG.BUILD_ROSTER.REQUIRED_PLAYERS
    );


    const startButton =
        getElement(
            "startRosterSeasonButton"
        );

    if (startButton) {

        startButton.disabled =
            GAME_STATE.buildRoster.players.length !==
            GAME_CONFIG.BUILD_ROSTER.REQUIRED_PLAYERS;
    }
}


/* =========================================================
   START BUILD ROSTER SEASON
   ========================================================= */

function startRosterSeason() {

    if (
        GAME_STATE.buildRoster.players.length !==
        GAME_CONFIG.BUILD_ROSTER.REQUIRED_PLAYERS
    ) {

        showNotification(
            "Select exactly 6 players first.",
            "error"
        );

        return;
    }


    if (!GAME_STATE.buildRoster.club) {

        showNotification(
            "Please select a club first.",
            "error"
        );

        return;
    }


    GAME_STATE.buildRoster.matchNumber = 1;
    GAME_STATE.buildRoster.points = 0;
    GAME_STATE.buildRoster.wins = 0;
    GAME_STATE.buildRoster.draws = 0;
    GAME_STATE.buildRoster.losses = 0;
    GAME_STATE.buildRoster.history = [];


    saveAllGameData();

    updateAllUI();

    showScreen("rosterSeason");

    showNotification(
        "Season started!",
        "success"
    );
}


/* =========================================================
   PLAY BUILD ROSTER MATCH
   ========================================================= */

function playBuildRosterMatch() {

    const state =
        GAME_STATE.buildRoster;


    if (
        state.matchNumber >
        GAME_CONFIG.SEASON.MATCHES
    ) {

        showRosterPresentation();
        return;
    }


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
        homeTeam: state.club,
        awayTeam: opponent,
        homeRating: playerRating,
        awayRating: opponentRating,
        matchNumber: state.matchNumber,
        simulated: false
    };


    renderMatchScreen();

    showScreen("match");
}


/* =========================================================
   PLAY SUPER SQUAD MATCH
   ========================================================= */

function playSuperSquadMatch() {

    const state =
        GAME_STATE.superSquad;


    if (!state.teamName) {

        showNotification(
            "Create your Super Squad first.",
            "error"
        );

        return;
    }


    if (
        state.lineup.length !==
        GAME_CONFIG.SUPER_SQUAD.REQUIRED_PLAYERS
    ) {

        showNotification(
            "You need exactly 11 players in your Starting XI.",
            "error"
        );

        return;
    }


    if (
        state.matchNumber >
        GAME_CONFIG.SEASON.MATCHES
    ) {

        showSuperSquadPresentation();
        return;
    }


    const opponent =
        getRandomOpponentClub();


    const playerRating =
        calculateSquadRating(
            getLineupPlayers()
        );


    let opponentRating =
        getOpponentRating(
            state.difficulty
        );


    /*
     * Actual club strength can influence the opponent
     * slightly while still respecting difficulty limits.
     */

    const actualClubRating =
        getClubRating(opponent);


    opponentRating =
        Math.round(
            (opponentRating + actualClubRating) / 2
        );


    const difficulty =
        state.difficulty === "hard"
            ? GAME_CONFIG.SUPER_SQUAD.DIFFICULTY.HARD
            : GAME_CONFIG.SUPER_SQUAD.DIFFICULTY.EASY;


    opponentRating =
        clamp(
            opponentRating,
            difficulty.MIN_OPPONENT_RATING,
            difficulty.MAX_OPPONENT_RATING
        );


    GAME_STATE.currentMatch = {
        mode: "superSquad",
        returnScreen: "superSquad",
        homeTeam: state.teamName,
        awayTeam: opponent,
        homeRating: playerRating,
        awayRating: opponentRating,
        matchNumber: state.matchNumber,
        simulated: false
    };


    renderMatchScreen();

    showScreen("match");
}


/* =========================================================
   RENDER MATCH SCREEN
   ========================================================= */

function renderMatchScreen() {

    const match =
        GAME_STATE.currentMatch;

    if (!match) {
        return;
    }


    setText(
        "matchCompetition",
        match.mode === "superSquad"
            ? "Super Squad"
            : "Build a Roster"
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
        "matchVenue",
        "Super League Stadium"
    );

    setText(
        "matchMinute",
        "0'"
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
        "matchResult",
        ""
    );


    const events =
        getElement("matchEvents");

    if (events) {
        events.innerHTML =
            "<p>Kick-off is ready!</p>";
    }


    const simulateButton =
        getElement(
            "simulateMatchButton"
        );

    if (simulateButton) {
        simulateButton.disabled = false;
    }
}


/* =========================================================
   SIMULATE CURRENT MATCH
   ========================================================= */

function simulateCurrentMatch() {

    const match =
        GAME_STATE.currentMatch;

    if (!match) {

        showNotification(
            "No match is ready.",
            "error"
        );

        return;
    }


    if (match.simulated) {
        return;
    }


    const score =
        simulateScore(
            match.homeRating,
            match.awayRating
        );


    match.homeScore =
        score.homeScore;

    match.awayScore =
        score.awayScore;

    match.result =
        score.result;

    match.simulated =
        true;


    setText(
        "homeScore",
        score.homeScore
    );

    setText(
        "awayScore",
        score.awayScore
    );

    setText(
        "matchMinute",
        "90'"
    );


    renderMatchEvents(
        score.homeScore,
        score.awayScore,
        match
    );


    const resultText =
        match.mode === "superSquad"
            ? getSuperSquadResultText(score.result)
            : getResultLabel(score.result);


    setText(
        "matchResult",
        resultText
    );


    const simulateButton =
        getElement(
            "simulateMatchButton"
        );

    if (simulateButton) {
        simulateButton.disabled = true;
    }


    if (match.mode === "buildRoster") {

        finishBuildRosterMatch(
            match
        );

    } else {

        finishSuperSquadMatch(
            match
        );
    }
}


/* =========================================================
   MATCH EVENTS
   ========================================================= */

function renderMatchEvents(
    homeScore,
    awayScore,
    match
) {

    const container =
        getElement("matchEvents");

    if (!container) {
        return;
    }


    const events = [];

    const totalGoals =
        homeScore + awayScore;


    if (totalGoals === 0) {

        events.push(
            "90' — Full time. A goalless draw."
        );

    } else {

        for (
            let i = 0;
            i < totalGoals;
            i++
        ) {

            const minute =
                randomInt(
                    5,
                    88
                );

            const homeGoal =
                i < homeScore;

            events.push(
                minute +
                "' — " +
                (
                    homeGoal
                        ? match.homeTeam
                        : match.awayTeam
                ) +
                " scores!"
            );
        }

        events.push(
            "90' — Full time."
        );
    }


    container.innerHTML = "";


    events
        .sort(function () {
            return Math.random() - 0.5;
        })
        .forEach(function (eventText) {

            const paragraph =
                document.createElement("p");

            paragraph.textContent =
                eventText;

            container.appendChild(
                paragraph
            );
        });
}


/* =========================================================
   BUILD ROSTER MATCH FINISH
   ========================================================= */

function finishBuildRosterMatch(match) {

    const state =
        GAME_STATE.buildRoster;


    const result =
        match.result;


    const points =
        getResultPoints(
            result,
            "easy"
        );


    state.points += points;


    if (result === "win") {
        state.wins++;
    } else if (result === "draw") {
        state.draws++;
    } else {
        state.losses++;
    }


    state.history.push({
        matchNumber:
            match.matchNumber,

        opponent:
            match.awayTeam,

        opponentRating:
            match.awayRating,

        homeScore:
            match.homeScore,

        awayScore:
            match.awayScore,

        result,

        points,

        date:
            getTimestamp()
    });


    state.matchNumber++;


    saveAllGameData();

    updateAllUI();


    setTimeout(function () {

        if (
            state.matchNumber >
            GAME_CONFIG.SEASON.MATCHES
        ) {

            showRosterPresentation();

        } else {

            showScreen("rosterSeason");
        }

    }, 1200);
}


/* =========================================================
   SUPER SQUAD MATCH FINISH
   ========================================================= */

function finishSuperSquadMatch(match) {

    const state =
        GAME_STATE.superSquad;


    const points =
        getResultPoints(
            match.result,
            state.difficulty
        );


    state.points += points;


    if (match.result === "win") {
        state.wins++;
    } else if (match.result === "draw") {
        state.draws++;
    } else {
        state.losses++;
    }


    state.history.push({
        matchNumber:
            match.matchNumber,

        opponent:
            match.awayTeam,

        opponentRating:
            match.awayRating,

        homeScore:
            match.homeScore,

        awayScore:
            match.awayScore,

        result:
            match.result,

        points,

        difficulty:
            state.difficulty,

        date:
            getTimestamp()
    });


    state.matchNumber++;


    saveAllGameData();

    updateAllUI();


    setTimeout(function () {

        if (
            state.matchNumber >
            GAME_CONFIG.SEASON.MATCHES
        ) {

            showSuperSquadPresentation();

        } else {

            showScreen("superSquad");
        }

    }, 1200);
}


/* =========================================================
   BUILD ROSTER — SIMULATE WHOLE SEASON
   ========================================================= */

function simulateBuildRosterSeason() {

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


    while (
        state.matchNumber <=
        GAME_CONFIG.SEASON.MATCHES
    ) {

        const opponent =
            getRandomOpponentClub(
                state.club
            );


        const squadRating =
            calculateSquadRating(
                state.players
            );


        const opponentRating =
            getClubRating(opponent);


        const score =
            simulateScore(
                squadRating,
                opponentRating
            );


        const points =
            getResultPoints(
                score.result,
                "easy"
            );


        state.points += points;


        if (score.result === "win") {
            state.wins++;
        } else if (score.result === "draw") {
            state.draws++;
        } else {
            state.losses++;
        }


        state.history.push({
            matchNumber:
                state.matchNumber,

            opponent,

            opponentRating,

            homeScore:
                score.homeScore,

            awayScore:
                score.awayScore,

            result:
                score.result,

            points,

            date:
                getTimestamp()
        });


        state.matchNumber++;
    }


    saveAllGameData();

    updateAllUI();

    showRosterPresentation();
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


    if (!validation.valid) {

        showNotification(
            validation.message,
            "error"
        );

        return;
    }


    if (
        GAME_STATE.superSquad.teamName
    ) {

        showNotification(
            "Your Super Squad already exists.",
            "info"
        );

        return;
    }


    GAME_STATE.superSquad.teamName =
        validation.name;

    GAME_STATE.superSquad.collection =
        [];

    GAME_STATE.superSquad.lineup =
        [];

    GAME_STATE.superSquad.points =
        0;

    GAME_STATE.superSquad.coins =
        0;

    GAME_STATE.superSquad.season =
        1;

    GAME_STATE.superSquad.matchNumber =
        1;

    GAME_STATE.superSquad.wins =
        0;

    GAME_STATE.superSquad.draws =
        0;

    GAME_STATE.superSquad.losses =
        0;

    GAME_STATE.superSquad.history =
        [];


    saveAllGameData();

    updateAllUI();

    showNotification(
        "Welcome to Super Squad, " +
        validation.name +
        "!",
        "success"
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


    GAME_STATE.superSquad.difficulty =
        difficulty;


    saveAllGameData();

    updateAllUI();


    showNotification(
        difficulty === "hard"
            ? "Hard difficulty selected."
            : "Easy difficulty selected.",
        "success"
    );
}


/* =========================================================
   GET STARTING XI PLAYERS
   ========================================================= */

function getLineupPlayers() {

    const state =
        GAME_STATE.superSquad;


    return state.lineup
        .map(function (id) {

            return findPlayerById(
                state.collection,
                id
            );

        })
        .filter(Boolean);
}


/* =========================================================
   SUPER SQUAD PACKS
   ========================================================= */

async function openPack(packType) {

    const state =
        GAME_STATE.superSquad;


    if (!state.teamName) {

        showNotification(
            "Create your Super Squad first.",
            "error"
        );

        return;
    }


    let pack;


    switch (packType) {

        case "bronze":
            pack =
                GAME_CONFIG.PACKS.BRONZE;
            break;

        case "gold":
            pack =
                GAME_CONFIG.PACKS.GOLD;
            break;

        case "icon":
            pack =
                GAME_CONFIG.PACKS.ICON;
            break;

        default:

            showNotification(
                "Invalid pack.",
                "error"
            );

            return;
    }


    if (state.points < pack.COST) {

        showNotification(
            "You need " +
            pack.COST +
            " points to buy this pack.",
            "error"
        );

        return;
    }


    state.points -= pack.COST;


    try {

        const cards =
            await generatePack(
                packType
            );


        if (
            !Array.isArray(cards) ||
            cards.length === 0
        ) {

            state.points += pack.COST;

            showNotification(
                "Pack opening failed. Your points were refunded.",
                "error"
            );

            return;
        }


        cards.forEach(function (card) {

            const safeCard =
                sanitizePlayer(card);

            if (safeCard) {

                state.collection.push(
                    safeCard
                );
            }
        });


        state.collection =
            uniqueById(
                state.collection
            );


        saveAllGameData();

        updateAllUI();

        showPackResults(
            cards,
            pack.NAME
        );


    } catch (error) {

        console.error(
            "Pack error:",
            error
        );


        state.points += pack.COST;

        saveAllGameData();

        showNotification(
            "Pack opening failed. Your points were refunded.",
            "error"
        );
    }
}


/* =========================================================
   PACK RESULTS
   ========================================================= */

function showPackResults(
    cards,
    packName
) {

    let body =
        "<div class=\"pack-results\">";


    cards.forEach(function (card) {

        body += `
            <div class="pack-result-card rarity-${String(
                card.rarity
            ).toLowerCase()}">

                <strong>
                    ${escapeHTML(card.name)}
                </strong>

                <span>
                    ${escapeHTML(card.position)}
                </span>

                <span>
                    ${card.rating}
                </span>

                <small>
                    ${escapeHTML(card.rarity)}
                </small>

                <small>
                    ${escapeHTML(card.club)}
                </small>

            </div>
        `;
    });


    body += "</div>";


    showModal(
        packName,
        body
    );
}


/* =========================================================
   COLLECTION FILTER
   ========================================================= */

function setCollectionFilter(
    filter
) {

    GAME_STATE.collectionFilter =
        filter;


    renderCollection();
}


/* =========================================================
   RENDER COLLECTION
   ========================================================= */

function renderCollection() {

    const state =
        GAME_STATE.superSquad;


    const container =
        getElement("collectionPlayers");

    if (!container) {
        return;
    }


    updateCollectionCounts();


    let cards =
        state.collection;


    if (
        GAME_STATE.collectionFilter !==
        "all"
    ) {

        cards =
            cards.filter(function (player) {

                return (
                    player.rarity ===
                    GAME_STATE.collectionFilter
                );

            });
    }


    container.innerHTML = "";


    if (cards.length === 0) {

        container.innerHTML =
            "<p>No cards found.</p>";

        return;
    }


    cards.forEach(function (player) {

        const card =
            document.createElement("article");

        card.className =
            "collection-card rarity-" +
            String(player.rarity)
                .toLowerCase();


        const isInLineup =
            state.lineup.includes(
                player.id
            );


        card.innerHTML = `
            <h3>
                ${escapeHTML(player.name)}
            </h3>

            <strong>
                ${player.rating}
            </strong>

            <p>
                ${escapeHTML(player.position)}
            </p>

            <p>
                ${escapeHTML(player.club)}
            </p>

            <span>
                ${escapeHTML(player.rarity)}
            </span>

            <button
                type="button"
                class="collection-lineup-button"
                data-player-id="${escapeAttribute(
                    player.id
                )}"
            >
                ${
                    isInLineup
                        ? "Remove from XI"
                        : "Add to XI"
                }
            </button>
        `;


        const button =
            card.querySelector(
                ".collection-lineup-button"
            );


        if (button) {

            button.addEventListener(
                "click",
                function () {

                    toggleLineupPlayer(
                        player.id
                    );

                }
            );
        }


        container.appendChild(card);
    });
}


/* =========================================================
   COLLECTION COUNTS
   ========================================================= */

function updateCollectionCounts() {

    const collection =
        GAME_STATE.superSquad.collection;


    const common =
        collection.filter(function (player) {
            return player.rarity === "Common";
        }).length;


    const rare =
        collection.filter(function (player) {
            return player.rarity === "Rare";
        }).length;


    const icons =
        collection.filter(function (player) {
            return player.rarity === "Icon";
        }).length;


    setText(
        "totalCards",
        collection.length
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

    setText(
        "collectionCount",
        collection.length
    );
}


/* =========================================================
   TOGGLE LINEUP PLAYER
   ========================================================= */

function toggleLineupPlayer(
    playerId
) {

    const state =
        GAME_STATE.superSquad;


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


    const existingIndex =
        state.lineup.indexOf(
            playerId
        );


    if (existingIndex >= 0) {

        state.lineup.splice(
            existingIndex,
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

        state.lineup.push(
            playerId
        );
    }


    saveAllGameData();

    updateAllUI();

    renderCollection();
}


/* =========================================================
   SUPER SQUAD PRESENTATION
   ========================================================= */

function showSuperSquadPresentation() {

    showPresentation(
        GAME_STATE.superSquad,
        true
    );
}


/* =========================================================
   BUILD ROSTER PRESENTATION
   ========================================================= */

function showRosterPresentation() {

    showPresentation(
        GAME_STATE.buildRoster,
        false
    );
}


/* =========================================================
   PRESENTATION
   ========================================================= */

function showPresentation(
    state,
    isSuperSquad
) {

    setText(
        "presentationTeamName",
        isSuperSquad
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
        getElement(
            "presentationResults"
        );


    if (results) {

        results.innerHTML = "";


        state.history.forEach(
            function (match) {

                const item =
                    document.createElement("div");

                item.className =
                    "presentation-result";


                item.innerHTML = `
                    <strong>
                        Match ${match.matchNumber}
                    </strong>

                    <span>
                        ${escapeHTML(match.opponent)}
                    </span>

                    <span>
                        ${match.homeScore} -
                        ${match.awayScore}
                    </span>

                    <span>
                        ${escapeHTML(
                            getResultLabel(
                                match.result
                            )
                        )}
                    </span>

                    <span>
                        +${match.points} points
                    </span>
                `;


                results.appendChild(item);
            }
        );
    }


    setText(
        "presentationSeason",
        state.season
    );


    saveAllGameData();

    showScreen("presentation");
}


/* =========================================================
   START NEW SEASON
   ========================================================= */

function startNewSeason() {

    if (
        GAME_STATE.currentScreen !==
        "presentation"
    ) {
        return;
    }


    /*
     * Determine which mode has just finished.
     */

    if (
        GAME_STATE.superSquad.history.length >=
        GAME_CONFIG.SEASON.MATCHES &&
        GAME_STATE.superSquad.matchNumber >
        GAME_CONFIG.SEASON.MATCHES
    ) {

        GAME_STATE.superSquad.season++;

        GAME_STATE.superSquad.matchNumber = 1;
        GAME_STATE.superSquad.wins = 0;
        GAME_STATE.superSquad.draws = 0;
        GAME_STATE.superSquad.losses = 0;
        GAME_STATE.superSquad.history = [];


        saveAllGameData();

        showScreen("superSquad");

        return;
    }


    if (
        GAME_STATE.buildRoster.history.length >=
        GAME_CONFIG.SEASON.MATCHES &&
        GAME_STATE.buildRoster.matchNumber >
        GAME_CONFIG.SEASON.MATCHES
    ) {

        GAME_STATE.buildRoster.season++;

        GAME_STATE.buildRoster.matchNumber = 1;
        GAME_STATE.buildRoster.wins = 0;
        GAME_STATE.buildRoster.draws = 0;
        GAME_STATE.buildRoster.losses = 0;
        GAME_STATE.buildRoster.points = 0;
        GAME_STATE.buildRoster.history = [];


        saveAllGameData();

        showScreen("buildRoster");

        return;
    }


    showScreen("mainMenu");
}


/* =========================================================
   RESET GAME
   ========================================================= */

function resetGame() {

    showModal(
        "Reset Game",
        `
            <p>
                Are you sure you want to erase all
                Super League Soccer progress?
            </p>

            <button
                type="button"
                id="confirmResetButton"
                class="danger-button"
            >
                Yes, Reset Everything
            </button>
        `
    );


    setTimeout(function () {

        const button =
            getElement(
                "confirmResetButton"
            );

        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                removeFromStorage(
                    GAME_CONFIG.STORAGE_KEYS.BUILD_ROSTER
                );

                removeFromStorage(
                    GAME_CONFIG.STORAGE_KEYS.SUPER_SQUAD
                );


                window.location.reload();
            }
        );

    }, 0);
}


/* =========================================================
   UPDATE ALL UI
   ========================================================= */

function updateAllUI() {

    updateHeader();
    updateBuildRosterUI();
    updateSuperSquadUI();
    updateCollectionCounts();
}


/* =========================================================
   HEADER
   ========================================================= */

function updateHeader() {

    setText(
        "headerPoints",
        GAME_STATE.superSquad.points
    );

    setText(
        "headerCoins",
        GAME_STATE.superSquad.coins
    );
}


/* =========================================================
   BUILD ROSTER UI
   ========================================================= */

function updateBuildRosterUI() {

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

    renderRosterHistory();
    renderLeagueTable();
}


/* =========================================================
   BUILD ROSTER HISTORY
   ========================================================= */

function renderRosterHistory() {

    const container =
        getElement(
            "rosterMatchHistory"
        );


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
            <strong>
                Match ${match.matchNumber}
            </strong>

            <span>
                ${escapeHTML(match.opponent)}
            </span>

            <span>
                ${match.homeScore} -
                ${match.awayScore}
            </span>

            <span>
                ${getResultLabel(match.result)}
            </span>

            <span>
                +${match.points}
            </span>
        `;


        container.appendChild(item);
    });
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


    const rows = [
        {
            team: state.club || "Your Team",
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


    const opponents =
        state.history.map(function (match) {

            return {
                team: match.opponent,
                played: 1,
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
                        ? 3
                        : match.result === "draw"
                            ? 1
                            : 0
            };
        });


    rows.push(...opponents);


    rows.sort(function (a, b) {

        return (
            b.points - a.points
        );
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
   SUPER SQUAD UI
   ========================================================= */

function updateSuperSquadUI() {

    const state =
        GAME_STATE.superSquad;


    setText(
        "superSquadTeamName",
        state.teamName || "No Team"
    );


    const rating =
        calculateSquadRating(
            getLineupPlayers()
        );


    setText(
        "superSquadRating",
        rating
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


    const lineupContainer =
        getElement("startingXI");


    if (lineupContainer) {

        lineupContainer.innerHTML = "";


        const players =
            getLineupPlayers();


        if (players.length === 0) {

            lineupContainer.innerHTML =
                "<p>Your Starting XI is empty.</p>";

        } else {

            players.forEach(function (player) {

                const item =
                    document.createElement("div");

                item.className =
                    "starting-xi-player";


                item.innerHTML = `
                    <strong>
                        ${escapeHTML(player.name)}
                    </strong>

                    <span>
                        ${escapeHTML(player.position)}
                    </span>

                    <span>
                        ${player.rating}
                    </span>
                `;


                lineupContainer.appendChild(
                    item
                );
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


    const easyButton =
        getElement(
            "easyDifficultyButton"
        );

    const hardButton =
        getElement(
            "hardDifficultyButton"
        );


    if (easyButton) {
        easyButton.classList.toggle(
            "active",
            state.difficulty === "easy"
        );
    }

    if (hardButton) {
        hardButton.classList.toggle(
            "active",
            state.difficulty === "hard"
        );
    }


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
            <strong>
                Match ${match.matchNumber}
            </strong>

            <span>
                ${escapeHTML(match.opponent)}
            </span>

            <span>
                ${match.homeScore} -
                ${match.awayScore}
            </span>

            <span>
                ${getResultLabel(match.result)}
            </span>

            <span>
                +${match.points}
            </span>
        `;


        container.appendChild(item);
    });
}


/* =========================================================
   RESULT TEXT
   ========================================================= */

function getSuperSquadResultText(
    result
) {

    const points =
        getResultPoints(
            result,
            GAME_STATE.superSquad.difficulty
        );


    switch (result) {

        case "win":
            return "WIN! +" + points + " points";

        case "draw":
            return "DRAW! +" + points + " points";

        case "loss":
            return "LOSS! +0 points";

        default:
            return "";
    }
}


/* =========================================================
   PRESENTATION SUPPORT
   ========================================================= */

function getPresentationSeason(
    state
) {

    return safeInteger(
        state.season,
        1
    );
}


/* =========================================================
   KEYBOARD ACCESSIBILITY
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            const modal =
                getElement("gameModal");

            if (
                modal &&
                !modal.hidden
            ) {
                closeModal();
            }
        }
    }
);


/* =========================================================
   AUTO-SAVE
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


/* =========================================================
   PERIODIC AUTO-SAVE
   ========================================================= */

setInterval(
    function () {

        try {
            saveAllGameData();
        } catch (error) {
            console.error(
                "Periodic save failed:",
                error
            );
        }

    },
    30000
);
```
