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

  timerHtml.innerHTML = ` ${h} : ${m} : ${s}`;
}


/////////////////////// Notes posting functions /////////////////////
/////////////////////// Notes posting functions /////////////////////

function post() {
  var ptag = document.createElement("p")
  var br = document.createElement("br");
  var input = document.getElementById("inputnotes").value;
  var note = document.createTextNode(input)
  var notesdisplay = document.getElementById("notesdisplay")
  var to_post = ptag.appendChild(note);
  notesdisplay.appendChild(to_post);
  notesdisplay.appendChild(br);
  document.getElementById("inputnotes").value = "";
}

var notesdisplay = document.querySelector("#notesdisplay");
notesdisplay.value = localstorage.getItem("notes")

notesdisplay.addEventListener("keyup", event => {
  localStorage.setItem("notes", event.target.value)
})