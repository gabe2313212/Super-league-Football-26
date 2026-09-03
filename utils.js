```javascript
/* =========================================================
   SUPER LEAGUE SOCCER
   utils.js
   Shared utility functions
   ========================================================= */

"use strict";

/* =========================================================
   RANDOM NUMBER HELPERS
   ========================================================= */

/**
 * Returns a random integer between min and max, inclusive.
 */
function randomInt(min, max) {
    min = Number(min);
    max = Number(max);

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
        throw new TypeError("randomInt requires valid numbers.");
    }

    min = Math.ceil(min);
    max = Math.floor(max);

    if (min > max) {
        throw new RangeError("randomInt minimum cannot exceed maximum.");
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Returns a random floating-point number between min and max.
 */
function randomFloat(min, max) {
    min = Number(min);
    max = Number(max);

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
        throw new TypeError("randomFloat requires valid numbers.");
    }

    if (min > max) {
        throw new RangeError("randomFloat minimum cannot exceed maximum.");
    }

    return Math.random() * (max - min) + min;
}


/**
 * Returns a random item from an array.
 */
function randomItem(array) {
    if (!Array.isArray(array) || array.length === 0) {
        return null;
    }

    return array[randomInt(0, array.length - 1)];
}


/**
 * Creates a shuffled copy of an array.
 * The original array is never modified.
 */
function shuffleArray(array) {
    if (!Array.isArray(array)) {
        return [];
    }

    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = randomInt(0, i);

        const temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }

    return copy;
}


/* =========================================================
   ID HELPERS
   ========================================================= */

/**
 * Creates a unique ID for game objects.
 */
function createId(prefix = "id") {

    const safePrefix = String(prefix)
        .replace(/[^a-zA-Z0-9_-]/g, "")
        .slice(0, 20) || "id";

    return (
        safePrefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 10)
    );
}


/* =========================================================
   NUMBER HELPERS
   ========================================================= */

function clamp(value, min, max) {

    value = Number(value);
    min = Number(min);
    max = Number(max);

    if (!Number.isFinite(value)) {
        value = min;
    }

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return value;
    }

    if (min > max) {
        return Math.min(value, min);
    }

    return Math.min(Math.max(value, min), max);
}


function safeNumber(value, fallback = 0) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


function safeInteger(value, fallback = 0) {

    const number = Number(value);

    return Number.isInteger(number)
        ? number
        : fallback;
}


/* =========================================================
   STRING HELPERS
   ========================================================= */

function cleanText(value, maxLength = 100) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/[\u0000-\u001F\u007F]/g, "")
        .trim()
        .slice(0, maxLength);
}


function escapeHTML(value) {

    const text = String(value ?? "");

    const element = document.createElement("div");
    element.textContent = text;

    return element.innerHTML;
}


/**
 * Makes text safe for use as a basic HTML attribute.
 */
function escapeAttribute(value) {
    return escapeHTML(value)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


/* =========================================================
   TEAM NAME VALIDATION
   ========================================================= */

const PROFANITY_WORDS = Object.freeze([
    "fuck",
    "fucker",
    "fucking",
    "shit",
    "sh1t",
    "bitch",
    "b1tch",
    "bastard",
    "asshole",
    "arsehole",
    "dick",
    "d1ck",
    "cock",
    "c0ck",
    "piss",
    "p1ss",
    "cunt",
    "c0nt",
    "nigger",
    "n1gger",
    "nigga",
    "n1gga",
    "whore",
    "slut",
    "rape",
    "rapist",
    "pedo",
    "pedophile"
]);


/**
 * Normalises text so simple attempts to bypass
 * the profanity filter are harder.
 */
function normalizeFilterText(text) {

    return String(text ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[0-9]/g, function (number) {

            const replacements = {
                "0": "o",
                "1": "i",
                "2": "z",
                "3": "e",
                "4": "a",
                "5": "s",
                "6": "g",
                "7": "t",
                "8": "b",
                "9": "g"
            };

            return replacements[number] || number;
        })
        .replace(/[^a-z]/g, "");
}


/**
 * Checks whether a team name contains profanity.
 */
function containsProfanity(teamName) {

    const original = String(teamName ?? "").toLowerCase();

    const normalized = normalizeFilterText(teamName);

    for (const word of PROFANITY_WORDS) {

        const normalizedWord = normalizeFilterText(word);

        if (
            original.includes(word.toLowerCase()) ||
            normalized.includes(normalizedWord)
        ) {
            return true;
        }
    }

    return false;
}


/**
 * Validates a team name.
 */
function validateTeamName(teamName) {

    const name = cleanText(
        teamName,
        GAME_CONFIG.TEAM_NAME.MAX_LENGTH
    );

    if (!name) {
        return {
            valid: false,
            message: "Please enter a team name."
        };
    }

    if (name.length < GAME_CONFIG.TEAM_NAME.MIN_LENGTH) {
        return {
            valid: false,
            message:
                "Team name must be at least " +
                GAME_CONFIG.TEAM_NAME.MIN_LENGTH +
                " characters."
        };
    }

    if (name.length > GAME_CONFIG.TEAM_NAME.MAX_LENGTH) {
        return {
            valid: false,
            message:
                "Team name cannot exceed " +
                GAME_CONFIG.TEAM_NAME.MAX_LENGTH +
                " characters."
        };
    }

    if (containsProfanity(name)) {
        return {
            valid: false,
            message: "Please choose a family-friendly team name."
        };
    }

    if (!/[a-zA-Z0-9]/.test(name)) {
        return {
            valid: false,
            message: "Team name must contain letters or numbers."
        };
    }

    return {
        valid: true,
        name
    };
}


/* =========================================================
   PLAYER VALIDATION
   ========================================================= */

function isValidPlayer(player) {

    if (!player || typeof player !== "object") {
        return false;
    }

    if (!player.id || !player.name) {
        return false;
    }

    if (!player.position || !player.club) {
        return false;
    }

    const rating = Number(player.rating);

    if (
        !Number.isFinite(rating) ||
        rating < 1 ||
        rating > 100
    ) {
        return false;
    }

    return true;
}


/**
 * Creates a safe player object.
 */
function sanitizePlayer(player) {

    if (!player || typeof player !== "object") {
        return null;
    }

    const rating = clamp(
        Math.round(safeNumber(player.rating, 1)),
        1,
        100
    );

    return {
        id: cleanText(player.id, 100),
        name: cleanText(player.name, 100),
        position: cleanText(player.position, 20),
        rating,
        club: cleanText(player.club, 100),
        rarity: cleanText(
            player.rarity || GAME_CONFIG.RARITIES.COMMON,
            20
        )
    };
}


/* =========================================================
   SQUAD RATING
   ========================================================= */

/**
 * Calculates the average rating of a squad.
 */
function calculateSquadRating(players) {

    if (!Array.isArray(players) || players.length === 0) {
        return 0;
    }

    const validPlayers = players.filter(isValidPlayer);

    if (validPlayers.length === 0) {
        return 0;
    }

    const total = validPlayers.reduce(function (sum, player) {
        return sum + Number(player.rating);
    }, 0);

    return Math.round(total / validPlayers.length);
}


/* =========================================================
   POINTS
   ========================================================= */

function getResultPoints(result, difficulty = "easy") {

    const cleanResult = String(result ?? "")
        .toLowerCase();

    if (difficulty === "hard") {

        if (cleanResult === "win") {
            return GAME_CONFIG.SUPER_SQUAD.DIFFICULTY.HARD.WIN_POINTS;
        }

        if (cleanResult === "draw") {
            return GAME_CONFIG.SUPER_SQUAD.DIFFICULTY.HARD.DRAW_POINTS;
        }

        return GAME_CONFIG.SUPER_SQUAD.DIFFICULTY.HARD.LOSS_POINTS;
    }

    if (cleanResult === "win") {
        return GAME_CONFIG.SUPER_SQUAD.DIFFICULTY.EASY.WIN_POINTS;
    }

    if (cleanResult === "draw") {
        return GAME_CONFIG.SUPER_SQUAD.DIFFICULTY.EASY.DRAW_POINTS;
    }

    return GAME_CONFIG.SUPER_SQUAD.DIFFICULTY.EASY.LOSS_POINTS;
}


/* =========================================================
   MATCH RESULT HELPERS
   ========================================================= */

function getResultFromScore(homeScore, awayScore) {

    homeScore = safeInteger(homeScore, 0);
    awayScore = safeInteger(awayScore, 0);

    if (homeScore > awayScore) {
        return "win";
    }

    if (homeScore < awayScore) {
        return "loss";
    }

    return "draw";
}


function getResultLabel(result) {

    switch (String(result ?? "").toLowerCase()) {

        case "win":
            return "Win";

        case "loss":
            return "Loss";

        case "draw":
            return "Draw";

        default:
            return "Unknown";
    }
}


/* =========================================================
   MATCH SCORE SIMULATION
   ========================================================= */

/**
 * Generates a football score using team ratings.
 *
 * This is deliberately bounded so extreme scores cannot
 * break the UI or create unrealistic numbers.
 */
function simulateScore(homeRating, awayRating) {

    homeRating = clamp(
        safeNumber(homeRating, 75),
        1,
        100
    );

    awayRating = clamp(
        safeNumber(awayRating, 75),
        1,
        100
    );

    const ratingDifference = homeRating - awayRating;

    let homeGoals = randomInt(0, 2);
    let awayGoals = randomInt(0, 2);

    if (ratingDifference >= 8) {
        homeGoals += randomInt(0, 2);
    } else if (ratingDifference <= -8) {
        awayGoals += randomInt(0, 2);
    }

    if (ratingDifference >= 20) {
        homeGoals += 1;
    }

    if (ratingDifference <= -20) {
        awayGoals += 1;
    }

    homeGoals = clamp(
        homeGoals,
        GAME_CONFIG.MATCH.MIN_GOALS,
        GAME_CONFIG.MATCH.MAX_GOALS
    );

    awayGoals = clamp(
        awayGoals,
        GAME_CONFIG.MATCH.MIN_GOALS,
        GAME_CONFIG.MATCH.MAX_GOALS
    );

    return {
        homeScore: homeGoals,
        awayScore: awayGoals,
        result: getResultFromScore(homeGoals, awayGoals)
    };
}


/* =========================================================
   OPPONENT RATING
   ========================================================= */

function getOpponentRating(difficulty = "easy") {

    const selectedDifficulty =
        difficulty === "hard"
            ? GAME_CONFIG.SUPER_SQUAD.DIFFICULTY.HARD
            : GAME_CONFIG.SUPER_SQUAD.DIFFICULTY.EASY;

    return randomInt(
        selectedDifficulty.MIN_OPPONENT_RATING,
        selectedDifficulty.MAX_OPPONENT_RATING
    );
}


/* =========================================================
   DATE / TIME HELPERS
   ========================================================= */

function getTimestamp() {
    return new Date().toISOString();
}


function formatDate(timestamp) {

    if (!timestamp) {
        return "Unknown date";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return date.toLocaleDateString();
}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

/**
 * Safely saves JSON data.
 */
function saveToStorage(key, data) {

    if (!key) {
        return false;
    }

    try {

        localStorage.setItem(
            String(key),
            JSON.stringify(data)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save game data:",
            error
        );

        return false;
    }
}


/**
 * Safely loads JSON data.
 */
function loadFromStorage(key, fallback = null) {

    if (!key) {
        return fallback;
    }

    try {

        const raw = localStorage.getItem(String(key));

        if (raw === null) {
            return fallback;
        }

        return JSON.parse(raw);

    } catch (error) {

        console.error(
            "Unable to load saved game data:",
            error
        );

        return fallback;
    }
}


/**
 * Safely removes saved data.
 */
function removeFromStorage(key) {

    if (!key) {
        return false;
    }

    try {

        localStorage.removeItem(String(key));

        return true;

    } catch (error) {

        console.error(
            "Unable to remove saved game data:",
            error
        );

        return false;
    }
}


/* =========================================================
   ARRAY HELPERS
   ========================================================= */

function uniqueById(items) {

    if (!Array.isArray(items)) {
        return [];
    }

    const seen = new Set();
    const result = [];

    for (const item of items) {

        if (!item || !item.id) {
            continue;
        }

        if (seen.has(item.id)) {
            continue;
        }

        seen.add(item.id);
        result.push(item);
    }

    return result;
}


/**
 * Finds a player by ID.
 */
function findPlayerById(players, playerId) {

    if (!Array.isArray(players)) {
        return null;
    }

    return (
        players.find(function (player) {
            return player &&
                String(player.id) === String(playerId);
        }) || null
    );
}


/* =========================================================
   SAFE DOM HELPERS
   ========================================================= */

function getElement(id) {

    if (!id) {
        return null;
    }

    return document.getElementById(id);
}


function setText(id, value) {

    const element = getElement(id);

    if (!element) {
        return false;
    }

    element.textContent = String(value ?? "");

    return true;
}


function setHTML(id, html) {

    const element = getElement(id);

    if (!element) {
        return false;
    }

    element.innerHTML = String(html ?? "");

    return true;
}


function showElement(id) {

    const element = getElement(id);

    if (!element) {
        return false;
    }

    element.hidden = false;

    return true;
}


function hideElement(id) {

    const element = getElement(id);

    if (!element) {
        return false;
    }

    element.hidden = true;

    return true;
}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function showNotification(message, type = "info") {

    const notification = getElement("notification");

    if (!notification) {
        console.log(message);
        return;
    }

    notification.textContent = String(message ?? "");

    notification.className =
        "notification notification-" +
        String(type);

    notification.hidden = false;

    clearTimeout(
        showNotification.timeout
    );

    showNotification.timeout = setTimeout(
        function () {
            notification.hidden = true;
        },
        3500
    );
}


/* =========================================================
   MODAL
   ========================================================= */

function showModal(title, body) {

    const modal = getElement("gameModal");

    if (!modal) {
        return;
    }

    setText("modalTitle", title);
    setHTML("modalBody", body);

    modal.hidden = false;
}


function closeModal() {

    const modal = getElement("gameModal");

    if (!modal) {
        return;
    }

    modal.hidden = true;
}


/* =========================================================
   CONFIGURATION CHECK
   ========================================================= */

function isGameConfigReady() {

    return Boolean(
        typeof GAME_CONFIG !== "undefined" &&
        GAME_CONFIG.SEASON &&
        GAME_CONFIG.BUILD_ROSTER &&
        GAME_CONFIG.SUPER_SQUAD &&
        GAME_CONFIG.PACKS &&
        GAME_CONFIG.ICONS
    );
}


/* =========================================================
   GLOBAL ERROR HANDLING
   ========================================================= */

window.addEventListener("error", function (event) {

    console.error(
        "Super League Soccer error:",
        event.error || event.message
    );

    if (
        typeof showNotification === "function"
    ) {
        showNotification(
            "Something went wrong. Please try again.",
            "error"
        );
    }
});


window.addEventListener(
    "unhandledrejection",
    function (event) {

        console.error(
            "Unhandled game error:",
            event.reason
        );

        if (
            typeof showNotification === "function"
        ) {
            showNotification(
                "Something went wrong. Please try again.",
                "error"
            );
        }
    }
);


/* =========================================================
   STARTUP CHECK
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    if (!isGameConfigReady()) {

        console.error(
            "Super League Soccer configuration failed to load."
        );

        return;
    }

    console.log(
        "Super League Soccer utilities loaded successfully."
    );
});
```
