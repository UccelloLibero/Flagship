var correctAnswer;
var currentGuesses;
var correctGuesses;
var incorrectGuesses;
var timer;

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

function startGame() {
    window.location.href = '/game';
}