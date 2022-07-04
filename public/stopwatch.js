let [seconds, minutes, hours] = [0, 0, 0];

const displayTime = document.getElementById("display-time");
let interval = null;

document.getElementById("start-timer").addEventListener("click", () => {
	if (interval !== null) {
		clearInterval(interval);
	}
	interval = setInterval(calculateTimer, 1000); //idk how many ms to set yet
});

document.getElementById("stop-timer").addEventListener("click", () => {
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

	const h = hours < 10 ? "0" + hours : hours;
	const m = minutes < 10 ? "0" + minutes : minutes;
	const s = seconds < 10 ? "0" + seconds : seconds;

	displayTime.innerHTML = `${h}:${m}:${s}`;
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

const inputNotes = document.getElementById("input-notes");
const notesDisplay = document.getElementById("notes-display");

const notesStorage = JSON.parse(localStorage.getItem("notesDisplay") || "[]");

function post() {
	if (inputNotes.value != "") {
		const input = inputNotes.value + "\t ".repeat(20);
		saveNotesToLocalStorage(inputNotes.value);

		const note = document.createTextNode(input);
		const toPost = document.createElement("p");
		toPost.appendChild(note);

		notesDisplay.appendChild(toPost);

		const currentTime = displayTime.textContent;
		// saveNotesToLocalStorage(currentTime);
		const timeNode = document.createTextNode(currentTime);

		// saveNotesToLocalStorage(inputNotes.value + " " + currentTime);
		const linkTag = document.createElement("a");
		linkTag.appendChild(timeNode);
		linkTag.href = "https://github.com/novedevo/notable";
		// saveNotesToLocalStorage(inputNotes.value + " " + linkTag);
		notesDisplay.appendChild(linkTag);
		notesDisplay.appendChild(document.createElement("br"));
		inputNotes.value = "";
	}

	console.log(localStorage.getItem("notes"));
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
