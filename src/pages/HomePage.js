import "./Home.css"
import {io} from "socket.io-client"
import React, {useState} from 'react'
import ReactModal from 'react-modal'
import { useNavigate } from 'react-router-dom'

export default function HomePage({socket}) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
        <ReactModal 
        isOpen={isOpen} 
        contentLabel="Example Modal" 
        onRequestClose={()=>setIsOpen(false)} 
        className={"portal"}
        closeTimeoutMS={400}
        style={{overlay: {backgroundColor: "rgba(173,173,173,.5)"}}}>
            <div>
                <div class="ReactModalBody-header">
                    <h2 class="modal-title">Create Room</h2>
                </div>
                <div className="ReactModalBody">
                    <form style={{marginTop:"5%"}} 
                    onSubmit={(event)=>{
                            console.log("TEST")
                            event.preventDefault();
                            socket.emit('', {roomName: document.getElementById("roomName").value})}}>
                        <label style={{fontSize:20, padding:15}} for="roomName">Room Name:</label>
                        <input style={{background: "#40414f", border: "#ffffff"}} type="text" id="roomName" name="roomName"></input>
                    </form>
                    <button style={{margin: 10}} onClick={()=>{
                            //socket.emit('create-room', {roomName: document.getElementById("roomName").value})
                            let data = {roomName: document.getElementById("roomName").value}
                            fetch("http://localhost:3000/createRoom", {
                                method:'post',
                                header:{
                                    "Content-Type":"application/json"
                                },
                                body:JSON.stringify(data)
                            })
                            .then(res => res.json())
                            .then(res => {
                                console.log(res.id)
                                navigate(`/room/${res.id}`)
                            })
                            .catch(err => console.log("error"))
                        }}>Create Room</button>
                </div>
                <div class="ReactModalBody-footer">
                    <button style={{background: '#FE4365', borderRadius: "6px", transform: "translate(-10px,-10px"}} type="button" class="btn btn-danger" data-dismiss="modal"
                    onClick={()=> setIsOpen(false)}>Close</button>
                </div>
            </div>
        </ReactModal>
        <div style={{ backgroundColor: '#333', color: '#fff', height: '50px', position:"relative", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{paddingLeft: 25}}>Test</div>
            <h1 style={{position: "absolute", left: "50%", transform: "translate(-50%)"}}>My Website</h1>
            <nav style={{textAlign: 'right', paddingRight: 25}}>
                <ul style={{ listStyle: 'none', display: 'flex', gap: '20px' }}>
                    <li>About</li>
                    <li>How To</li>
                </ul>
            </nav>
        </div>
        <div className="HomeBody">
            <div className="item1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: "green"}}>
                <button style={{ marginRight: '100px' }} onClick={()=> setIsOpen(true)}>Create Room</button>
                <button>Button 2</button>
            </div>
            <div className="item2">
                
            </div>
        </div>
        <div style={{ backgroundColor: '#333', color: '#fff', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>&copy; 2023 My Website</p>
        </div>
        </>
    );
}