var videoURL; // Holds the YouTube video ID in use.

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player) after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '850', // Consider modifying size of video player in future iterations.
    width: '1350',
    videoId: '', // Initialized with no video ID. Replace with a nice default later.
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

// This literally does nothing, but the Iframe breaks without it.
function onPlayerStateChange(event) {}

// Method takes URL input, displays video if valid.
function setVideo(inputURL){
  videoURL = getId(document.getElementById(inputURL).value) ; // Get ID from form.
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
  return (match && match[2].length === 11)
    ? match[2]
    : null;
}

// Method gets current time on displayed YT Video. Returns timestamp.
function getTime(){
  var timeStamp = ~~player.getCurrentTime();
  return timeStamp;
}

// Method for demo time note creation. Text accompanied with clickable link to activate timestamp.
function createTimeNote(inputForm,outputNote,outputTimeStamp){
  var noteText = document.getElementById(inputForm).value;
  document.getElementById(outputNote).innerHTML = noteText;
  document.getElementById(outputTimeStamp).innerHTML = "Time Stamp: " + secondsToMinutes(getTime());
}

// Method parses timestamp from element to jump to point in video.
function goToTimeStamp(timeStampLink){
  var timeStamp = document.getElementById(timeStampLink).innerHTML;
  var time = timeStamp.replace(/\D/g, '');
  player.seekTo(time);
}

//converts and formats seconds into hours, minutes and seconds
function secondsToMinutes(time) {
    var seconds = ~~(time % 60);
    var minutes = ~~((time / 60) % 60);
    var hours = ~~((time/60)/60);

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