var correctGuesses = 0;
var incorrectGuesses = 0;
var timer;
var timeLeft = 90;
var currentGameData = null;
var correctResults = [];
var incorrectResults = [];

// Initialize the game session when the DOM is fully loaded and the path is '/game'
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname === '/game') {
        startGameSession();
    }
});

// Redirect to the game page
function startGame() {
    window.location.href = '/game';
}

// Start a new game session by fetching game data from the server
function startGameSession() {
    fetch('/start_game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        currentGameData = data;
        loadFlag(data);

        // Start the timer if it's not already running
        if (!timer) {
            startTimer();
        }
    });
}

// Load the flag image and options into the game container
function loadFlag(data) {
    var flagImageContainer = document.getElementById('flagImageContainer');
    if (flagImageContainer) {
        flagImageContainer.innerHTML = `<img src="${data.flagUrl}" class="img-fluid" alt="Flag" style="width: 100%; height: 250px;">`;
    }

    var optionsContainer = document.querySelector(".options-container");
    if (optionsContainer) {
        optionsContainer.innerHTML = "";
        data.options.forEach(option => {
            var button = document.createElement("button");
            button.className = "btn custom-button";
            button.textContent = option;
            button.onclick = function() {
                checkAnswer(option, button);
            };
            optionsContainer.appendChild(button);
        });
    }
}

// Mapping of country names to flag emojis
// Function to get flag emoji by country name
function getFlagEmoji(countryName) {
    const flagEmojis = {
        "Afghanistan": "🇦🇫",
        "Albania": "🇦🇱",
        "Algeria": "🇩🇿",
        "Andora": "🇦🇩",
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
        "Cabo Verde (Cape Verde)": "🇨🇻",
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
        "East Timor": "🇹🇱",
        "Ecuador": "🇪🇨",
        "Egypt": "🇪🇬",
        "El Salvador": "🇸🇻",
        "Equatorial Guinea": "🇬🇶",
        "Eritrea": "🇪🇷",
        "Estonia": "🇪🇪",
        "Eswatini (SwazilandEsw)": "🇸🇿",
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
        "Myanmar (Burma)": "🇲🇲",
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
        "Northern Ireland": "🇬🇧",
        "Northern Mariana": "🇲🇵",
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
        "Saba": "🇸🇧",
        "Saint Kitts and Nevis": "🇰🇳",
        "Saint Lucia": "🇱🇨",
        "Saint Vincent and the Grenadines": "🇻🇨",
        "Samoa": "🇼🇸",
        "San Marino": "🇸🇲",
        "São Tomé and Príncipe": "🇸🇹",
        "Saudi Arabia": "🇸🇦",
        "Scotland": "🏴",
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
        "Turkey": "🇹🇷",
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
        "Wales": "🏴",
        "Yemen": "🇾🇪",
        "Zambia": "🇿🇲",
        "Zimbabwe": "🇿🇼"
    };
    return flagEmojis[countryName] || "🏳️"; // Default to white flag if not found
}

// Check the selected answer and update the game state accordingly
function checkAnswer(selectedOption, button) {
    var resultItem = document.createElement("span");

    var flagEmoji = getFlagEmoji(currentGameData.countryName);

    if (selectedOption === currentGameData.countryName) {
        button.style.backgroundColor = "#9BC13B";
        document.getElementById('correctGuesses').textContent = ++correctGuesses;
        resultItem.textContent = flagEmoji;
        correctResults.push(resultItem);
    } else {
        button.style.backgroundColor = "#683216";
        document.getElementById('incorrectGuesses').textContent = ++incorrectGuesses;
        resultItem.textContent = flagEmoji;
        incorrectResults.push(resultItem);
    }

    setTimeout(startGameSession, 1000); // Wait 1 second before loading the next flag
}

// Start the game timer and update the timer display every second
function startTimer() {
    var timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = timeLeft;
    }

    timer = setInterval(() => {
        timeLeft--;
        if (timerElement) {
            timerElement.textContent = timeLeft;

            // Change color based on time left
            if (timerElement <= 10) {
                timerElement.style.color = 'red';
            } else if (timeLeft <= 30) {
                timerElement.style.color = 'orange';
            } else {
                timerElement.style.color = 'black'; // Default color
            }
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

// End the game and display the final score
function endGame() {
    var gameContainer = document.querySelector('.container.mt-5');
    if (gameContainer) {
        var correctResultsHTML = correctResults.map(result => result.outerHTML).join('');
        var incorrectResultsHTML = incorrectResults.map(result => result.outerHTML).join('');
        
        gameContainer.innerHTML = `
            <div class="end-message text-center">
                <h2>Thank you for playing Flagship!</h2>
                <p style="margin-top: 20px; margin-bottom:20px;">Correct guesses: ${correctGuesses}</p>
                <p style="margin-top: 20px; margin-bottom: 20px;">Incorrect guesses: ${incorrectGuesses}</p>
                <div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-primary custom-button" style="background-color: #2A3814; color: #FBFCFF; width: 200px;" onclick="startGame()">Play Again</button>
                </div>
                <div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-secondary custom-button" style="width: 200px; background-color: #FFFAF0; color: 212121;" onclick="learnFlags()">Learn About Flags</button>
                </div>
                <div style="margin-top: 20px;">
                    <h3>Your Results</h3>
                    <div class="results-list" id="resultsList">
                        <div><strong>✅:</strong> ${correctResultsHTML}</div>
                        <div><strong>❌:</strong> ${incorrectResultsHTML}</div>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
                        <button class="btn custom-button" style="background-color: #F8C064; color: #212121; width: 200px;" onclick="copyResults()">Share Your Result</button>
                    </div>
                </div>
                <img src="static/flags.png" style="width: 100%; height: auto; margin-top: 20px; margin-bottom: 20px;">
            </div>
        `;
    }
    // Clear the timer when the game ends
    clearInterval(timer);
    timer = null;
}

// Redirect to the learn flags page
function learnFlags() {
    window.location.href = '/learnflags'; // This points to learnflags.html
}

// Copy the results to the clipboard
function copyResults() {
    var resultsText = `✅: ${correctResults.map(result => result.textContent).join(' ')}\n❌: ${incorrectResults.map(result => result.textContent).join(' ')}`;
    navigator.clipboard.writeText(resultsText).then(function() {
        alert('Results copied to clipboard!');
    }, function() {
        alert('Failed to copy results.');
    });
}
