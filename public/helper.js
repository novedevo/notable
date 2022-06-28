var currentVideo = ""; // Holds the URL being used currently.

// Method takes URL input, displays video if valid.
function setVideo(){

  var urlPrefix = "https://www.youtube.com/embed/"
  var url = getId(document.getElementById("videoForm").value) ; // Get unique video ID from form.
  currentVideo = urlPrefix+url; // Set as current video URL for use.
  document.getElementById("videoDisplay").src = currentVideo; // Set video.
  document.getElementById("demo").innerHTML = currentVideo; // Debug visual confirmation
  document.getElementById("videoForm").value = ""; // Reset form.
}

// Method, YT Parser. Not Mine.
function getId(url) {
  // Regular expression, all possible combinations before YT unique ID.
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

  // Comparison between arg and the regular expression
  const match = url.match(regExp);

  // Return the video ID.
  return (match && match[2].length === 11)
    ? match[2]
    : null;
}

// Nothing beyond here works yet.

// Method gets current time on displayed YT Video and displays it as text.
// Hopefully can be modified to return timestamps for use. Might need API.
function getTime(){
  var videoTime = document.getElementById("videoDisplay")[0];
  document.getElementById("time").innerHTML = videoTime.getCurrentTime();
}


// Method for jumping to a time in a video. Repeat code atm.
function goToTime(timeInSeconds){
  var timePrefix = "?t=";
  document.getElementById("videoDisplay").src = currentVideo+timePrefix+timeInSeconds;
  document.getElementById("timeForm").value = "";
  document.getElementById("timeResult").innerHTML = url+time;
}