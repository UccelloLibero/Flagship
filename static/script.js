var GAME_LENGTH = 90;
var correctGuesses = 0;
var incorrectGuesses = 0;
var streak = 0;
var bestStreak = 0;
var timer = null;
var timeLeft = GAME_LENGTH;
var gameOver = false;
var awaitingAnswer = false;
var currentGameData = null;
var rounds = []; // Every answered flag, in order, for the results screen
var shownFlags = new Set(); // Track shown flags

// Initialize the game session when the DOM is fully loaded and the path is '/game'
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname === '/game') {
        document.addEventListener('keydown', handleKeyAnswer);
        runCountdown(startGameSession);
    }
});

// Redirect to the game page
function startGame() {
    window.location.href = '/game';
}

// Show a short "3, 2, 1, Go!" countdown in the flag area before the clock starts
function runCountdown(onDone) {
    var flagImageContainer = document.getElementById('flagImageContainer');
    var steps = ["3", "2", "1", "Go!"];
    var i = 0;

    function showStep() {
        if (i >= steps.length) {
            onDone();
            return;
        }
        flagImageContainer.innerHTML = `<div class="countdown">${steps[i]}</div>`;
        i++;
        setTimeout(showStep, i === steps.length ? 500 : 550);
    }
    showStep();
}

// Start a new round by fetching a flag the player hasn't seen yet from the server
function startGameSession() {
    if (gameOver) {
        return;
    }
    fetch('/start_game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ exclude: Array.from(shownFlags) })
    })
    .then(response => response.json())
    .then(data => {
        // The game may have ended while the request was in flight
        if (gameOver) {
            return;
        }
        currentGameData = data;
        shownFlags.add(data.countryName); // Add the new flag to the set of shown flags
        loadFlag(data);

        // Start the timer if it's not already running
        if (!timer) {
            startTimer();
        }
    })
    .catch(() => {
        setTimeout(startGameSession, 1000);
    });
}

// Escape text before putting it into HTML
function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Load the flag image and options into the game container.
// The image is preloaded so the old flag never blinks out and the layout never jumps.
function loadFlag(data) {
    var flagImageContainer = document.getElementById('flagImageContainer');
    var image = new Image();
    image.className = "game-flag";
    image.alt = "Mystery flag";

    image.onload = image.onerror = function() {
        // A newer round (or the end of the game) may have replaced this one while loading
        if (currentGameData !== data || gameOver) {
            return;
        }
        if (flagImageContainer) {
            flagImageContainer.replaceChildren(image);
        }
        showOptions(data);
    };
    image.src = data.flagUrl;
}

// Show the answer buttons for a round
function showOptions(data) {
    var optionsContainer = document.querySelector(".options-container");
    if (optionsContainer) {
        optionsContainer.innerHTML = "";
        data.options.forEach((option, index) => {
            var button = document.createElement("button");
            button.className = "btn custom-button option-button";
            button.innerHTML = `<span class="option-key">${index + 1}</span><span class="option-label"></span>`;
            button.querySelector('.option-label').textContent = option;
            button.dataset.option = option;
            button.onclick = function() {
                checkAnswer(option, button);
            };
            optionsContainer.appendChild(button);
        });
    }
    awaitingAnswer = true;
}

// Let players answer with the 1, 2 and 3 keys
function handleKeyAnswer(event) {
    var index = parseInt(event.key, 10) - 1;
    if (!awaitingAnswer || isNaN(index)) {
        return;
    }
    var buttons = document.querySelectorAll(".options-container button");
    if (buttons[index]) {
        buttons[index].click();
    }
}

// Disable all option buttons to prevent multiple selection per session
function disableOptions() {
    awaitingAnswer = false;
    var optionsContainer = document.querySelector(".options-container");
    var buttons = optionsContainer.querySelectorAll("button");
    buttons.forEach(button => {
        button.disabled = true;
    });
}

// Briefly bounce a scoreboard number when it changes
function bump(element) {
    element.classList.remove("bump");
    void element.offsetWidth; // Restart the animation
    element.classList.add("bump");
}

