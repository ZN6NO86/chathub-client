import {useEffect, useState} from "react";
//import './App.css';
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import RegiComplete from "./RegiComplete.jsx";
import ChatList from "./ChatList.jsx";
import ChatRoom from "./ChatRoom.jsx"
import AddContact from "./AddContact.jsx";
import * as sdk from "matrix-js-sdk";
//import { send } from "vite";
//import axios from "axios";
function App() {
	
	const [page, setPage] = useState("login");
	const [userId, setUserId] = useState(null);
	const [curChat, setCurChat] = useState(null);
	const [client, setClient] = useState(null);
	//const [ifSignupOK, setIfSignupOK] = useState(false);
	//console.log(page);
	function onChangePage(nextPage){
		setPage(nextPage);
	}
	/*useEffect(() =>{
		const matrixClient = sdk.createClient({baseUrl: "http://198.13.50.125:8008"});
		setClient(matrixClient);
	},[]);*/
	useEffect(() => {
		if(!userId || !client) return;
		if(client.isStarted) return;

		console.log("🚀 Starting Matrix client for:", client);
		console.log("client token:", client.getAccessToken());
		console.log("is logged in", client.isLoggedIn());
		/*const oldRequest = client.http.requestOtherUrl.bind(client.http);
		client.http.requestOtherUrl = async (...args) => {
		const [method, url] = args;
		console.log("🛰️", method, url, "token:", client.http.opts.accessToken);
		return oldRequest(...args);
		};*/
		//console.log("client._http.opts:", client._http);
		//console.log("Access token before start:", client._http.opts.accessToken);
		setTimeout(() => {
			client.startClient({ initialSyncLimit: 10 });
				client.once("sync", (state) => {
					if (state === "PREPARED") {
						console.log("✅ Client ready:", client);
						setPage("chatList");
						client.isStarted = true;
					}
				});
			}, 300);
		return () => {
			client.stopClient?.();
			client.removeAllListeners?.();
		};
  
	},[userId, client]);

  	
		
			switch(page){
				case "login":
					
					return(
						<div> 
							<Login 
								//client={client}
								onSuccess = {async (res) => {
									const store = new sdk.IndexedDBStore({
										indexedDB: window.indexedDB,
										dbName: `matrix-${userId}`
									});
									
									console.log("token", res.access_token);
									const authedClient = sdk.createClient({
										baseUrl: "http://198.13.50.125:8008",
										accessToken: res.access_token,
										userId: res.user_id,
										deviceId: res.device_id,
										store: store
									});
									authedClient.credentials.accessToken = res.access_token;
									authedClient.http.opts.accessToken = authedClient.getAccessToken();
									await store.startup();
									authedClient.setAccessToken(res.access_token);

									
									setUserId(res.user_id);
									setClient(authedClient);
									
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
								client={client}
								onSelectChat={(curChat) => {
									setCurChat(curChat); 
									setPage("chatRoom"); 
								}}
								onSelectBtn={(page) => {setPage(page)}}
							/>
						</div>
					);
				case "chatRoom":
					return(
						<div>
							<ChatRoom
								client={client}
									
									//TODO: Now the process of displaying myself's messages
									//		is uploading this message to SERVER first then receiving
									//		this message sent back from SERVER with time stamp and appending
									//		this to message list.
									//TODO: In future it will be modified as appending message immediatelly
									//		after send button triggered. And the server won't send it back.
								
								curChat={curChat}
								onJump={onChangePage}
							/>
						</div>
					);
				case "addContact":
					return(
						<div>
							<AddContact
								client={client}
								onBack={onChangePage}
							/>
						</div>
					);
				default:
					return null;
			}
		
		
}

export default App;
