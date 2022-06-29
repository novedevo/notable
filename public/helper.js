var videoURL; // Holds the URL being used currently.

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: '',
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
// The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}
// This literally does nothing, but the iframe breaks without it.
function onPlayerStateChange(event) {}

// Method takes URL input, displays video if valid.
function setVideo(){
  videoURL = getId(document.getElementById("videoForm").value) ; // Get ID from form.
  player.loadVideoById(videoURL);
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
function goToTime(){
  player.seekTo(document.getElementById("timeForm").value);
  document.getElementById("timeForm").value = "";
}

function createTimeNote(){
  var videoTime = document.getElementById("videoDisplay");
  var noteText = document.getElementById("note").value;
  document.getElementById("timeStampNote").innerHTML = noteText;

  var timeStamp = ~~player.getCurrentTime();
  document.getElementById("timeStamp").innerHTML = "Time Stamp: " + timeStamp + " seconds";
}

function goToTimeStamp(){
  var timeStamp = document.getElementById("timeStamp").innerHTML;
  var time = timeStamp.replace(/\D/g, '');
  player.seekTo(time);
}
 