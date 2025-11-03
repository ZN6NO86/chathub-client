
import React, { useEffect, useState } from "react";

import { RiChat3Line, RiContactsLine, RiAccountCircleLine, RiAddCircleLine } from "react-icons/ri";
import "./ChatList.css"
import "./Basic.css"
export default function ChatList({client, onSelectChat, onSelectBtn}){
    const [chats, setChats] = useState([]);
    const [headerText, setHeadText] = useState("");
    useEffect(() =>{
        setHeadText(client.getUserId());
                //console.log(client);
                const rooms = client.getRooms();
                console.log("roomList:", rooms);
                const roomData = rooms.map(room => {
                    const messages = room.timeline.filter(e => e.getType() === "m.room.message");
                    const lastMsg = messages[messages.length -1];
                    return{
                        roomId: room.roomId,
                        roomName: room.name,
                        lastMessage: lastMsg?.getContent()?.body || "(No messages yet)",
                        timeStamp: lastMsg?.getTs() || 0
                    }
                });
                setChats(roomData);
                client.on("room.timeline", (event, room) => {
                    if(event.getType() === "m.room.message"){
                        const newLastMsg = event.getContent();
                        const newTimeStamp = event.getTs();
                        setChats(prevChats => 
                            prevChats.map(prevChat => 
                                prevChat.roomId === room.room_id ? {...prevChat, lastMessage: newLastMsg.body, timeStamp: newTimeStamp} : prevChat
                            )
                        );
                    }
                });
            
        
    },[client]);

    return(
      <div className="baseLayout">
        <header className="header">
            <h3>{headerText}</h3>
            <button
                className="addBtn"
                onClick={() => onSelectBtn("addContact")}
            >
                <RiAddCircleLine />
            </button>
        </header>
        <main className="content">
        {  
            chats.map((chat) => (
                <div
                    key={chat}
                    onClick={() => {
                        onSelectChat(chat);
                    }}
                >   
                    <div className="chatLabel">
                        <h4 className="chatName">{chat.roomName}</h4>
                        <p>{chat.lastMessage}</p>
                    </div> 
                </div>
            ))
        }
        </main>
        
        <footer className="footer">
            <button className="iconBtn" onClick={() => onSelectBtn("chatList")}>
                <RiChat3Line className="icon"/>
                Chats
            </button>
            <button className="iconBtn" onClick={() => onSelectBtn("chatList")}>
                <RiContactsLine className="icon"/>
                Contacts
            </button>
            <button className="iconBtn" onClick={() => onSelectBtn("chatList")}>
                <RiAccountCircleLine className="icon"/>
                Settings
            </button>
        </footer>
      </div>  
    );
}