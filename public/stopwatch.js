let [seconds, minutes, hours] = [0, 0, 0];
let timerHtml = document.querySelector(".displayTime");
let interval = null;

document.getElementById("startTimer").addEventListener("click", () => {
	if (interval !== null) {
		clearInterval(interval);
	}
	interval = setInterval(calculateTimer, 1000); //idk how many ms to set yet
});

document.getElementById("stopTimer").addEventListener("click", () => {
	clearInterval(interval); //probably doesn't do what we want yet...
});

function calculateTimer() {
	seconds += 1;
	if (seconds == 60) {
		seconds = 0;
		minutes++;
		if (minutes == 60) {
			minutes = 0;
			hours++;
		}
	}

	let h = hours < 10 ? "0" + hours : hours;
	let m = minutes < 10 ? "0" + minutes : minutes;
	let s = seconds < 10 ? "0" + seconds : seconds;

	timerHtml.innerHTML = `${h}:${m}:${s}`;
}

/////////////////////// Notes posting functions /////////////////////
/////////////////////// Notes posting functions /////////////////////

// trigger post button click on enter
function postOnEnter() {
	if (window.event.key === "Enter") {
		window.event.preventDefault();
		post();
	}
}

const inputNotes = document.getElementById("inputnotes");
const notesDisplay = document.getElementById("notesdisplay");
const displayTime = document.getElementById("displayTime");
const paragraphTag = document.createElement("p");
const linkTag = document.createElement("a");
const lineBreak = document.createElement("br");

let notesStorage = localStorage.getItem("notesDisplay")
	? JSON.parse(localStorage.getItem("notesDisplay"))
	: [];

function post() {
	if (inputNotes.value != "") {
		var input = inputNotes.value + "\t ".repeat(20);
		saveNotesToLocalStorage(inputNotes.value);

		var note = document.createTextNode(input);
		var toPost = paragraphTag.appendChild(note);

		notesDisplay.appendChild(toPost);

		var currentTime = displayTime.textContent;
		// saveNotesToLocalStorage(currentTime); 
		var timeNode = document.createTextNode(currentTime);

		// saveNotesToLocalStorage(inputNotes.value + " " + currentTime);
		linkTag.appendChild(timeNode);
		linkTag.href = "https://github.com/novedevo/notable";
		// saveNotesToLocalStorage(inputNotes.value + " " + linkTag);
		notesDisplay.appendChild(linkTag);
		notesDisplay.appendChild(lineBreak);
		inputNotes.value = "";
	}
}

function saveNotesToLocalStorage(value) {
	notesStorage.push(value);
	localStorage.setItem("notes", JSON.stringify(notesStorage));
}

// function renderNotes() {
// const getNotes = JSON.parse(localStorage.getItem("notes"));
// getNotes.forEach((noteSaved) => {
// var note = document.createTextNode(noteSaved);
// var toPost = paragraphTag.appendChild(note);
// notesDisplay.appendChild(toPost);		
// notesDisplay.appendChild(lineBreak);
// });
// }

console.log(localStorage.getItem("notes"));
