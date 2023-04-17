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
        className={"portal"}>
            <div>
                <div class="ReactModalBody-header">
                    <h4 class="modal-title">Create Room</h4>
                </div>
                <div className="ReactModalBody">
                    <form>
                        <label style={{fontSize:20, padding:15}} for="roomName">Room Name:</label>
                        <input style={{background: "#40414f", border: "#ffffff"}} type="text" id="roomName" name="roomName"></input>
                    </form>
                    <button style={{transform: "translate(10px,10px)"}}onClick={()=>{
                            socket.emit('room-created', {roomName: document.getElementById("roomName").value})
                        }}>Create Room</button>
                </div>
                <div class="ReactModalBody-footer">
                    <button style={{background: '#FE4365', borderRadius: "6px", transform: "translate(-10px,-10px"}} type="button" class="btn btn-danger" data-dismiss="modal"
                    onClick={()=> setIsOpen(false)}>Close</button>
                </div>
                <div style={{background: "#40414f"}}> </div>
            </div>
        </ReactModal>
        <div style={{ backgroundColor: '#333', color: '#fff', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1>My Website</h1>
            <nav>
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