import "./Home.css"
import '../App.css'
import "./Game.css"
import {io} from "socket.io-client"
import React, {useState} from 'react'
import ReactModal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import moment from "moment"

import spash from '../homepage-spash.svg'

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
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenJoin, setIsOpenJoin] = useState(false);
    const navigate = useNavigate();

    return (
        <>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%"}}>
        <ReactModal 
        isOpen={isOpenCreate} 
        contentLabel="Example Modal" 
        onRequestClose={()=>setIsOpenCreate(false)} 
        className={"portal"}
        closeTimeoutMS={400}
        style={{display: "block", overlay: {backgroundColor: "rgba(173,173,173,.5)"}}}>
            <div>
                <div className="ReactModalBody-header">
                    <h2 className="modal-title">Create Room</h2>
                </div>
                <div className="ReactModalBody">
                    <form style={{marginTop:"5%"}} 
                    onSubmit={(event)=>{
                            event.preventDefault();
                        }}>
                        <label style={{fontSize:20, padding:15}} for="uerName">User Name</label>
                        <input style={{background: "#40414f", border: "#ffffff", textAlign: "center"}} type="text" id="userName" name="roomName"></input>
                    </form>
                    <button style={{margin: 10}} onClick={()=>{
                            localStorage.setItem("userName", document.getElementById("userName").value)
                            axios.post("http://localhost:3000/createRoom", {
                                startTime: moment().unix()
                            })
                            .then((response) => {
                                navigate(`/room/${response.data.id}`)
                            })
                            .catch((err)  => console.error(err));
                        }}>Create Room</button>
                </div>
                <div className="ReactModalBody-footer">
                    <button style={{background: '#FE4365', borderRadius: "6px", transform: "translate(-10px,-10px"}} type="button" class="btn btn-danger" data-dismiss="modal"
                    onClick={()=> setIsOpenCreate(false)}>Close</button>
                </div>
            </div>
        </ReactModal>
        <ReactModal 
        isOpen={isOpenJoin} 
        contentLabel="Example Modal" 
        onRequestClose={()=>setIsOpenJoin(false)} 
        className={"portal"}
        closeTimeoutMS={400}
        style={{overlay: {backgroundColor: "rgba(173,173,173,.5)"}}}>
            <div>
                <div claclassNamess="ReactModalBody-header">
                    <h2 className="modal-title">Join Room</h2>
                </div>
                <div className="ReactModalBody">
                    <form style={{marginTop:"5%"}} 
                    onSubmit={(event)=>{
                            event.preventDefault();
                        }}>
                        <div>
                            <label style={{fontSize:20, padding:15}} for="userName">User Name</label>
                            <input style={{background: "#40414f", border: "#ffffff", textAlign: "center"}} type="text" id="userName" name="userName"></input>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <label style={{fontSize:20}} for="roomId">Room Code</label>
                            <input style={{background: "#40414f", border: "#ffffff", textAlign: "center", width: "25%"}} type="text" id="roomId" name="roomId"></input>
                        </div>
                    </form>
                    <button style={{margin: 10}} onClick={()=>{
                            let roomId = document.getElementById("roomId").value
                            let userName = document.getElementById("userName").value
                            if (roomId === '' || userName === '')
                                return
                            localStorage.setItem("userName", userName)
                            axios.get("http://localhost:3000/roomExists/" + roomId)
                            .then(response => {
                                if (response.data)
                                    navigate(`/room/${roomId}`)
                                else
                                    console.log("No Room Found")
                            })
                            .catch(error => console.error(error));
                        }}>Join Room</button>
                </div>
                <div className="ReactModalBody-footer">
                    <button style={{background: '#FE4365', borderRadius: "6px", transform: "translate(-10px,-10px"}} type="button" class="btn btn-danger" data-dismiss="modal"
                    onClick={()=> setIsOpenJoin(false)}>Close</button>
                </div>
            </div>
        </ReactModal>
        </div>
        <div style={{ backgroundColor: '#333', color: '#fff', height: '50px', position:"relative", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{paddingLeft: 25}}>Test</div>
            <h1 style={{position: "absolute", left: "50%", transform: "translate(-50%)"}}>Online Sudoku</h1>
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
                            <button style={{ marginRight: '10%' }} onClick={()=> setIsOpenCreate(true)}>Create Room</button>
                            <button onClick={()=> setIsOpenJoin(true)}>Join Room</button>
                        </div>  
                    </div>
                </div>
                <div className="item2">
                    <div className="container">
                        <div className="box">
                            <img src={spash} width={1000}></img>
                        </div>
                        <div className="box overlay">
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
        </div>
        <div className="footer" style={{ backgroundColor: '#333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <p>&copy; 2023 My Website</p>
        </div>
        </>
    );
}