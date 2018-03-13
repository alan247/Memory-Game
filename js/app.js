// Initialize variables
let cards = ["fa-paper-plane", "fa-anchor", "fa-diamond", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let openCards = [];
let moves = 0;
let matches = 0;
let started = false;
let starsCount = 3;
let timer = new Timer();
const timerContainer = document.querySelector('.timer');


// Timer setup
timer.addEventListener('secondsUpdated', function(e) {
   	timerContainer.textContent = timer.getTimeValues().toString();
});


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {

	// Concatenate the array to have 2 cards of each type
	array = array.concat(array)

    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// Creates the card markup and adds it to the deck
function createCard(cardName) {
	const markUp = `<li class="card"><i class="fa ${cardName}"></i></li>`;
	const deckContainer = document.querySelector('.deck');
	deckContainer.innerHTML += markUp;
}


// Toggles the classes in the selected card to display its content
function toggleCard(card){
	card.classList.toggle('show')
	card.classList.toggle('open')
}


// Checks if the opened cards match
function checkMatch(card) {

	// Push the current card to the array created to store them
	openCards.push(card);

	// If there are 2 cards in the array, make a comparison
	if(openCards.length === 2){
		if (openCards[0].querySelector('i').classList[1] === openCards[1].querySelector('i').classList[1]) {
			openCards = []; // Empty the array
			winCheck();
			console.log('MATCH!');
			console.log(matches);
		} else {	// If they don't match, toggle them back and empty the open cards array
			setTimeout(function() {
				toggleCard(openCards[0]);
				toggleCard(openCards[1]);
				openCards = []; //empty array
			}, 400);
		}
		addMove(); // Add a move to the counter
	}
}


// Update the stars according to the number given in the argument
function updateStars(stars) {
	starsCount = stars;
	const starsContainer = document.querySelector(".stars");
	starsContainer.children[stars].children[0].classList.remove('fa-star')
	starsContainer.children[stars].children[0].classList.add('fa-star-o')
}


// Restores the 3 initial starts
function restoreStars() {
	const starsContainer = document.querySelector(".stars");

	for(let i=0; i < starsContainer.children.length; i++) {
		starsContainer.children[i].children[0].classList.remove('fa-star-o');
		starsContainer.children[i].children[0].classList.add('fa-star');
	}
}


// Adds moves to the counter
function addMove(){
	moves++;

	const movesElement = document.querySelector(".moves");
	movesElement.textContent = moves; // U

	// Update the stars according to the number of moves
	if(moves > 15 && moves < 20){
		updateStars(2);
	} else if(moves >= 20 && moves < 25) {
		updateStars(1);
	} else if(moves >= 25) {
		updateStars(0);
	}
}


// Check if the user won. A user wins when they find all 8 matches
function winCheck(){
	matches++;
	if(matches === 8) {
		endGame();
	}
}


// This is fired when the user wins a game
function endGame(){
	timer.pause();
	const container = document.querySelector(".container");

	document.querySelector('.total-time').textContent = timer.getTimeValues().toString();
	document.querySelector('.total-moves').textContent = moves;
	document.querySelector('.total-stars').textContent = starsCount;
	document.querySelector('.modal').classList.add('display');
	document.querySelector('.overlay').classList.add('display');
	document.querySelector('.modal button').addEventListener('click', resetGame);
}


// Checks when a card has been clicked and fires the class toggles and match checks
document.querySelector('.deck').addEventListener('click', function (event) {
  if (event.target.classList.contains('card')) {

	if(!started){
		started = true;
		timer.start();
	}

    toggleCard(event.target);
	checkMatch(event.target);
  }
})


// Event listener for the reset button
document.querySelector('.restart').addEventListener('click', resetGame)


// Reset game to its initial status
function resetGame() {
	document.querySelector('.deck').innerHTML = '';
	timer.stop();
	document.querySelector('.timer').textContent = '00:00:00';
	moves = 0;
	document.querySelector('.moves').textContent = '0';
	matches = 0;
	document.querySelector('.modal').classList.remove('display');
	document.querySelector('.overlay').classList.remove('display');
	started = false;
	restoreStars();
	play();
}


// Start the game: calls shuffle() and iterates over each item to create the cards
function play() {
	const shuffledDeck = shuffle(cards)
	shuffledDeck.forEach(createCard)
}

// Let's start!
play();
