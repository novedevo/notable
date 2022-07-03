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

let notesStorage = localStorage.getItem("notesDisplay")
	? JSON.parse(localStorage.getItem("notesDisplay"))
	: [];

function post() {
	if (inputNotes.value != "") {
		// initializing tags to display in edit-note.html
		var paragraphTag = document.createElement("p");
		var linkTag = document.createElement("a");
		var lineBreak = document.createElement("br");

    var input = inputNotes.value + "\t ".repeat(20);
		// saveNotesToLocalStorage(inputNotes.value); //TODO: include tabs? for now...

		var note = document.createTextNode(input);

		// var notesDisplay = document.getElementById("notesdisplay");

		var toPost = paragraphTag.appendChild(note);

		notesDisplay.appendChild(toPost);

		var currentTime = displayTime.textContent;
    // saveNotesToLocalStorage(currentTime); // !!!!!!!!!!!!!!!!!!!
		var timeNode = document.createTextNode(currentTime);

    // saveNotesToLocalStorage(inputNotes.value + " " + currentTime);
		linkTag.appendChild(timeNode);
		linkTag.href = "https://github.com/novedevo/notable";
    saveNotesToLocalStorage(inputNotes.value + " " + linkTag);
		notesDisplay.appendChild(linkTag);
		notesDisplay.appendChild(lineBreak);
		inputNotes.value = "";
	}
}

function saveNotesToLocalStorage(value) {
	notesStorage.push(value);
	localStorage.setItem("notes", JSON.stringify(notesStorage));
}

function renderNotes() {
	const getNotes = JSON.parse(localStorage.getItem("notes"));
	post();
}

console.log(localStorage.getItem("notes"));
