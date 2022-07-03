let [seconds, minutes, hours] = [0, 0, 0];
let timerHtml = document.querySelector("#displayTime");
let interval = null;

document.getElementById("startTimer").addEventListener("click", () => {
	if (interval !== null) {
		clearInterval(interval);
	}
	interval = setInterval(calculateTimer, 1000);
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

function post() {
	if (document.getElementById("inputnotes").value != "") {
		// initializing tags to display in edit-note.html
		var paragraphTag = document.createElement("p");
		var linkTag = document.createElement("a");
		var lineBreak = document.createElement("br");

		// retrieving text filled out in "inputnotes" textarea
		var input = document.getElementById("inputnotes").value + "\t ".repeat(20);

		// turning input text into a node that can be appended to notesDisplay div
		var note = document.createTextNode(input);

		var notesDisplay = document.getElementById("notesdisplay");

		// inserting input text to our previously initialized paragraph tag
		var toPost = paragraphTag.appendChild(note);

		// displaying written notes into notesDisplay
		notesDisplay.appendChild(toPost);

		// retrieving current time to append to notesDisplay
		var currentTime = document.getElementById("displayTime").textContent;
		var timeNode = document.createTextNode(currentTime);

		// turning current time into a link tag and appending it to notesDisplay
		linkTag.appendChild(timeNode);
		linkTag.href = "https://github.com/novedevo/notable";
		notesDisplay.appendChild(linkTag);
		notesDisplay.appendChild(lineBreak);
		document.getElementById("inputnotes").value = "";
	}
}

// trigger post button click on enter
function postOnEnter() {
	if (window.event.key === "Enter") {
		window.event.preventDefault();
		post();
	}
}
