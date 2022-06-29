var videoURL; // Holds the YouTube video ID in use.

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
    videoId: '', // Initialize with no video ID. Replace with a nice default later.
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

// Method, YT Parser. Not ours.
function getId(url) {
  // Regular expression, all possible combinations before YT unique ID.
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

  // Comparison between arg and the regular expression
  const match = url.match(regExp);

  // Return the video ID by itself.
  return (match && match[2].length === 11)
    ? match[2]
    : null;
}

// Method gets current time on displayed YT Video. Returns timestamp.
// Displays as text for debugging purposes.
function getTime(){
  var timeStamp = ~~player.getCurrentTime();
  document.getElementById("time").innerHTML = timeStamp; // This line would get removed.
  return timeStamp;
}

// Method for jumping to a time in a video. Repeat code atm.
function goToTime(){
  player.seekTo(document.getElementById("timeForm").value);
  document.getElementById("timeForm").value = "";
}

// Method for demo time note creation. Text accompanied with clickable link to activate timestamp.
function createTimeNote(){
  var noteText = document.getElementById("note").value;
  document.getElementById("timeStampNote").innerHTML = noteText;

  var timeStamp = ~~player.getCurrentTime();
  document.getElementById("timeStamp").innerHTML = "Time Stamp: " + timeStamp + " seconds";
}

// Method activates when target text element is clicked, jumps to text specified timestamp in video.
function goToTimeStamp(){
  var timeStamp = document.getElementById("timeStamp").innerHTML;
  var time = timeStamp.replace(/\D/g, '');
  player.seekTo(time);
}
 