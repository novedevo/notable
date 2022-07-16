import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:3001";
const socket = io(ENDPOINT);
socket.on("connect_error", (err: { message: any; }) => {
  console.log(`connect_error due to ${err.message}`);
});

function PresentationRoomTest() {	
  let currentURL = window.location.href;
  const [userInfo, setUserInfo] = useState<string[]>([]);
  const localPresentations = localStorage.getItem("localpresentationList");
	let presentations: any[] = [];
	try {
		presentations = JSON.parse(localPresentations!);
	} catch (err) {
		presentations = [];
	}

  // Section for testing outputs with console.log 
  useEffect(() => {
    console.log(currentPresentation);
  }, []);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  // gets the Presentation ID from the url and finds the corresponding presentation in the database
  let presentationId = currentURL.split("room/")[1];
  let currentPresentation: any;
  presentations.forEach(presentation => {
    if (presentationId === presentation.presentationId) {
      currentPresentation = presentation;
    }
  });

  // Everytime a new user joins the room the socket is updated and this useEffect is called
  // it calls "get_users" in index.js and sends the presentationId of the room the user joined
  useEffect (() => {
      socket.emit("get_users", currentPresentation.presentationId);
  }, [socket]);

 	// Recieves the call when "user_list" is sent in index.js, it names the usernames of all the users
  // that have uniquely joined this room and adds it to an array locally
  socket.on("user_list", (data: any) => {
      data.forEach((element: { name: string; }) => {
          if (userInfo.indexOf(element.name) === -1) {
          setUserInfo([...userInfo, element.name]);
          }
      });
  });

  return (
    <div> 
      <h1>Welcome to Presentation Room {currentPresentation.title}</h1>
      <h2>The Presentation ID for this room is {currentPresentation.presentationId}</h2>
      <h3>This Presentation is scheduled to start on {currentPresentation.date}</h3>
      <div>
        {userInfo.map(user => {
			    return <li>{user}</li>
		    })}
      </div>
    </div>
  );
}

export default PresentationRoomTest;