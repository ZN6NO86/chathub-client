import React, {useCallback, useEffect, useState } from "react";
import {Link, BrowserRouter, Routes, Route} from "react-router-dom"
import "./Basic.css"
import "./AddContact.css"
import {  RiArrowGoBackLine, RiSearchLine, RiCheckLine } from "react-icons/ri";
import { MdCheckBox } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
function JoinGroups({client}){
    const [inputText, setInputText] = useState("");
    //const [roomName, setContactName] = useState("");
    const [roomList, setRoomList] = useState([]);
    const [matchingRooms, setMatchingRooms] = useState([]);
    useEffect(() => {
        client.publicRooms("http://localhost:8008")
            .then((res) => {
                console.log("public roomlist: ", res.chunk);
                setRoomList(res.chunk);
            });
    }, [client]);
    function searchRoomsById(roomId){
        const rl = roomList.filter(room => (
                        room.room_id.includes(roomId)
                        || room.room_id === roomId
                        || roomId.includes(room.room_id)
        )).sort((a, b) => {
            const posA = a.indexOf(roomId);
            const posB = b.indexOf(roomId);
            return posA - posB;
        });
        console.log("matching rooms:", rl);
        setMatchingRooms(rl);
    }
    function searchRoomsByAlias(alias){
        
        const rl = roomList.filter(room => (
                        room.getCanonicalAlias().includes(alias)
                        || room.getCanonicalAlias === alias
                        || alias.includes(room.getCanonicalAlias)
        )).sort((a, b) => {
            const posA = a.indexOf(alias);
            const posB = b.indexOf(alias);
            return posA - posB;
        });
        setMatchingRooms(rl);
    }
    return(
        <div>
            <div className="seachBar">
                <input 
                    className="searchRoom"
                    type="text"
                    placeholder="Please enter the contact's ID"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                >
                </input> 
                
                <button
                    className="searchBtn"
                    onClick={() => searchRoomsById(inputText)}
                >
                    <RiSearchLine />
                </button>
            </div>
            <main className="content">
                {
                    matchingRooms.map((room) => (
                        <div key={room.room_id} className="roomLabel">
                            <div>
                                <h4>{room.name}</h4>
                                <p>{room.room_id}</p>
                            </div>
                        </div> 
                    ))
                }
            </main>
        </div>
    );
}
function AddFriends({client}){
    
}
function CreateGroup({client}){
    const [alias, setAlias] = useState("");
    const [name, setName] = useState("");
    const [topic, setTopic] = useState("");
    const [preset, setPreset] = useState("private_chat");
    const [visibility, setVisibility] = useState("private");

    const canSubmit = isRequiredFilled(alias, name, visibility);
    const [isValid, setIsValid] = useState({
        alias: "valid"
    });
    const visibilityOptions = [
        { label: "Public", value: "public"},
        { label: "Private", value: "private"}
    ];
    const isAliasValid = useCallback(async (alias) =>{
        try{
            const res = await client.getRoomIdForAlias(alias);
            console.log(res);
            setIsValid((prev) => ({...prev, alias: "Alias exists"}));
        }catch(err){
            console.error(err);
        }    
    }, [client]);
    function isRequiredFilled(alias, name, visibility){
        //console.log("required:", alias, name, visibility);
        return (alias && name && visibility) ? true : false;
    }
    async function sentCreateRequest(alias, name, visibility, preset, topic){
        if (alias && name && visibility){
            console.log("alias:", alias);
            try{
                const res = await client.createRoom({
                    preset: preset,
                    name: name,
                    room_alias_name: alias,
                    topic: topic,
                    visibility: visibility
                });
                console.log("new room:", res);
                /*await new Promise(resolve => {
                    const handler = (room) => {
                        if(room.roomId === res.room_id){
                            console.log("Room registered in SDK:", room.roomId);
                            client.off("Room", handler);
                            resolve();
                        }  
                    };
                    client.on("Room", handler);
                });*/
            }catch(err){
                console.error(err);
            }
        }
        
    }
    useEffect(() => {
        if(!alias) return;
        const timer = setTimeout(() => {
            const res = isAliasValid(alias);
            //client.getRooms().map((room) => {console.log(room.getAliases())});
            console.log("Existing Rooms:", res);
        }, 400);
        return () => clearTimeout(timer);
    }, [alias, isAliasValid])
    return(
        <div className>
            <div className="field">
                <h5>Prefer group ID</h5>
                <input 
                    className="textBar"
                    type="text"
                    placeholder="Required"
                    value={alias}
                    onChange={e => (setAlias(e.target.value))}
                />
                {(isValid[alias] !== "valid") && <p className="errMsg">{isValid[alias]}</p>}
            </div>
            <div className="field">
                <h5>Group name</h5>
                <input
                    className="textBar"
                    type="text"
                    placeholder="Required"
                    value={name}
                    onChange={e => (setName(e.target.value))}
                />
            </div>
            <div className="field">
                <h5>Topic</h5>
                <textarea
                    className="textBox"
                    type="text"
                    placeholder="Optional"
                    value={topic}
                    onChange={e => (setTopic(e.target.value))}
                />
            </div>
            <div className="field">
                <h5>Is your group public or private?</h5>
                <div className="selectContainer">
                    {
                        visibilityOptions.map((opt) => (
                            <div
                                key={opt.value}
                                className={`option ${visibility === opt.value ? "selected" : ""}`}
                                onClick={() => {setVisibility(opt.value);
                                                setPreset(opt.value + "_chat");
                                                console.log("preset", preset);
                                            }}
                            >
                                <span>{opt.label}</span>
                                {visibility == opt.value && <RiCheckLine className="checkIcon"/>}
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="field">
                <button
                    className="createBtn"
                    disabled={!canSubmit}
                    onClick={ canSubmit ? () => sentCreateRequest(alias, name, visibility, preset, topic) : undefined}
                >
                    {canSubmit ? "Create" : "Complete all reqired fields to continue"}
                </button>
            </div>
        </div>
        
    );
}
export default function AddContact({client, onBack}){
    
    
    return(
        <div className="page">
            <header className="header">
                <button 
                    className="backBtn"
                    onClick={() => onBack("chatList")}
                >   
                    <RiArrowGoBackLine />
                </button>
            </header>
            <main className="main">
                <Routes>
                    <Route path="/" element={<JoinGroups client={client}/>}/>
                    <Route path="/joinGroups" element={<JoinGroups client={client}/>}/>
                    <Route path="/createGroup" element={<CreateGroup client={client}/>}/>
                    <Route path="addFriends" element={<AddFriends client={client}/>}/>
                </Routes>
            </main>
            <footer className="footer">
                <nav>
                    <Link to="/joinGroups" >Join Groups</Link>
                    <Link to="/addFriends">Add Friends</Link>
                    <Link to="/createGroup">Create Group</Link>
                </nav>
            </footer>
            

        </div>
    );
}