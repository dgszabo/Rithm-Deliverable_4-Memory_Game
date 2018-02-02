var statusStorage = {};
var score = 0;
var oneOpen = false;
var tempSelector;
var pairCounter = 0;
var foundPairs = 0;


document.addEventListener("DOMContentLoaded", function(){
	var imageBoxes = document.querySelectorAll('.imgBox');

	reset();

	function reset() {
		for(var i = 0; i < imageBoxes.length; i++) {
			// making a list of the added pictures
			var pictureName = getPictureName(imageBoxes[i].firstElementChild.src);

			if(statusStorage[pictureName] === undefined) {
				statusStorage[pictureName] = false;
				pairCounter++;
			}

			// adding event listeners to the cards
			imageBoxes[i].addEventListener('click', function() {
				var target = this.firstElementChild;
				if(target.classList[0] === 'hidden') {
					score++;
					target.classList.remove('hidden');

					if(oneOpen === false) {
						oneOpen = true;
						statusStorage[getPictureName(target.src)] = true;
						tempSelector = target;
					} else {
						if(getPictureName(tempSelector.src) === getPictureName(target.src)) {
							foundPairs++;
							if(pairCounter === foundPairs) {
								alert('Game Over');
							}
						} else {
							setTimeout(function() {
								target.classList.add('hidden');
							    statusStorage[getPictureName(target.src)] = false;
							    tempSelector.classList.add('hidden');
							}, 2000);
						}
						oneOpen = false;
					}
				}
				


			});
		}
	}

	function getPictureName(fullAddress) {
		var fullAddressArr = fullAddress.split('/');
		var pictureName = fullAddressArr[fullAddressArr.length - 1];
		return pictureName;
	}
});