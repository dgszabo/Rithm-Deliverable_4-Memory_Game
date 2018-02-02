var cards = ['angel', 'bells', 'boot', 'candyCane', 'elf', 'gingerBreadMan', 'gingerBreadWoman', 'greenBulb', 'laurel', 'lights', 'northPole', 'owl', 'penguin', 'penguinDeer', 'present', 'redBulb', 'reindeer', 'santa', 'sleigh', 'snowFlake', 'snowMan', 'star', 'tree', 'wreath'];
var selectedCards = [];
var statusStorage = {};
var score = 0;
var oneOpen = false;
var twoOpen = false;
var tempSelector;
var pairCounter = 0;
var foundPairs = 0;


document.addEventListener("DOMContentLoaded", function(){
	var imageBoxes = document.querySelectorAll('.imgBox');

	selectRandomCards();
	assignCardsToImgBoxes();
	reset();
	addImgBoxListeners();

	function navbarButtons() {

	}

	function reset() {
		// reset variables
		statusStorage = {};
		tempSelector = undefined;
		pairCounter = 0;
		foundPairs = 0;

		for(var i = 0; i < imageBoxes.length; i++) {
			// making a list of the added pictures
			var pictureName = getPictureName(imageBoxes[i].firstElementChild.src);

			if(statusStorage[pictureName] === undefined) {
				statusStorage[pictureName] = false;
				pairCounter++;
			}
		}
	}

	function selectRandomCards() {
		var allCards = cards;
		for(var i = 0; i < imageBoxes.length / 2; i++) {
			selectedCards.push(allCards.splice(Math.floor(Math.random() * allCards.length) , 1)[0]);
		}
	}

	function assignCardsToImgBoxes() {
		var tempCards = [].concat(selectedCards);
		var allCards = [].concat(selectedCards);
		for(var i = 0; i < selectedCards.length; i++) {
			allCards.push(tempCards.splice(Math.floor(Math.random() * tempCards.length), 1)[0]);
		}
		for(var i = 0; i < imageBoxes.length; i++) {
			imageBoxes[i].firstElementChild.src = 'Cards/' + allCards[i] + '.png';
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
								alert('Game Over');
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