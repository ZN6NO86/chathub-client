import React, {useState } from "react";
import './Login.css';
import "./Basic.css"
export default function Login({client, onSuccess, onSignup}) {
  //const client = getMatrixClient();
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  //const [userInfo, setUserInfo] = useState(null);
  async function handleLogin() {
    try{
			const res = await client.loginWithPassword(userID, password);
			console.log("Login result:", res);
            console.log(client.credentials);
			onSuccess(res.user_id);
		}catch(err){
			console.log("Login failed", err);
		}
  };
  return (
    <div className="loginModule">
      <h2>Login</h2>
      <input
        className="useridLine"
        type="text"
        placeholder="User ID"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
      />
      <input
        className="passwdLine"
        type="text"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className=" loginBtn" onClick={() => handleLogin()}>
        Login
      </button>
      <button className="signupBtn" onClick={() => onSignup()}>
        New here? Sign up now!
      </button>
    </div>
  );
}