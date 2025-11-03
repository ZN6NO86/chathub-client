import React,  {useEffect, useState} from "react";
import { RiSendPlane2Line, RiArrowGoBackLine } from "react-icons/ri";
import "./Basic.css"
import "./ChatRoom.css"
export default function ChatRoom({client, curChat, onJump}){
    const [msgText, setMsgText] = useState("");
    //const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [header, setHeader] = useState("");
    useEffect(() => {
        console.log("Room name set.");
    }, [header])
    useEffect(() => {
        if(!client || !curChat) return;
        console.log("current client:", client);
        console.log("current chatInfo:", curChat)
        const room = client.getRoom(curChat.roomId);
        console.log("current room:", room);
        setHeader(room.name);
        function onNewMessage(e, r){
            
                if(r.roomId !== room.roomId) return;
                if(e.getType() === "m.room.message"){
                    if(e.getSender === client.getUserId()) return;
                    const newSender = e.getSender();
                    const newMsg = e.getContent();
                    const newTs = e.getTs();
                    const newMessage = {
                        sender: newSender,
                        text: newMsg.body,
                        timeStamp: newTs
                    }
                    setMessages(prevMsg => [...prevMsg, newMessage]);
                }
            
        }
        client.on("room.timeline", onNewMessage);
        return () => client.removeListener("room.timeline", onNewMessage);
    },[client, curChat]);
    return(
        <div className="baseLayout">
            <header className="header">
                <button 
                    className="backBtn"
                    onClick={() => onJump("chatList") }
                >
                    <RiArrowGoBackLine />
                </button>
                <h3>{header}</h3>
            </header>
            <main className="content">
                {
                    messages.map((messages, index) => (
                        <div 
                            className="textContent"
                            key={index}
                        >
                            <h4>{messages.sender}{messages.createAt}:</h4>
                            <div className="bubble">{messages.text}</div>
                        </div>
                    ))
                }
            </main>
            <footer className="inputArea">
                <textarea 
                    className="textBox"
                    type="text"
                    value={msgText}
                    onChange = { (e) => (setMsgText(e.target.value))}
                >
                </textarea>
                <button 
                    className="sendBtn"
                    onClick={() => {
                        client.sendTextMessage(curChat.roomId, msgText);
                        setMessages((prev) => [
                            ...prev,
                            {
                                sender: client.getUserId(),
                                text: msgText,
                                timeStamp: Date.now()
                            }
                        ]);
                    }}
                >
                    <RiSendPlane2Line />
                </button>
            </footer>
        </div>
    );
}