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
	var paragraphTag = document.createElement("p");
	var lineBreak = document.createElement("br");
	var input = document.getElementById("inputnotes").value + '\t '.repeat(20);
	var note = document.createTextNode(input);
	var notesDisplay = document.getElementById("notesdisplay");
	var toPost = paragraphTag.appendChild(note);
	notesDisplay.appendChild(toPost);
	var currentTime = document.getElementById("displayTime").textContent;
	var timeNode = document.createTextNode(currentTime);
	notesDisplay.appendChild(timeNode);
	notesDisplay.appendChild(lineBreak);
	document.getElementById("inputnotes").value = "";
}

// trigger post button click on enter
function postOnEnter() {
	if (window.event.key === "Enter") {
		window.event.preventDefault();
		post();
	}
}
