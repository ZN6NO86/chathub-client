import React, {useState } from "react";
import './Signup.css'
import "./Basic.css"
import axios from "axios";
export default function Signup({onSuccess, onBack}){
    //console.log("Signup props:",  props);
    const [userID, setUserID] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPasswd, setRepeatPasswd] = useState("");
    const handleSignup = async ()=>{
        try{
            const res = await axios.post("http://localhost:5111/api/auth/signup", {
                UserId: userID,
                UserName: nickname,
                Password: password
            });
            console.log(res.data);
            onSuccess();
        }catch(err){
            console.error(err);
        }
    };
    return(
        <div className="signupModule">
            <button className="backBtn"
                onClick={() => {console.log("Back clicked"); onBack();}}
            >   
                Back
            </button>
           <h2>Sign Up</h2>
           <input
                className="useridLine"
                type="text"
                placeholder="User ID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
            />
            <input
                className="nicknameLine"
                type="text"
                placeholder="Your Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />
            <input
                className="passwdLine"
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
             <input
                className="repeatPasswdLine"
                type="text"
                placeholder="Please enter your password again."
                value={repeatPasswd}
                onChange={(e) => setRepeatPasswd(e.target.value)}
            />
            <button
                className="signUpBtn"
                onClick={() => handleSignup()}
            >
                Sign up
            </button>
        </div>
    );
}