// Mapping of country names to flag emojis
// Function to get flag emoji by country name
function getFlagEmoji(countryName) {
    const flagEmojis = {
        "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "Hong Kong": "🇭🇰",
        "Cook Islands": "🇨🇰",
        "Puerto Rico": "🇵🇷",
        "Bermuda": "🇧🇲",
        "Gibraltar": "🇬🇮",
        "French Polynesia": "🇵🇫",
        "American Samoa": "🇦🇸",
        "United States Virgin Islands": "🇻🇮",
        "British Virgin Islands": "🇻🇬",
        "Cayman Islands": "🇰🇾",
        "Falkland Islands": "🇫🇰",
        "Isle of Man": "🇮🇲",
        "Åland": "🇦🇽",
        "Afghanistan": "🇦🇫",
        "Albania": "🇦🇱",
        "Algeria": "🇩🇿",
        "Andorra": "🇦🇩",
        "Angola": "🇦🇴",
        "Antigua and Barbuda": "🇦🇬",
        "Argentina": "🇦🇷",
        "Armenia": "🇦🇲",
        "Aruba": "🇦🇼",
        "Australia": "🇦🇺",
        "Austria": "🇦🇹",
        "Azerbaijan": "🇦🇿",
        "The Bahamas": "🇧🇸",
        "Bahrain": "🇧🇭",
        "Bangladesh": "🇧🇩",
        "Barbados": "🇧🇧",
        "Belarus": "🇧🇾",
        "Belgium": "🇧🇪",
        "Belize": "🇧🇿",
        "Benin": "🇧🇯",
        "Bhutan": "🇧🇹",
        "Bolivia": "🇧🇴",
        "Bosnia and Herzegovina": "🇧🇦",
        "Bonaire": "🇧🇶",
        "Botswana": "🇧🇼",
        "Brazil": "🇧🇷",
        "Brunei": "🇧🇳",
        "Bulgaria": "🇧🇬",
        "Burkina Faso": "🇧🇫",
        "Burundi": "🇧🇮",
        "Cabo Verde": "🇨🇻",
        "Cambodia": "🇰🇭",
        "Cameroon": "🇨🇲",
        "Canada": "🇨🇦",
        "Central African Republic": "🇨🇫",
        "Chad": "🇹🇩",
        "Chile": "🇨🇱",
        "China": "🇨🇳",
        "Colombia": "🇨🇴",
        "Comoros": "🇰🇲",
        "Democratic Republic of the Congo": "🇨🇩",
        "Republic of the Congo": "🇨🇬",
        "Costa Rica": "🇨🇷",
        "Côte d'Ivoire": "🇨🇮",
        "Croatia": "🇭🇷",
        "Cuba": "🇨🇺",
        "Curaçao": "🇨🇼",
        "Cyprus": "🇨🇾",
        "Czech Republic": "🇨🇿",
        "Denmark": "🇩🇰",
        "Djibouti": "🇩🇯",
        "Dominica": "🇩🇲",
        "Dominican Republic": "🇩🇴",
        "Timor-Leste": "🇹🇱",
        "Ecuador": "🇪🇨",
        "Egypt": "🇪🇬",
        "El Salvador": "🇸🇻",
        "Equatorial Guinea": "🇬🇶",
        "Eritrea": "🇪🇷",
        "Estonia": "🇪🇪",
        "Eswatini": "🇸🇿",
        "Ethiopia": "🇪🇹",
        "Faroe Islands": "🇫🇴",
        "Fiji": "🇫🇯",
        "Finland": "🇫🇮",
        "France": "🇫🇷",
        "Gabon": "🇬🇦",
        "The Gambia": "🇬🇲",
        "Georgia": "🇬🇪",
        "Germany": "🇩🇪",
        "Ghana": "🇬🇭",
        "Greece": "🇬🇷",
        "Grenada": "🇬🇩",
        "Greenland": "🇬🇱",
        "Guadeloupe": "🇬🇵",
        "Guam": "🇬🇺",
        "Guatemala": "🇬🇹",
        "Guinea": "🇬🇳",
        "Guinea-Bissau": "🇬🇼",
        "Guyana": "🇬🇾",
        "Haiti": "🇭🇹",
        "Honduras": "🇭🇳",
        "Hungary": "🇭🇺",
        "Iceland": "🇮🇸",
        "India": "🇮🇳",
        "Indonesia": "🇮🇩",
        "Iran": "🇮🇷",
        "Iraq": "🇮🇶",
        "Ireland": "🇮🇪",
        "Israel": "🇮🇱",
        "Italy": "🇮🇹",
        "Jamaica": "🇯🇲",
        "Japan": "🇯🇵",
        "Jordan": "🇯🇴",
        "Kazakhstan": "🇰🇿",
        "Kenya": "🇰🇪",
        "Kiribati": "🇰🇮",
        "North Korea": "🇰🇵",
        "South Korea": "🇰🇷",
        "Kosovo": "🇽🇰",
        "Kuwait": "🇰🇼",
        "Kyrgyzstan": "🇰🇬",
        "Laos": "🇱🇦",
        "Latvia": "🇱🇻",
        "Lebanon": "🇱🇧",
        "Lesotho": "🇱🇸",
        "Liberia": "🇱🇷",
        "Libya": "🇱🇾",
        "Liechtenstein": "🇱🇮",
        "Lithuania": "🇱🇹",
        "Luxembourg": "🇱🇺",
        "Macao": "🇲🇴",
        "Madagascar": "🇲🇬",
        "Malawi": "🇲🇼",
        "Malaysia": "🇲🇾",
        "Maldives": "🇲🇻",
        "Mali": "🇲🇱",
        "Malta": "🇲🇹",
        "Marshall Islands": "🇲🇭",
        "Mauritania": "🇲🇷",
        "Mauritius": "🇲🇺",
        "Mexico": "🇲🇽",
        "Federated States of Micronesia": "🇫🇲",
        "Moldova": "🇲🇩",
        "Monaco": "🇲🇨",
        "Mongolia": "🇲🇳",
        "Montenegro": "🇲🇪",
        "Morocco": "🇲🇦",
        "Mozambique": "🇲🇿",
        "Myanmar": "🇲🇲",
        "Namibia": "🇳🇦",
        "Nauru": "🇳🇷",
        "Nepal": "🇳🇵",
        "Netherlands": "🇳🇱",
        "New Caledonia": "🇳🇨",
        "New Zealand": "🇳🇿",
        "Nicaragua": "🇳🇮",
        "Niger": "🇳🇪",
        "Nigeria": "🇳🇬",
        "Niue": "🇳🇺",
        "Northern Ireland": "🏳️",
        "Northern Mariana Islands": "🇲🇵",
        "North Macedonia": "🇲🇰",
        "Norway": "🇳🇴",
        "Oman": "🇴🇲",
        "Pakistan": "🇵🇰",
        "Palau": "🇵🇼",
        "Palestine": "🇵🇸",
        "Panama": "🇵🇦",
        "Papua New Guinea": "🇵🇬",
        "Paraguay": "🇵🇾",
        "Peru": "🇵🇪",
        "Philippines": "🇵🇭",
        "Poland": "🇵🇱",
        "Portugal": "🇵🇹",
        "Qatar": "🇶🇦",
        "Romania": "🇷🇴",
        "Russia": "🇷🇺",
        "Rwanda": "🇷🇼",
        "Saba": "🇧🇶",
        "Saint Kitts and Nevis": "🇰🇳",
        "Saint Lucia": "🇱🇨",
        "Saint Vincent and the Grenadines": "🇻🇨",
        "Samoa": "🇼🇸",
        "San Marino": "🇸🇲",
        "São Tomé and Príncipe": "🇸🇹",
        "Saudi Arabia": "🇸🇦",
        "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        "Senegal": "🇸🇳",
        "Serbia": "🇷🇸",
        "Seychelles": "🇸🇨",
        "Sierra Leone": "🇸🇱",
        "Singapore": "🇸🇬",
        "Slovakia": "🇸🇰",
        "Slovenia": "🇸🇮",
        "Solomon Islands": "🇸🇧",
        "Somalia": "🇸🇴",
        "South Africa": "🇿🇦",
        "South Sudan": "🇸🇸",
        "Spain": "🇪🇸",
        "Sint Eustatius": "🇧🇶",
        "Sint Maarten": "🇸🇽",
        "Sri Lanka": "🇱🇰",
        "Sudan": "🇸🇩",
        "Suriname": "🇸🇷",
        "Sweden": "🇸🇪",
        "Switzerland": "🇨🇭",
        "Syria": "🇸🇾",
        "Taiwan": "🇹🇼",
        "Tajikistan": "🇹🇯",
        "Tanzania": "🇹🇿",
        "Thailand": "🇹🇭",
        "Togo": "🇹🇬",
        "Tonga": "🇹🇴",
        "Trinidad and Tobago": "🇹🇹",
        "Tunisia": "🇹🇳",
        "Türkiye": "🇹🇷",
        "Turkmenistan": "🇹🇲",
        "Tuvalu": "🇹🇻",
        "Uganda": "🇺🇬",
        "Ukraine": "🇺🇦",
        "United Arab Emirates": "🇦🇪",
        "United Kingdom": "🇬🇧",
        "United States of America": "🇺🇸",
        "Uruguay": "🇺🇾",
        "Uzbekistan": "🇺🇿",
        "Vanuatu": "🇻🇺",
        "Vatican City": "🇻🇦",
        "Venezuela": "🇻🇪",
        "Vietnam": "🇻🇳",
        "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
        "Yemen": "🇾🇪",
        "Zambia": "🇿🇲",
        "Zimbabwe": "🇿🇼"
    };
    return flagEmojis[countryName] || "🏳️"; // Default to white flag if not found
}

