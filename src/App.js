import { HashRouter as Routes , Route } from "react-router-dom"
import React from 'react'
import {io} from 'socket.io-client'
import HomePage from './pages/HomePage'
import Game from './pages/GamePage'
import NoPage from './pages/NoPage'


const socket = io("http://localhost:3000", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage socket={socket}/>}/>
          <Route path="/home" element={<HomePage socket={socket}/>} />
          <Route path="/room/*" element={<Game socket={socket}/>}/>
          <Route path="*" element={<NoPage socket={socket}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}