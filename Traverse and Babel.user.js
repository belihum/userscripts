// ==UserScript==
// @name         Traverse and Babel
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Traverse Bible chapters in a book on wordProject, and (if you desire) change the language at random
// @author       Melchizedek Belihu
// @match        https://www.wordproject.org/bibles/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wordproject.org
// @grant        none
// ==/UserScript==

(function() {
var randomizer = 1;
//change this to 1 to randomize language as it is traversed
var direction = 0;
//direction denotes whether we are going backward (0) or forward (1) in the book
const languages = ["sp", "fr", "kj", "am", "po"]
//more languages can be added here for the sake of randomizing, or subtracted
function traverseAndBabel() {
	var url = window.location.href;
	var newUrl;
	var site = url.substring(0, 35);
//lastPart is easier to do, otherwise I would have to take into account the number of digits in the chapter length when parsing the URL back together
	var lastPart = url.substring(url.lastIndexOf("."));
//separating url parts in order to change the language
	var bounds = document.getElementsByClassName("chap");
	bounds = Array.from(bounds);
//get an html collection of all of the chapters and then convert it to an array
	var highChap = String(bounds[bounds.length-1]);
	var lowChap = String(bounds[0]);
//get links to last available chapter and first available chapter
	lowChap = lowChap.substring(lowChap.lastIndexOf("/")+1, lowChap.lastIndexOf("."));
	highChap = highChap.substring(highChap.lastIndexOf("/")+1, highChap.lastIndexOf("."));
/*though most chapter lengths are 2 digits, psalms gets into 3 digits
/takes care of 3 digit outlier chapters while not breaking the code for the majority 2 digit chapters
*/
//get chapter nums then turn into integers
	var currChap = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));
	lowChap = Number(lowChap);
	highChap = Number(highChap);
	currChap = Number(currChap);

	if (currChap > lowChap && currChap < highChap) {
	//if within bounds then traversable forwards and backwards
		switch (direction) {
		case 0:
		currChap--;
		break;


		case 1:
		currChap++;
		break;

		}
	} else if (currChap < lowChap) {
	//only traversable forwards, currChap is first chapter
	if (direction == 1) {
		currChap++;
	}
	} else if (currChap > highChap) {
	//only traversable backwards, currChap is last chapter
	if (direction == 0) {
		currChap--;
	}
	}

//choosing random language if randomizer option enabled
	if (randomizer == 1) {
		var ranLang = Math.round((Math.random()*languages.length));
		if (ranLang == languages.length) {
			ranLang--;
		}
		ranLang = languages[ranLang];
//parsing URL
//language part
	var firstPart = site + ranLang;
//chapter part
	var secondPart = url.substring(37, 41) + currChap + lastPart;
	newUrl = firstPart + secondPart;
	} else {
//otherwise just concatenate the string to traverse it
	newUrl = url.substring(0, 41) + currChap + lastPart;
	}
//finally load the new url
	location.href = newUrl;
}

document.onkeydown = function(e) {
	switch(e.keyCode) {
		case 37: //left arrow
			direction = 0;
			traverseAndBabel();
			break;
		case 39: //right arrow
			direction = 1;
			traverseAndBabel();
			break;
	}
}
})();