// Check the selected answer and update the game state accordingly
function checkAnswer(selectedOption, button) {
    if (!awaitingAnswer || gameOver) {
        return;
    }
    disableOptions(); // Disable all options after selection

    var isCorrect = selectedOption === currentGameData.countryName;
    rounds.push({
        name: currentGameData.countryName,
        flagUrl: currentGameData.flagUrl,
        fact: currentGameData.fact,
        factSource: currentGameData.factSource,
        emoji: getFlagEmoji(currentGameData.countryName),
        guess: selectedOption,
        correct: isCorrect
    });

    var streakElement = document.getElementById('streak');
    var delay;

    if (isCorrect) {
        button.classList.add("is-correct");
        document.getElementById('correctGuesses').textContent = ++correctGuesses;
        bump(document.getElementById('correctGuesses'));

        streak++;
        bestStreak = Math.max(bestStreak, streak);
        delay = 500;
    } else {
        button.classList.add("is-wrong");
        document.getElementById('incorrectGuesses').textContent = ++incorrectGuesses;
        bump(document.getElementById('incorrectGuesses'));

        // Reveal the right answer so every miss is a chance to learn
        document.querySelectorAll(".options-container button").forEach(optionButton => {
            if (optionButton.dataset.option === currentGameData.countryName) {
                optionButton.classList.add("is-answer");
            }
        });
        streak = 0;
        delay = 1100;
    }

    if (streakElement) {
        streakElement.textContent = streak;
        document.getElementById('streakChip').classList.toggle("is-hot", streak >= 3);
    }

    setTimeout(startGameSession, delay); // Pause so the player can see the result before the next flag
}

