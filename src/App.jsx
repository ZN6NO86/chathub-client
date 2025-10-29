import {useEffect, useState} from "react";
//import './App.css';
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import RegiComplete from "./RegiComplete.jsx";
import ChatList from "./ChatList.jsx";
import ChatRoom from "./ChatRoom.jsx"
import * as signalR from "@microsoft/signalr";
import AddContact from "./AddContact.jsx";
//import { send } from "vite";
//import axios from "axios";
function App() {
	const [page, setPage] = useState("login");
	const [userInfo, setUserInfo] = useState(null);
	const [curChat, setCurChat] = useState(null);
	const [connection, setConnection] = useState(null);
	const [messages, setMessages] = useState({});
	//const [ifSignupOK, setIfSignupOK] = useState(false);
	//console.log(page);
	function onChangePage(nextPage){
		setPage(nextPage);
	}
	useEffect(() => {
		const newConnection = new signalR.HubConnectionBuilder()
      		.withUrl("http://127.0.0.1:5111/ChatHub")
      		.withAutomaticReconnect()
      		.build();
    	setConnection(newConnection);
		
  }, []);

  	useEffect(() => {
    if (connection && userInfo) {
      connection
        .start()
        .then(() => {
          	console.log("Conneted");
			connection.invoke("JoinAllGroups", (userInfo.id));
          	connection.on("ReceiveMessage", (chatID, sender, text) => {
				setMessages(prev => ({
					...prev,
					[chatID]: [...(prev[chatID] || []), {sender, text}]
				}));
		  	});

        })
        .catch((err) => console.error("connection failed", err));
		return () => {
			connection.off("ReceiveMessage");
		};
    }
	
  }, [connection, userInfo]);

	switch(page){
		case "login":
			
			return(
				<div> 
					<Login 
						onSuccess = {(userInfo) => {
							setUserInfo(userInfo);
							setPage("chatList");
						}}
						onSignup = {() => setPage("signup")}
					/> 
				</div>

			);
		case "signup":
			return(
				<div> 
					<Signup 
						onSuccess={() => setPage("regiComplete")}
						onBack={() => setPage("login")}
					/>
				</div>
			);
		case "regiComplete":
			return(
				<div>
					<RegiComplete
						onBack={() => setPage("login")}
					/>
				</div>
			);
		case "chatList":
			return(
				<div>
					<ChatList
						onSelectChat={(curChat) => {setCurChat(curChat); setPage("chatRoom");}}
						onSelectBtn={(page) => {setPage(page)}}
						userInfo = {userInfo}
						connection={connection}
					/>
				</div>
			);
		case "chatRoom":
			return(
				<div>
					<ChatRoom
						onSend={(msgText) => {
							connection.invoke("SendMessage", curChat.id, userInfo.id, msgText);
							//TODO: Now the process of displaying myself's messages
							//		is uploading this message to SERVER first then receiving
							//		this message sent back from SERVER with time stamp and appending
							//		this to message list.
							//TODO: In future it will be modified as appending message immediatelly
							//		after send button triggered. And the server won't send it back.
						}}
						chatInfo={curChat}
						messages={messages[curChat.id] ?? []}
						onJump={onChangePage}
					/>
				</div>
			);
		case "addContact":
			return(
				<div>
					<AddContact
						onBack={onChangePage}
					/>
				</div>
			);
		default:
			return null;
	}
}

export default App;
