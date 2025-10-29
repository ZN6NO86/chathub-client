import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddContact({onBack}){
    const [inputValue, setInputValue] = useState("");
    const [contactID, setContactID] = useState("");
    const [contactList, setContactList] = useState([]);
    useEffect(() => {
        const fetchContacts = async() => {
            try{
                const res = await axios.post("http://localhost:5111/api/chat/fetchContacts", {contactID});
            }catch(err){
                console.error(err);
            }
        };
    },[contactID]);
    return(
        <div>
            <div>
                <button 
                    className="backBtn"
                    onClick={() => {onBack("chatList")}}
                >   
                Back
                </button>
            </div>
            <input 
                className="searchContact"
                type="text"
                placeholder="Please enter the contact's ID"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            >
            </input> 
            <button
                className="searchBtn"
                onClick={() => setContactID(inputValue)}
            >

           </button>

        </div>
    );
}