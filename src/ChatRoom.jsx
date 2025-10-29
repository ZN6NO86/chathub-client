import React,  {useEffect, useState} from "react";
import { RiSendPlane2Line, RiArrowGoBackLine } from "react-icons/ri";
import "./Basic.css"
import "./ChatRoom.css"
export default function ChatRoom({onSend, chatInfo, messages, onJump}){
    const [msgText, setMsgText] = useState("");
    useEffect(() => {
        console.log(messages);
    },[messages]);
    return(
        <div className="baseLayout">
            <header className="header">
                <button 
                    className="backBtn"
                    onClick={() => onJump("chatList") }
                >
                    <RiArrowGoBackLine />
                </button>
                <h3>{chatInfo.name}</h3>
            </header>
            <main className="content">
                {
                    messages.map((messages, index) => (
                        <div 
                            className="textContent"
                            key={index}
                        >
                            <h4>{messages.sender}{messages.createAt}:</h4>
                            <p>{messages.text}</p>
                        </div>
                    ))
                }
            </main>
            <footer className="inputArea">
                <input 
                    className="textBox"
                    type="text"
                    value={msgText}
                    onChange = { (e) => (setMsgText(e.target.value))}
                >
                </input>
                <button 
                    className="sendBtn"
                    onClick={() => onSend(msgText)}
                >
                    <RiSendPlane2Line />
                </button>
            </footer>
        </div>
    );
}