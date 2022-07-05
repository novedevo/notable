/* global PDFJS */

var SCALE = 1.3;
var NUM_PAGE = 1;
var HEIGHT = 950;
var WIDTH = 1150;

//get the PDF selected by the user and display it on the screen
document.getElementById("uploadPDF").addEventListener("change", function (e) {
	var file = e.target.files[0];
	if (file.type != "application/pdf") {
		console.error(file.name, "is not a pdf file.");
		return;
	}
	var fileReader = new FileReader();

	fileReader.onload = function () {
		var typedarray = new Uint8Array(this.result);

		PDFJS.getDocument(typedarray).then(function (pdf) {
			GeneratePDF(NUM_PAGE);

			//called everytime a new page is switched to
			function GeneratePDF(NUM_PAGE) {
				pdf.getPage(NUM_PAGE).then(function (page) {
					var viewport = page.getViewport(SCALE);
					var canvas = document.getElementById("canvas");
					canvas.height = HEIGHT;
					canvas.width = WIDTH;

					page.render({
						canvasContext: canvas.getContext("2d"),
						viewport: viewport,
					});
				});
				document.getElementById("pagenum").innerHTML = NUM_PAGE;
			}

			//changes PDF to the previous page
			function PrevPage() {
				if (NUM_PAGE === 1) {
					return;
				}
				NUM_PAGE--;
				GeneratePDF(NUM_PAGE);
			}

			//changes PDF to the next page
			function NextPage() {
				if (NUM_PAGE >= pdf.numPages) {
					return;
				}
				NUM_PAGE++;
				GeneratePDF(NUM_PAGE);
			}

			//add next and prev functionality to buttons
			document.getElementById("prev").addEventListener("click", PrevPage);
			document.getElementById("next").addEventListener("click", NextPage);
		});
	};
	fileReader.readAsArrayBuffer(file);
});

//
// STOP WATCH AND NOTES
//

let [seconds, minutes, hours] = [0, 0, 0];
let beginning;
let timerHtml = document.getElementById("display-time");
let interval = null;

document.getElementById("start-timer").addEventListener("click", () => {
	if (interval !== null) {
		clearInterval(interval);
	}
	beginning = new Date();
	calculateTimer();
	interval = setInterval(calculateTimer, 1000);
});

document.getElementById("stop-timer").addEventListener("click", () => {
	clearInterval(interval); //probably doesn't do what we want yet...
});

function calculateTimer() {
	const difference = new Date(new Date() - beginning);

	timerHtml.textContent = difference.toISOString().substring(11, 19);
}

var pageNumNoteBool = false;

function toggleNumNoteBool() {
	pageNumNoteBool = !pageNumNoteBool;
}

function post(inputNotes, outputNotes, time) {
	if (document.getElementById(inputNotes).value != "") {
		// initializing tags to display in edit-note.html
		const paragraphTag = document.createElement("p");
		const linkTag = document.createElement("a");
		const lineBreak = document.createElement("br");

		// retrieving text filled out in "inputnotes" textarea
		const input = document.getElementById(inputNotes).value + "\t ".repeat(20);

		// turning input text into a node that can be appended to notesDisplay div
		const note = document.createTextNode(input);

		const notesDisplay = document.getElementById(outputNotes);

		// inserting input text to our previously initialized paragraph tag
		const toPost = paragraphTag.appendChild(note);

		// displaying written notes into notesDisplay
		notesDisplay.appendChild(toPost);

		// retrieving current time to append to notesDisplay
		const currentTime = document.getElementById(time).textContent;
		const timeNode = document.createTextNode(currentTime);

		// turning current time into a link tag and appending it to notesDisplay
		linkTag.appendChild(timeNode);
		linkTag.href = "https://github.com/novedevo/notable";
		notesDisplay.appendChild(linkTag);

		// turn on page number with note
		if (pageNumNoteBool == true) {
			var pageNumNote = " Page #" + NUM_PAGE;
			var pageNumNoteNode = document.createTextNode(pageNumNote);
			notesDisplay.appendChild(pageNumNoteNode);
		}

		notesDisplay.appendChild(lineBreak);
		document.getElementById("input-notes").value = "";
	}
}

// trigger post button click on enter
function postOnEnter(inputNotes, outputNotes, time) {
	if (window.event.key === "Enter") {
		window.event.preventDefault();
		console.log(inputNotes);
		post(inputNotes, outputNotes, time);
	}
}
