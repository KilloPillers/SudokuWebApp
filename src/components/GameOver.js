import React, { useState, useEffect } from 'react'
import axios from 'axios'
import "./GameOver.css"

const GameOver = ({roomId}) => {
    const [users, setUsers] = useState({})

    useEffect(()=>{
        async function fetchScore() {
            await axios.get(`http://localhost:3000/userData/${roomId}`)
            .then(response => {
                const updatedUsers = {}
                const usrs = response.data
                const sortedEntries = Object.entries(usrs).sort((a,b) => (b[1].correcCount-b[1].incorrectCount) - (a[1].correcCount-a[1].incorrectCount))
                sortedEntries.forEach((entry) => {
                    updatedUsers[entry[0]] = entry[1]
                })
                setUsers(updatedUsers)
            })
            .catch(error => console.error(error)); 
        }
        fetchScore();
    }, []);


    if (Object.keys(users).length === 0) {
        return <div>Loading...</div>
    }

    return (
        <div className='gameover__container'>
            {Object.keys(users).map((user, index) =>
                {
                    return  <div className='user__entry'>
                                <div className='user__place'> {index+1+".)"} </div>
                                <div className='user__name'>{user}</div>
                                <div className='user__correct'>{users[user].correcCount === undefined ? 0 : users[user].correcCount}</div>
                                <div className='user__incorrect'>{users[user].incorrectCount === undefined ? 0 : users[user].incorrectCount}</div>
                            </div>
                })
            }
        </div>
    )
}

export default GameOver