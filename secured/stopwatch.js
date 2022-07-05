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

// CURRENTLY DOES NOT POST A NOTE WITH THE TIMESTAMP NEXT TO THE NOTE PROPERLY
// i had to mess it up a bit in order to save the timestamp
const inputNotes = document.getElementById("input-notes");
const notesDisplay = document.getElementById("notes-display");
const notes = JSON.parse(localStorage.getItem("storedNotes") || "[]");
const times = JSON.parse(localStorage.getItem("storedTimes") || "[]");

notes.forEach((note) => {
	renderNote(note);
});

times.forEach((time) => {
	renderTime(time);
});

// posts the note and saves it to localstorage 
function post() {
	if (inputNotes.value != "") {
		const input = inputNotes.value + "\t ".repeat(20);
		const currentTime = displayTime.textContent;
		saveNotesToLocalStorage(inputNotes.value);
		saveTimesToLocalStorage(currentTime)
		renderNote(input);
		renderTime(currentTime);
		inputNotes.value = "";
	}
}

// renders the text portion of the note into the section
function renderNote(text) {
	const note = document.createTextNode(text);
	const toPost = document.createElement("p");
	toPost.appendChild(note);
	notesDisplay.appendChild(toPost);
}

// renders the hyperlinked time portion of the note onto the note section 
function renderTime(time) {
	const timeNode = document.createTextNode(time);
	const linkTag = document.createElement("a");
	linkTag.appendChild(timeNode);
	linkTag.href = "https://github.com/novedevo/notable";
	notesDisplay.appendChild(linkTag);
	notesDisplay.appendChild(document.createElement("br"));
}

function saveNotesToLocalStorage(value) {
	notes.push(value);
	localStorage.setItem("storedNotes", JSON.stringify(notes));
}

function saveTimesToLocalStorage(value) {
	times.push(value);
	localStorage.setItem("storedTimes", JSON.stringify(times));
}

console.log(localStorage.getItem("storedNotes"));
console.log(notes);
console.log(times);