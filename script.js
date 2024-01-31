var correctAnswer;
var currentGuesses;
var correctGuesses;
var incorrectGuesses;
var timer;

function startGameTimer() {
    // Start the game immediately
    startGame();

    // Set up timer to repeat the game every
}

function startGame() {
    window.location.href = '/game.html';

    var flagImageContainer = document.getElementById('flagImageContainer');

    // GET request to get_random_flag route
    fetch('/get_random_flag')
        .then(response => response.json())
        .then(data => {
            // Display the flag images
            for(let i = 0; i < data.flags.length; i++) {
                var flagDiv = document.createElement('div');
                flagDiv.style.backgroundImage = "url('" + data.flags[i] + "')";
                flagDiv.className = 'flag-option';
                flagDiv.onclick = function() {
                    checkAnswer(data.optipns[i][0]);
                };
                flagImageContainer.appendChild(flagDiv);
            }
        });
}


function loadFlag() {
    // Display the flag image
    var flagImageContainer = document.getElementById("flagImageContainer");
    flagImageContainer.style.backgroundImage = "url('" + flagUrl + "')";

    // Display the options
    var optionsContainer = document.querySelector(".options-container");
    optionsContainer.innerHTML = ""; // Clear previous options

    optionsContainer.forEach(function (option) {
        var button = document.createElement("button");
        button.textContent = option;
        button.onclick = function () {
            checkAnswer(option);
        }

        optionsContainer.appendChild(button);
    });
}


function checkAnswer(selectedOption) {
    if (selectedOption === correctAnswer) {
        alert("Correct! You guesses the flag correctly");
        correctGuesses++;
    } else {
        alert("Incorrect. Try again!");
        incorrectGuesses++
    }

    currentGuesses++;

    // Check if the maximum number of guesses is reached
    if (currentGuesses >= maxGuesses) {
        alert("maximum number of guesses reached. Game will reset.");
        // Redirect to the index page to reset the game
        window.location.href = '/';
    }
}

