import React, {useState } from "react";
import './Login.css';
import "./Basic.css"
import axios from "axios";
export default function Login({onSuccess, onSignup}) {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  //const [userInfo, setUserInfo] = useState(null);
  
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5111/api/auth/login", {
        UserId: userID,
        Password: password
      });
      console.log(res.data.user);
      onSuccess(res.data.user);
    } catch (err) {
      console.error(err);
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