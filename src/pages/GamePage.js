import '../App.css';
import Counter from '../components/Counter';
import Chatbox from '../components/ChatBox';
import GameOver from '../components/GameOver';
import React, {useState, useRef, useEffect} from 'react';
import ReactModal from 'react-modal';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

let selected = 0

let notesMode = false

//TODO: Refactor all code to use a 1D array instead of 2D array.

let initial = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

let solved_sudoku = [
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

let highlight = []

/*
function getDeepCopy(arr) {
  return JSON.parse(JSON.stringify(arr))
}

function isValid(digit, index){
  for (let y = 0; y < 9; y++) { // Check Column
    if (initial[y][index%9] === digit)
      return false
  }

  let row = parseInt(index/9) //Check Row
  for (let x = 0; x < 9; x++) {
    if (initial[row][x] === digit)
      return false
  }

  //Check 3x3 Subgrid
  for (let y = Math.floor(Math.floor(index/9)/3)*3; y < Math.floor(Math.floor(index/9)/3)*3+3; y++){
    for (let x = Math.floor((index%9)/3)*3; x < Math.floor((index%9)/3)*3+3; x++) {
      if (initial[y][x] === digit)
        return false
    }
  }
  return true
}

function SolveSudoku(index){
  if (index === 81)
    solved_sudoku = getDeepCopy(initial)
  for (let i = index; i < 81; i++) {
    if (initial[parseInt(i/9)][i%9] !== 0)
      continue //Digit is given as part of solution
    for (let digit = 1; digit < 10; digit++) {
      if (isValid(digit, i)) {
        initial[parseInt(i/9)][i%9] = digit
        SolveSudoku(i+1)
        if (solved_sudoku === false)
          initial[parseInt(i/9)][i%9] = 0
        else 
          return
      }
    }
    return //No solution existed
  }
}
*/

function Game({socket}) {
  let [sudokuArr, setSudokuArr] = useState(initial) //refactor code to make this a const
  let unsolvedCount = useRef(0)
  const [isGameOver, setGameOver] = useState(false)
  const [roomId, ] = useState(useLocation().pathname.split("/")[2]);
  const [startTime, setStartTime] = useState()
  const [userName, setUserName] = useState(localStorage.getItem("userName"))

  const navigate = useNavigate();

  useEffect(() => {
    async function getSudoku() {
      await axios.get('http://localhost:3000/joinRoom/' + roomId)
      .then(response => {
        const arr = response.data.unsolvedPuzzle
        const copy = response.data.unsolvedPuzzle.slice() //this copy exist only to use splice later (a mutable function)
        const newArr = [];
        while (copy.length)
          newArr.push(copy.splice(0,9));
        const solvedPuzzle = response.data.solvedPuzzle
        let count = 0
        for (let i = 0; i < 81; i++) {
          if (arr[i] === 0) 
            count++
          initial[Math.floor(i/9)][i%9] = arr[i];
          solved_sudoku[Math.floor(i/9)][i%9] = solvedPuzzle[i];
          let cell = document.getElementById(i)
          cell.classList.toggle('iswrong', !(solvedPuzzle[i] === arr[i] || arr[i] === 0))
        }
        unsolvedCount = count
        console.log(`There are ${unsolvedCount} unsolved tiles left`)
        setStartTime(response.data.time)
        setSudokuArr(newArr)
      })
      .catch(error => console.error(error));
    }
    getSudoku()
  }, [])

  useEffect(() => {
    if (userName !== null) {}
      socket.emit("join-room", userName, roomId)

    if (socket.listeners("sudoku-update").length === 0)
      socket.on("sudoku-update", (selected, value) => {  
        const updatedSudokuArr = sudokuArr.map((row, i) =>
          i === Math.floor(selected/9) ? [...row.slice(0, selected%9), value, ...row.slice((selected%9)+1)] : row //where 1 and 2 are row and column respectively
        );
        setSudokuArr(updatedSudokuArr);
  
        initial[Math.floor(selected/9)][selected%9] = value;
        let cell = document.getElementById(selected)
        if (solved_sudoku[Math.floor(selected/9)][selected%9] === value || value === 0) {
          if (solved_sudoku[Math.floor(selected/9)][selected%9] === value)
          console.log(`There are ${--unsolvedCount} unsolved tiles left`)
          cell.classList.toggle('iswrong', false)
        }
        else
          cell.classList.toggle('iswrong', true)
      });
  

    if (socket.listeners("NoRoomFound").length === 0) 
      socket.on("NoRoomFound", ()=> {
        navigate("/home")
      })
    

    let hasKeydownListener = false;

    // Define your keydown event listener function
    const keydownListener = (e) => {
      if (parseInt(e.key)) {
        onNumberButtonClick(parseInt(e.key))
      }
    };

    // Add the event listener to the document if it hasn't been added yet
    if (!hasKeydownListener) {
      document.addEventListener('keydown', keydownListener, false);
      hasKeydownListener = true;
    }

    // Remove the event listener when the page is unloaded
    window.addEventListener('unload', () => {
      socket.emit("leave-room", userName, roomId)
      document.removeEventListener('keydown', keydownListener, false);
      hasKeydownListener = false;
    });

    window.addEventListener("beforeunload", () => {
      socket.emit("leave-room", userName, roomId)
    })

    return () => {
      handleLeaveRoom()
      document.removeEventListener('keydown', keydownListener, false);
      hasKeydownListener = false;
    };
    
  }, [socket])

  function onNumberButtonClick(val) {
    if (solved_sudoku[Math.floor(selected/9)][selected%9] === sudokuArr[Math.floor(selected/9)][selected%9])
      return
    if (notesMode) {
      let item = document.getElementById(selected+'-'+val)
      item.textContent = (item.textContent === '' ? val:'')
    }
    else {
      if (solved_sudoku[Math.floor(selected/9)][selected%9] !== val) {
        initial[Math.floor(selected/9)][selected%9] = sudokuArr[Math.floor(selected/9)][selected%9] === val ? 0 : val
        let cell = document.getElementById(selected)
        cell.classList.toggle('iswrong', initial[Math.floor(selected/9)][selected%9] === val)
        cell.classList.toggle('ishighlighted', false)
        cell.classList.toggle('isdigithighlighted', false)
      }
      else {
        sudokuArr[Math.floor(selected/9)][selected%9] = sudokuArr[Math.floor(selected/9)][selected%9] === val ? 0 : val
        highlight.forEach(element => {
          let item = document.getElementById(element+'-'+val)
          if (item !== null)
            item.textContent = ''
        })
        if (unsolvedCount === 0) {
          setGameOver(true)
        }
        let cell = document.getElementById(selected)
        cell.classList.toggle('iswrong', false)
        cell.classList.toggle('ishighlighted', false)
        cell.classList.toggle('isdigithighlighted', true)
      }
      socket.emit("sudoku-change", userName, roomId, selected, sudokuArr[Math.floor(selected/9)][selected%9])
    }

    highlight.forEach(element => {
      document.getElementById(element).classList.toggle('ishighlighted', true)
    })

    highlightCells(sudokuArr[Math.floor(selected/9)][selected%9])
  }

  function highlightCells(value) {
    //highlights cells with the same value
    for (let i = 0; i < 81; i++) {
      let cell = document.getElementById(i)
      if (parseInt(cell.textContent) === value) {
        cell.classList.toggle('ishighlighted', false)
        cell.classList.toggle('isdigithighlighted', true)
      }
      else {
        cell.classList.toggle('isdigithighlighted', false)
      }
    }
  }

  function getSurroundingCells(row, col) {
    let row_array = [...Array(9).keys()].map(x => col+x*9);
    let col_array = [...Array(9).keys()].map(y => y+row*9);
    let square_array = []
    for (let y = parseInt(row/3)*3; y < parseInt(row/3)*3+3; y++){
      for (let x = parseInt(col/3)*3; x < parseInt(col/3)*3+3; x++) {
          square_array.push(9*y+x)
      }
    }
    let temp = []
    temp = temp.concat(row_array, col_array, square_array)
    return [...new Set(temp)] //remove duplicates from list
  }

  function onGridButtonClick(row, col) {
    //Revert previously highlighted elements
    document.getElementById(selected).classList.toggle('isselected', false)
    
    highlight.forEach(element => {
      document.getElementById(element).classList.toggle('ishighlighted', false)
    })
    selected = (9*row+col)
    let uniqueCells = getSurroundingCells(row, col)
    highlight = uniqueCells
    uniqueCells.forEach(element => { //Toggle elements highlighted on grid
      document.getElementById(element).classList.toggle('ishighlighted', true)
    })

    document.getElementById(9*row+col).classList.toggle('ishighlighted', false)
    document.getElementById(9*row+col).classList.toggle('isselected', true)

    //highlights cells with the same value as the selected cell
    highlightCells(sudokuArr[row][col])
  }

  const handleLeaveRoom = () => {
    socket.emit("leave-room", userName, roomId)
    socket.off("sudoku-update")
    socket.off("NoRoomFound")
    navigate('/home')
  }

  return (
    <>
    <ReactModal 
      isOpen={isGameOver} 
      contentLabel="Example Modal" 
      className={"portal"}
      closeTimeoutMS={400}
      style={{display: "block", overlay: {backgroundColor: "rgba(173,173,173,.5)"}}}>
      <div>
          <div className="ReactModalBody-header">
              <h2 class="modal-title" style={{padding: "10px"}}>Game Finished</h2>
          </div>
          <div className="ReactModalBody">
            <GameOver roomId={roomId}></GameOver>
          </div>
          <div className="ReactModalBody-footer" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: '20px'}}>
            <button onClick={handleLeaveRoom}>Leave Room</button>
            <button>Play Again</button>
          </div>
      </div>
    </ReactModal>
    <ReactModal 
      isOpen={userName === null} 
      contentLabel="Example Modal"
      className={"portal"}
      closeTimeoutMS={400}
      style={{display: "block", overlay: {backgroundColor: "rgba(173,173,173,.5)"}}}>
          <div>
              <div className="ReactModalBody-header">
                  <h2 class="modal-title">Joining Room</h2>
              </div>
              <div className="ReactModalBody">
                  <form style={{marginTop:"5%"}} 
                    onSubmit={(event)=>{
                      event.preventDefault();
                      let username = document.getElementById("userName").value
                      localStorage.setItem("userName", username)
                      setUserName(username)
                      socket.emit("join-room", username, roomId)
                    }}>
                    <label style={{fontSize:20, padding:15}} for="uerName">User Name</label>
                    <input style={{background: "#40414f", border: "#ffffff", textAlign: "center"}} type="text" id="userName" name="roomName"></input>
                  </form>
                  <button style={{margin: 10}} 
                  onClick={()=>{
                    let username = document.getElementById("userName").value
                    localStorage.setItem("userName", username)
                    setUserName(username)
                    socket.emit("join-room", username, roomId)
                  }}>Enter
                  </button>
              </div>
              <div className="ReactModalBody-footer">
                  <span></span>
              </div>
          </div>
      </ReactModal>
    <div className="Game">
      <header className="Game-header"></header>
      <h3>Sudoku v1</h3>
      {startTime !== undefined && <Counter time={startTime} />}
      <div className='Sudoku-frame'>
        <div className='Game-options'>
          <button onClick={() => {
            notesMode = !notesMode
          }}>Enable Notes</button>
          <button onClick={() => {
            setGameOver(true)
          }}>Invite</button>
        </div>
        <div className='Sudoku-container'>
          <table className='grid-table'>
            <tbody>
              {
                [0,1,2,3,4,5,6,7,8].map((row, rIndex) => {
                  return <tr key={rIndex} className={(row + 1) % 3 === 0 && row !== 8 ? 'bBorder':'grid-cell'}>
                    {[0,1,2,3,4,5,6,7,8].map((col, cIndex) => {
                      return <td key={rIndex+cIndex} className={(col + 1) % 3 === 0 && col !== 8 ? 'rBorder':'grid-cell'}>
                        <button 
                        onClick={()=>onGridButtonClick(row,col)} 
                        id={9*row+col}
                        value={sudokuArr[row][col] === 0 ? '' : sudokuArr[row][col]} 
                        className={'cell-complete'}
                        >{sudokuArr[row][col] === 0 ? <div className='cell-note-grid'>{[1,2,3,4,5,6,7,8,9].map((i) => {
                          return <div id={9*row+col+'-'+i} className='cell-subgrid'>{''}</div>})}</div> : sudokuArr[row][col]}
                        </button>
                      </td>
                      })}
                    </tr>
                })
              }
            </tbody>
          </table>
        </div>
        <div className='Chat-box'>
          <Chatbox socket={socket} roomId={roomId}></Chatbox>
        </div>
      </div>
      <div className='number-buttons-table'>
        {
          [1,2,3,4,5,6,7,8,9].map((num, val) => {
            return <button key={val} value={num} className='number-buttons' 
                onClick={()=>onNumberButtonClick(num)}
            >{num}</button>
          })
        }
      </div>
    </div>
    </>
  );
}

export default Game;
