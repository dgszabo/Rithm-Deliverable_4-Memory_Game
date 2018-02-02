var cards = ['angel', 'bells', 'boot', 'candyCane', 'elf', 'gingerBreadMan', 'gingerBreadWoman', 'greenBulb', 'laurel', 'lights', 'northPole', 'owl', 'penguin', 'penguinDeer', 'present', 'redBulb', 'reindeer', 'santa', 'sleigh', 'snowFlake', 'snowMan', 'star', 'tree', 'wreath'];
var selectedCards = [];
var allGameCards = [];
var statusStorage = {};
var score = 0;
var oneOpen = false;
var twoOpen = false;
var tempSelector;
var pairCounter = 0;
var foundPairs = 0;


document.addEventListener("DOMContentLoaded", function(){
	var imageBoxes = document.querySelectorAll('.imgBox');
	var newGameBtn = document.querySelector('#restart');

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
	}

	function createLocalStore() {
		if(!localStorage.scoreBoard) {
			localStorage.scoreBoard = '[]';
		}
	}

	function writeToLocalStore() {
		var storageArr = JSON.parse(localStorage.scoreBoard);
		if(storageArr.length === 0) {
			storageArr.push(score);
		} else {
			if(parseInt(storageArr[0]) > score) {
				storageArr.splice(0, 0, score);
			} else {
				for(var i = storageArr.length - 1; i >=0 ; i--) {
					if(parseInt(storageArr[i]) <= score) {
						storageArr.splice(i + 1, 0, score);
						break;
					}
				}
			}

			if(storageArr.length > 10) {
				storageArr.pop();
			}
		}
		localStorage.scoreBoard = JSON.stringify(storageArr);
	}

	function navbarBtns() {
		newGameBtn.addEventListener('click', function() {
			reset();
			selectRandomCards();
			setupStatusStorage();
			duplicateAndShuffleCards();
			assignCardsToImgBoxes();
		});
	}

	function setupStatusStorage() {
		for(var i = 0; i < selectedCards.length; i++) {
			// making a list of the added pictures
			statusStorage[selectedCards[i]] = false;
			pairCounter++;
		}
	}

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
	}

	function selectRandomCards() {
		var allCards = cards;
		for(var i = 0; i < imageBoxes.length / 2; i++) {
			selectedCards.push(allCards.splice(Math.floor(Math.random() * allCards.length) , 1)[0]);
		}
	}

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

	function assignCardsToImgBoxes() {
		for(var i = 0; i < imageBoxes.length; i++) {
			imageBoxes[i].firstElementChild.src = 'Cards/' + allGameCards[i] + '.png';
		}
	}

	function getPictureName(fullAddress) {
		var fullAddressArr = fullAddress.split('/');
		var pictureName = fullAddressArr[fullAddressArr.length - 1];
		return pictureName;
	}

	function addImgBoxListeners() {
		for(var i = 0; i < imageBoxes.length; i++) {
			// adding event listeners to the cards
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
								alert('Game Over\nYour score is ' + score);
								writeToLocalStore();
							}
						} else {
							setTimeout(function() {
								target.classList.add('hidden');
							    statusStorage[getPictureName(target.src)] = false;
							    tempSelector.classList.add('hidden');
							    twoOpen = false;
							}, 2000);
						}
					}
				}
			});
		}
	}
});