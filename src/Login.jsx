import React, {useState } from "react";
import * as sdk from "matrix-js-sdk";
import './Login.css';
import "./Basic.css"
export default function Login({onSuccess, onSignup}) {
  //const client = getMatrixClient();
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  //const [userInfo, setUserInfo] = useState(null);
  async function handleLogin() {
    try{
            const tmpClient = sdk.createClient({baseUrl: "http://localhost:8008"});
			const res = await tmpClient.loginRequest({
                type: "m.login.password", 
                identifier: {
                    type: "m.id.user",
                    user: userID
                }, 
                password: password
            });
			console.log("Login result:", res);
            tmpClient.stopClient();
            //console.log(client.credentials);
			onSuccess(res);
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
      <button className=" loginBtn" onClick={async () => await handleLogin()}>
        Login
      </button>
      <button className="signupBtn" onClick={() => onSignup()}>
        New here? Sign up now!
      </button>
    </div>
  );
}