let [seconds, minutes, hours] = [0, 0, 0];
let timerHtml = document.getElementById("display-time");
let interval = null;

document.getElementById("start-timer").addEventListener("click", () => {
	if (interval !== null) {
		clearInterval(interval);
	}
	interval = setInterval(calculateTimer, 1000);
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

	let h = hours < 10 ? "0" + hours : hours;
	let m = minutes < 10 ? "0" + minutes : minutes;
	let s = seconds < 10 ? "0" + seconds : seconds;

	timerHtml.innerHTML = `${h}:${m}:${s}`;
}

/////////////////////// Notes posting functions /////////////////////

function post() {
	if (document.getElementById("input-notes").value != "") {
		// initializing tags to display in edit-note.html
		const paragraphTag = document.createElement("p");
		const linkTag = document.createElement("a");
		const lineBreak = document.createElement("br");

		// retrieving text filled out in "inputnotes" textarea
		const input =
			document.getElementById("input-notes").value + "\t ".repeat(20);

		// turning input text into a node that can be appended to notesDisplay div
		const note = document.createTextNode(input);

		const notesDisplay = document.getElementById("notes-display");

		// inserting input text to our previously initialized paragraph tag
		const toPost = paragraphTag.appendChild(note);

		// displaying written notes into notesDisplay
		notesDisplay.appendChild(toPost);

		// retrieving current time to append to notesDisplay
		const currentTime = document.getElementById("display-time").textContent;
		const timeNode = document.createTextNode(currentTime);

		// turning current time into a link tag and appending it to notesDisplay
		linkTag.appendChild(timeNode);
		linkTag.href = "https://github.com/novedevo/notable";
		notesDisplay.appendChild(linkTag);
		notesDisplay.appendChild(lineBreak);
		document.getElementById("input-notes").value = "";
	}
}

// trigger post button click on enter
function postOnEnter() {
	if (window.event.key === "Enter") {
		window.event.preventDefault();
		post();
	}
}
