import {io} from "socket.io-client"
import React, {useState} from 'react'
import ReactModal from 'react-modal'

export default function HomePage({socket}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        <ReactModal 
        isOpen={isOpen} 
        contentLabel="Example Modal" 
        onRequestClose={()=>setIsOpen(false)} 
        className={"portal"}
        closeTimeoutMS={400}>
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
                            socket.emit('create-room', {roomName: document.getElementById("roomName").value})
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <button style={{ marginRight: '100px' }} onClick={()=> setIsOpen(true)}>Create Room</button>
            <button>Button 2</button>
        </div>
        <div style={{ backgroundColor: '#333', color: '#fff', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>&copy; 2023 My Website</p>
        </div>
        </>
    );
}