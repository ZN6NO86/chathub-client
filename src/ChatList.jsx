import React, { useEffect, useState } from "react";
import { RiChat3Line, RiContactsLine, RiAccountCircleLine, RiAddCircleLine } from "react-icons/ri";
import "./ChatList.css"
import "./Basic.css"
import axios from "axios";
export default function ChatList({onSelectChat, onSelectBtn, userInfo, connection}){
    const [chats, setChats] = useState([]);
    const [headerText, setHeadText] = useState("");
    useEffect(() =>{
        const fetchChats = async () => {
            try{
                const res = await axios.post("http://localhost:5111/api/chat/pullChatList", {UserId: userInfo.id});
                console.log("Chatlist response:", res)
                console.log("Send userId:", userInfo.id);
                setChats(res.data);
            }catch (err){
                console.error(err);
            }
        };
        fetchChats();
    },[userInfo, connection]);
    useEffect(() => {
        setHeadText(userInfo.username);
    }, [userInfo]);
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
                    onClick={() => onSelectChat(chat)}
                >   
                    <div className="chatLabel">
                        <h4 className="chatName">{chat.name}</h4>
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