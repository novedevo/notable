/*global YT*/
let videoURL; // Holds the YouTube video ID in use.

document
	.getElementById("load-video")
	.addEventListener("click", () => setVideo("video-form"));
document
	.getElementById("timestamp-note")
	.addEventListener("click", () => goToTimeStamp("timestamp-note"));
document
	.getElementById("post-note")
	.addEventListener("click", () => createTimeNote("note", "timestamp-note"));

// This function creates an <iframe> (and YouTube player) after the API code downloads.
//automatically called by the API after the page has loaded.
let player;
//eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
	player = new YT.Player("player", {
		height: "850", // Consider modifying size of video player in future iterations.
		width: "1350",
		videoId: "", // Initialized with no video ID. Replace with a nice default later.
		playerVars: {
			playsinline: 1,
		},
		events: {
			// The API will call this function when the video player is ready.
			onReady: (event) => event.target.playVideo(),
			// This literally does nothing, but the Iframe breaks without it.
			onStateChange: () => {},
		},
	});
}

// Method takes URL input, displays video if valid.
function setVideo(inputURL) {
	videoURL = getId(document.getElementById(inputURL).value); // Get ID from form.
	player.loadVideoById(videoURL);
	document.getElementById(inputURL).value = ""; // Reset form to blank state.
}

// Method, YT Parser. Not ours.
function getId(url) {
	// Regular expression, all possible combinations before YT unique ID.
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

	// Comparison between arg and the regular expression
	const match = url.match(regExp);

	// Return the video ID by itself.
	return match && match[2].length === 11 ? match[2] : null;
}

// Method gets current time on displayed YT Video. Returns timestamp.
function getTime() {
	return Math.floor(player.getCurrentTime());
}

// Method for demo time note creation. Text accompanied with clickable link to activate timestamp.
function createTimeNote(inputForm, outputHTML) {
	const noteText = document.getElementById(inputForm).value;
	document.getElementById(outputHTML).innerHTML =
		noteText + " - Time Stamp: " + getTime() + " seconds";
}

// Method parses timestamp from element to jump to point in video.
function goToTimeStamp(timestampNote) {
	const timestamp = document.getElementById(timestampNote).innerHTML;
	const time = timestamp.replace(/\D/g, "");
	player.seekTo(time);
}

//converts and formats seconds into hours, minutes and seconds
function secondsToMinutes(time) {
	var seconds = ~~(time % 60);
	var minutes = ~~((time / 60) % 60);
	var hours = ~~(time / 60 / 60);

	if (seconds < 9) {
		seconds = "0" + seconds;
	}
	if (minutes < 9) {
		minutes = "0" + minutes;
	}
	if (hours < 9) {
		hours = "0" + hours;
	}

	return hours + ":" + minutes + ":" + seconds;
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
		const currentTime = secondsToMinutes(getTime());
		const linkTime = player.getCurrentTime();
		const timeNode = document.createTextNode(currentTime);

		// turning current time into a link tag and appending it to notesDisplay
		linkTag.appendChild(timeNode);
		linkTag.href = "javascript:void(0);";
		linkTag.onclick = () => {
			player.seekTo(linkTime);
		};
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
