import "./Home.css"
import '../App.css'
import {io} from "socket.io-client"
import React, {useState} from 'react'
import ReactModal from 'react-modal'
import { useNavigate } from 'react-router-dom'

import sudoku from "../Sudoku_copy.svg"

let sudokuArr = [
    [4, 5, 1, 9, 7, 3, 8, 6, 2],
    [8, 9, 2, 1, 4, 6, 3, 5, 7],
    [7, 6, 3, 2, 8, 5, 1, 9, 4],
    [5, 3, 8, 6, 2, 7, 9, 4, 1],
    [6, 2, 4, 3, 9, 1, 7, 8, 5],
    [1, 7, 9, 8, 5, 4, 6, 2, 3],
    [9, 8, 7, 4, 1, 2, 5, 3, 6],
    [3, 4, 5, 7, 6, 8, 2, 1, 9],
    [2, 1, 6, 5, 3, 9, 4, 7, 8]
  ]

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
        <div>
            <div className="HomeBody">
                <div className="item1">
                    <div>
                        <div className="item1-header">Welcome To Sudoku Online</div>
                        <div style={{color:"aliceblue", padding: 10}}>To begin playing with friends please either join or create a room</div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <button style={{ marginRight: '10%' }} onClick={()=> setIsOpen(true)}>Create Room</button>
                            <button>Join Room</button>
                        </div>  
                    </div>
                </div>
                <div className="item2">
                    <div>
                        <table className='grid-table'>
                            <tbody>
                                {
                                [0,1,2,3,4,5,6,7,8].map((row, rIndex) => {
                                    return <tr key={rIndex} className={(row + 1) % 3 === 0 && row !== 8 ? 'bBorder':'grid-cell'}>
                                    {[0,1,2,3,4,5,6,7,8].map((col, cIndex) => {
                                        return <td key={rIndex+cIndex} className={(col + 1) % 3 === 0 && col !== 8 ? 'rBorder':'grid-cell'}>
                                        <button 
                                        id={9*row+col}
                                        value={sudokuArr[row][col] === 0 ? '' : sudokuArr[row][col]} 
                                        className={'cell-complete'}
                                        >{sudokuArr[row][col]}
                                        </button>
                                        </td>
                                        })}
                                    </tr>
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div style={{ backgroundColor: '#333', color: '#fff', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>&copy; 2023 My Website</p>
        </div>
        </>
    );
}