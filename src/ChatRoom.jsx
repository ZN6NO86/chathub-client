import React,  {useEffect, useInsertionEffect, useRef, useState} from "react";
import { RiImageLine, RiSendPlane2Line, RiArrowGoBackLine } from "react-icons/ri";
import "./Basic.css"
import "./ChatRoom.css"
import {compressImage} from "./imageProcess.js"
export default function ChatRoom({client, curChat, onJump}){
    const [msgText, setMsgText] = useState("");
    //const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [header, setHeader] = useState("");
    const [sendMode, setSendMode] = useState("text");
    const [mediaList, setMediaList] = useState([]);
    const fileInputRef = useRef(null);
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
    useEffect(() => {
        console.log("File has been chosen.", mediaList);
    }, [mediaList]);
    function openPicker(){
        fileInputRef.current.click();
    }
    async function handleSelect(e){
        const file = e.target.files[0];
        const compressedBlob = await compressImage(file);
        const previewUrl = URL.createObjectURL(compressedBlob);
        const previewFile = new File([compressedBlob], file.name, {type: file.type} );
        const newMediaList = [...mediaList, {
            file: previewFile, 
            url: previewUrl, 
            type: file.type.startsWith("image/") ? "image" : "video"
        }];
        setMediaList(newMediaList);
    }
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
            {
                (mediaList) && 
                <div className="previewContainer">
                    {
                        mediaList.map((file, index) => (
                            file.type === "image" ? 
                            <img src={file.url} className="previewImg" key={index}/> : 
                            <video src={file.url} className="previewVideo"/>
                        ))
                    }   
                </div>
            }
            <footer className="inputArea">
                <button 
                    className="imageBtn"
                    onClick={openPicker}    
                >
                    <RiImageLine />   
                </button>
                <input 
                    type="file" 
                    accept="image/*" 
                    capture="album"
                    ref={fileInputRef}
                    onChange={handleSelect}
                    style={{display: "none"}}
                />
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