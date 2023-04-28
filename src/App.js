import { HashRouter, Routes , Route } from "react-router-dom"
import React from 'react'
import {io} from 'socket.io-client'
import HomePage from './pages/HomePage'
import Game from './pages/GamePage'
import NoPage from './pages/NoPage'

const socket = io(process.env.REACT_APP_NODE_SERVER, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

export default function App() {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route index element={<HomePage socket={socket}/>}/>
          <Route path="/home" element={<HomePage socket={socket}/>} />
          <Route path="/room/*" element={<Game socket={socket}/>}/>
          <Route path="*" element={<NoPage socket={socket}/>}/>
        </Routes>
      </HashRouter>
    </div>
  )
}