// Start the game timer and update the timer display every second
function startTimer() {
    var timerElement = document.getElementById('timer');
    var voyage = document.querySelector('.voyage');
    var globe = document.getElementById('timerGlobe');
    var fill = document.getElementById('timerFill');
    var globeFrames = ["🌍", "🌎", "🌏"]; // Africa/Europe, Americas, Asia/Australia: the earth turns as time passes

    function render() {
        if (timerElement) {
            timerElement.textContent = timeLeft;
        }
        var progress = (GAME_LENGTH - timeLeft) / GAME_LENGTH;
        if (globe) {
            globe.style.left = (progress * 100) + "%";
            globe.textContent = globeFrames[(GAME_LENGTH - timeLeft) % globeFrames.length];
        }
        if (fill) {
            fill.style.width = (progress * 100) + "%";
        }
        if (voyage) {
            // Change color based on time left
            voyage.classList.toggle("is-hurry", timeLeft <= 30 && timeLeft > 10);
            voyage.classList.toggle("is-urgent", timeLeft <= 10);
        }
    }

    render();
    timer = setInterval(() => {
        timeLeft--;
        render();

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Read and update the player's personal best, which lives only in this browser
function updatePersonalBest(score) {
    var previousBest = 0;
    try {
        previousBest = parseInt(localStorage.getItem('flagshipBest'), 10) || 0;
        if (score > previousBest) {
            localStorage.setItem('flagshipBest', score);
        }
    } catch (error) {
        // Storage can be unavailable (e.g. private browsing); the game works without it
    }
    return { previousBest: previousBest, isNewBest: score > previousBest && score > 0 };
}

// End the game and display the final score
function endGame() {
    // Clear the timer when the game ends
    gameOver = true;
    awaitingAnswer = false;
    clearInterval(timer);
    timer = null;

    var gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        var totalGuesses = correctGuesses + incorrectGuesses;
        var accuracy = totalGuesses ? Math.round(correctGuesses / totalGuesses * 100) : 0;
        var best = updatePersonalBest(correctGuesses);

        var resultsHTML = rounds.map(round => `
            <li class="result-row ${round.correct ? "is-correct" : "is-wrong"}">
                <div class="result-flag"><img src="${escapeHtml(round.flagUrl)}" alt="Flag of ${escapeHtml(round.name)}" loading="lazy"></div>
                <div class="result-body">
                    <div class="result-head">
                        <span class="result-name">${escapeHtml(round.name)}</span>
                        <span class="result-mark">${round.correct ? "Correct" : "Missed"}</span>
                    </div>
                    <p class="result-fact">${escapeHtml(round.fact)} <a class="result-source" href="${escapeHtml(round.factSource)}" target="_blank" rel="noopener">Source</a></p>
                    ${round.correct ? "" : `<p class="result-guess">You guessed ${escapeHtml(round.guess)}</p>`}
                </div>
            </li>
        `).join('');

        gameContainer.innerHTML = `
            <div class="end-message">
                <div class="text-center">
                    <p class="end-kicker">Time's up</p>
                    <h2>${correctGuesses} ${correctGuesses === 1 ? "flag" : "flags"} right</h2>
                    ${best.isNewBest ? `<p class="new-best">New personal best</p>` : ""}
                </div>
                <div class="end-stats">
                    <div class="end-stat"><span class="end-stat-value">${correctGuesses}</span><span class="end-stat-label">correct</span></div>
                    <div class="end-stat"><span class="end-stat-value">${accuracy}%</span><span class="end-stat-label">accuracy</span></div>
                    <div class="end-stat"><span class="end-stat-value">${bestStreak}</span><span class="end-stat-label">best streak</span></div>
                    <div class="end-stat"><span class="end-stat-value">${Math.max(best.previousBest, correctGuesses)}</span><span class="end-stat-label">personal best</span></div>
                </div>
                <div class="end-actions">
                    <button class="btn custom-button play-button" onclick="startGame()">Play Again</button>
                    <button class="btn custom-button share-results-button" onclick="copyResults()">Share Results</button>
                    <button class="btn custom-button learn-more-button" onclick="learnFlags()">Learn Flags</button>
                </div>
                <p id="shareStatus" class="share-status text-center" aria-live="polite"></p>
                <div class="results-block">
                    <h3>Your flags</h3>
                    ${rounds.length ? `<ol class="results-list">${resultsHTML}</ol>` : `<p class="results-empty">No flags answered this time.</p>`}
                </div>
            </div>
        `;
    }
}

// Redirect to the learn flags page
function learnFlags() {
    window.location.href = '/learnflags'; // This points to learnflags.html
}

// Show a short message under the share button
function setShareStatus(text) {
    var status = document.getElementById('shareStatus');
    if (status) {
        status.textContent = text;
    }
}

// Share results via the Web Share API, or copy them to the clipboard
function copyResults() {
    var correctEmojis = rounds.filter(round => round.correct).map(round => round.emoji).join(' ');
    var missedEmojis = rounds.filter(round => !round.correct).map(round => round.emoji).join(' ');
    var resultsText = `Flagship 🌍\n` +
        `${correctGuesses} correct · best streak ${bestStreak}\n\n` +
        `✅: ${correctEmojis}\n` +
        `❌: ${missedEmojis}\n\n` +
        `${window.location.origin}`;

    if (navigator.share) {
        navigator.share({ text: resultsText }).then(() => {
            setShareStatus('Results shared.');
        }).catch((error) => {
            // The player closed the share sheet on purpose; nothing to do
            if (error.name === 'AbortError') {
                return;
            }
            fallbackCopyResults(resultsText); // Fallback to copy to clipboard if sharing fails
        });
    } else {
        fallbackCopyResults(resultsText); // Fallback if Web Share API is not supported
    }
}

// Fallback function to copy results to clipboard
function fallbackCopyResults(resultsText) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(resultsText).then(() => {
            setShareStatus('Results copied to clipboard.');
        }, () => {
            fallbackManualCopy(resultsText);
        });
    } else {
        fallbackManualCopy(resultsText);
    }
}

// Fallback for browsers without the async clipboard API (e.g. Safari private browsing, plain http)
function fallbackManualCopy(resultsText) {
    var tempInput = document.createElement("textarea");
    tempInput.value = resultsText;
    tempInput.setAttribute("readonly", "");
    tempInput.style.position = "fixed";
    tempInput.style.opacity = "0";
    document.body.appendChild(tempInput);
    tempInput.select();
    var copied = false;
    try {
        copied = document.execCommand("copy");
    } catch (error) {
        copied = false;
    }
    document.body.removeChild(tempInput);
    setShareStatus(copied ? 'Results copied to clipboard.' : 'Could not copy automatically.');
}
