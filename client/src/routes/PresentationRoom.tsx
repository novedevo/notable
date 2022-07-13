import { Button } from "@mui/material";
import { useEffect, useState } from "react";

function PresentationRoom({ socket, username, room } : any) {	
    const [userInfo, setUserInfo] = useState<string[]>([]);

    useEffect (() => {
        socket.emit("get_users", room);
    }, [socket]);
 	
    socket.on("user_list", (data: any) => {
        data.forEach((element: { name: string; }) => {
            if (userInfo.indexOf(element.name) === -1) {
            setUserInfo([...userInfo, element.name]);
            }
        });
    });

    useEffect(() => {
        console.log(userInfo);
      }, [userInfo]);

    /*
    <Button href="" variant="contained" onClick={getUsers}>
				Get Users
	</Button>

    const getUsers = () => {
		socket.emit("get_users", room);
	}

    */

  return (
    <div> 
        <h2>List of Users in Room {room}</h2>
        <div>
        {userInfo.map(user => {
			return <li>{user}</li>
		})}
        </div>
    </div>
  );
}

export default PresentationRoom;