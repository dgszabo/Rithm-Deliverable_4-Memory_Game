var statusStorage = { score: 0 }

document.addEventListener("DOMContentLoaded", function(){
	var imageBoxes = document.querySelectorAll('.imgBox');

	for(var i = 0; i < imageBoxes.length; i++) {
		imageBoxes[i].addEventListener('click', function() {
			console.log('You clicked ' + this.firstElementChild.src);
		})
	}
});