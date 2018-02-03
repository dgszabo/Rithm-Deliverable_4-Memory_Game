document.addEventListener("DOMContentLoaded", function(){
	// DOM selectors
	var imageBoxes = document.querySelectorAll('.imgBox');
	var newGameBtn = document.querySelector('#restart');
	var goToScoreBoardBtn = document.querySelector('#goToScoreBoard');
	var scoreDisplay = document.querySelector('#scoreKeeper span');
	var mesh = document.querySelector('#mesh');
	var youWonBoard = document.querySelector('#youWonBoard');
	var okayBtn = document.querySelector('#okayBtn');
	var nameInputForm = document.querySelector('#nameInputForm');
	var nameText = document.querySelector('#nameText');
	var nameInputButton = document.querySelector('#nameInputForm > button');
	var scoreBoard = document.querySelector('#scoreBoard');
	var scoreBoardLis = document.querySelectorAll('#scoreBoard li');

	// all other support variables
	var cards = ['angel', 'bells', 'boot', 'candyCane', 'elf', 'gingerBreadMan', 'gingerBreadWoman', 'greenBulb', 'laurel', 'lights', 'northPole', 'owl', 'penguin', 'penguinDeer', 'present', 'redBulb', 'reindeer', 'santa', 'sleigh', 'snowFlake', 'snowMan', 'star', 'tree', 'wreath'];
	var selectedCards = [];
	var allGameCards = [];
	var statusStorage = {};
	var score = 0;
	var player = '';
	var oneOpen = false;
	var twoOpen = false;
	var tempSelector;
	var pairCounter = 0;
	var foundPairs = 0;

	init();
	
	function init() {
		reset();
		selectRandomCards();
		setupStatusStorage();
		duplicateAndShuffleCards();
		assignCardsToImgBoxes();
		addImgBoxListeners();
		navbarBtns();
		createLocalStore();
		youWonBoardBtns();
		scoreBoardBtns();
	}

	// FUNCTIONS CREATING THE EVENT LISTENERS ON ALL THE BUTTONS
	//	Function creating the navbar listeners
	function navbarBtns() {
		newGameBtn.addEventListener('click', function() {
			reset();
			selectRandomCards();
			setupStatusStorage();
			duplicateAndShuffleCards();
			assignCardsToImgBoxes();
		});

		goToScoreBoardBtn.addEventListener('click', function() {
			renderMesh();
			document.querySelectorAll('#scoreBoard button')[1].classList.remove('hidden');
			renderScoreBoard();
		});
	}

	// Function creating the you won board listeners
	function youWonBoardBtns() {
		okayBtn.addEventListener('click', function() {
			youWonBoard.classList.add('hidden');
			renderScoreBoard();
		});

		nameInputButton.addEventListener('click', function() {
			youWonBoard.classList.add('hidden');
			player = nameText.value;
			writeToLocalStore();
			nameInputForm.reset();
			renderScoreBoard();
		});
	}

	// Function creating the scoreboard listeners
	function scoreBoardBtns() {
		document.querySelectorAll('#scoreBoard button')[0].addEventListener('click', function() {
			reset();
			selectRandomCards();
			setupStatusStorage();
			duplicateAndShuffleCards();
			assignCardsToImgBoxes();
		});

		document.querySelectorAll('#scoreBoard button')[1].addEventListener('click', function() {
			mesh.classList.add('hidden');
			scoreBoard.classList.add('hidden');

		});
	}
		
	// Function creating the listeners on the images
	function addImgBoxListeners() {
		for(var i = 0; i < imageBoxes.length; i++) {
			imageBoxes[i].addEventListener('click', function() {
				var target = this.firstElementChild;
				if(target.classList[0] === 'hidden' && twoOpen === false) {
					score++;
					target.classList.remove('hidden');

					if(oneOpen === false) {
						oneOpen = true;
						statusStorage[getPictureName(target.src)] = true;
						tempSelector = target;
					} else {
						oneOpen = false;
						twoOpen = true;
						if(getPictureName(tempSelector.src) === getPictureName(target.src)) {
							foundPairs++;
							twoOpen = false;
							if(pairCounter === foundPairs) {
								renderMesh();
								renderYouWonBoard();
							}
						} else {
							setTimeout(function() {
								target.classList.add('hidden');
							    statusStorage[getPictureName(target.src)] = false;
							    tempSelector.classList.add('hidden');
							    twoOpen = false;
							}, 1333);
						}
					}
				}
				scoreDisplay.textContent = score;
			});
		}
	}

	// FUNCTION RESETTING THE GAME BEFORE EACH NEW GAME
	function reset() {
		// reset variables
		statusStorage = {};
		selectedCards = [];
		allGameCards = [];
		pairCounter = 0;
		foundPairs = 0;
		score = 0;
		
		for(var i = 0; i < imageBoxes.length; i++) {
			imageBoxes[i].firstElementChild.classList.add('hidden');
		}
		youWonBoard.classList.add('hidden');
		scoreBoard.classList.add('hidden');
		mesh.classList.add('hidden');

		clearScoreBoard();
		scoreDisplay.textContent = '';
	}

	// FUNCTIONS SELECTING, SHUFFLING, ASSIGNING THE CARDS
	// Function selecting the cards from the folder randomly
	function selectRandomCards() {
		var allCards = cards;
		for(var i = 0; i < imageBoxes.length / 2; i++) {
			selectedCards.push(allCards.splice(Math.floor(Math.random() * allCards.length) , 1)[0]);
		}
	}

	// Function duplicating and shuffling the cards in the array
	function duplicateAndShuffleCards() {
  		allGameCards = selectedCards;
  		allGameCards = allGameCards.concat(selectedCards);;
  		var currentIndex = allGameCards.length, temporaryValue, randomIndex;
  
	  	while (0 !== currentIndex) {
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;
		    temporaryValue = allGameCards[currentIndex];
		    allGameCards[currentIndex] = allGameCards[randomIndex];
		    allGameCards[randomIndex] = temporaryValue;
		}
	}

	// Function dealing the cards
	function assignCardsToImgBoxes() {
		for(var i = 0; i < imageBoxes.length; i++) {
			imageBoxes[i].firstElementChild.src = 'Cards/' + allGameCards[i] + '.png';
		}
	}

	// Helper function that helps comparing the cards chosen
	function getPictureName(fullAddress) {
		var fullAddressArr = fullAddress.split('/');
		var pictureName = fullAddressArr[fullAddressArr.length - 1];
		return pictureName;
	}

	// BOARD AND MESH FUNCTIONS
	// Mesh rendering function
	function renderMesh() {
		mesh.classList.remove('hidden');
	}

	// Function rendering the You Won! Board
	function renderYouWonBoard() {
		var storageArr = JSON.parse(localStorage.scores);
		if(storageArr.length < 3 || storageArr[storageArr.length - 1] > score) {
			okayBtn.classList.add('hidden');
			nameInputForm.classList.remove('hidden');
		} else {
			okayBtn.classList.remove('hidden');
			nameInputForm.classList.add('hidden');
		}
		youWonBoard.classList.remove('hidden');
	}

	// Functions rendering and clearing the Scoreboard
	function renderScoreBoard() {
		var storageArr = JSON.parse(localStorage.scores);
		var winnerArr = JSON.parse(localStorage.winners);

		scoreBoard.classList.remove('hidden');

		for(var i = 0; i < storageArr.length; i++) {
			scoreBoardLis[i].textContent = winnerArr[i] + ' - ' + storageArr[i];
		}

	}

	function clearScoreBoard() {
		for(var i = 0; i < scoreBoardLis.length; i++) {
			scoreBoardLis[i].textContent = '';
		}
	}

	// STORAGE FUNCTIONS - CREATE & WRITE
	// Function creating a temporary gameplay storage
	function setupStatusStorage() {
		for(var i = 0; i < selectedCards.length; i++) {
			// making a list of the added pictures
			statusStorage[selectedCards[i]] = false;
			pairCounter++;
		}
	}

	// Function creating local storage properties
	function createLocalStore() {
		if(!localStorage.scores) {
			localStorage.scores = '[]';
			localStorage.winners = '[]';
		}
	}

	// Function writing the scores and players in the local storage
	function writeToLocalStore() {
		var storageArr = JSON.parse(localStorage.scores);
		var winnerArr = JSON.parse(localStorage.winners);
		if(storageArr.length === 0) {
			storageArr.push(score);
			winnerArr.push(player);
		} else {
			if(parseInt(storageArr[0]) > score) {
				storageArr.splice(0, 0, score);
				winnerArr.splice(0, 0, player);
			} else {
				for(var i = storageArr.length - 1; i >=0 ; i--) {
					if(parseInt(storageArr[i]) <= score) {
						storageArr.splice(i + 1, 0, score);
						winnerArr.splice(i + 1, 0, player);
						break;
					}
				}
			}

			if(storageArr.length > 3) {
				storageArr.pop();
				winnerArr.pop();
			}
		}
		localStorage.scores = JSON.stringify(storageArr);
		localStorage.winners = JSON.stringify(winnerArr);
	}

});