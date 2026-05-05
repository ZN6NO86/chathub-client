import React, { useEffect, useState } from "react";

export default function ShowRoomInfo({client, roomId, onBack}){
    const [room, setRoom] = useState(null);
    useEffect(() => {
        console.log("Current room info:", room);
    } ,[room]);
    useEffect(() => {
        const joinedRooms = client.getJoinedRooms();
        const targetRoom = (joinedRooms.find(r => r.room_id === roomId) === null) 
                            ? (client.peekInRoom(roomId)) : (client.getRoom(roomId));
        setRoom(targetRoom);
    },[client, roomId]);
    return(
        <div>

        </div>
    );
}