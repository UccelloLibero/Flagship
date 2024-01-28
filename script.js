var correctAnswer;
var maxGuesses;
var currentGuesses;
var correctGuesses;
var incorrectGuesses;


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