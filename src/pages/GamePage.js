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

let unsolved_sudoku = Array.from({length: 81}, () => 0);

let solved_sudoku = Array.from({length: 81}, () => 0);

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
  const [sudokuArr, setSudokuArr] = useState(unsolved_sudoku) //refactor code to make this a const
  const [isGameOver, setGameOver] = useState(false)
  const [roomId, ] = useState(useLocation().pathname.split("/")[2]);
  const [startTime, setStartTime] = useState()
  const [userName, setUserName] = useState(localStorage.getItem("userName"))
  let unsolvedCount = useRef(0)

  const navigate = useNavigate();

  useEffect(() => {
    async function getSudoku() {
      await axios.get(`http://localhost:3000/joinRoom/${roomId}`)
      .then(response => {
        const unsolvedPuzzle = response.data.unsolvedPuzzle
        const solvedPuzzle = response.data.solvedPuzzle
        let count = 0
        for (let i = 0; i < 81; i++) {
          if (unsolvedPuzzle[i] === 0) 
            count++
          unsolved_sudoku[i] = unsolvedPuzzle[i]
          solved_sudoku[i] = solvedPuzzle[i];
          let cell = document.getElementById(i)
          cell.classList.toggle('iswrong', !(solvedPuzzle[i] === unsolvedPuzzle[i] || unsolvedPuzzle[i] === 0))
        }
        unsolvedCount = count
        setStartTime(response.data.time)
        setSudokuArr(unsolvedPuzzle)
      })
      .catch(error => console.error(error));
    }
    getSudoku()
  }, [])

  useEffect(() => {
    if (userName !== null)
      socket.emit("join-room", userName, roomId)

    if (socket.listeners("sudoku-update").length === 0)
      socket.on("sudoku-update", (selected, value) => {
        unsolved_sudoku[selected] = value
        const updatedSudokuArr = sudokuArr.slice()[selected] = value
        setSudokuArr(updatedSudokuArr);
  
        let cell = document.getElementById(selected)
        if (solved_sudoku[selected] === value || value === 0) {
          if (solved_sudoku[selected] === value)
            if (--unsolvedCount === 0)
              setGameOver(true)
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

    // Define keydown event listener function
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
      document.removeEventListener('keydown', keydownListener, false);
      hasKeydownListener = false;
    };
    
  }, [socket])

  function onNumberButtonClick(val) {
    if (solved_sudoku[selected] === sudokuArr[selected]) //if we are in an already solved tile do nothing
      return
    if (notesMode) { //if we are in notes mode update the tile's note grid
      let item = document.getElementById(selected+'-'+val)
      item.textContent = (item.textContent === '' ? val:'')
    }
    else { //Otherwise...
      const updatedSudokuArr = sudokuArr.slice()
      updatedSudokuArr[selected] = unsolved_sudoku[selected] === val ? 0 : val
      unsolved_sudoku[selected] = unsolved_sudoku[selected] === val ? 0 : val
      setSudokuArr(updatedSudokuArr)
      if (solved_sudoku[selected] === val) {
        propogateNoteUpdate(val)
        console.log(`There are ${--unsolvedCount} unsolved tiles left`)
      }
      if (unsolvedCount === 0)
        setGameOver(true)
      let cell = document.getElementById(selected)
      cell.classList.toggle('iswrong', !(solved_sudoku[selected] === val || unsolved_sudoku[selected] === 0))
      cell.classList.toggle('ishighlighted', false)
      socket.emit("sudoku-change", userName, roomId, selected, updatedSudokuArr[selected])
    }
    highlight.forEach(element => {
      document.getElementById(element).classList.toggle('ishighlighted', true)
    })
    highlightCells(sudokuArr[selected])
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

  function propogateNoteUpdate(val) { //handles the removal of a number on the notes grid of a cell
    highlight.forEach(element => {
      let item = document.getElementById(element+'-'+val)
      if (item !== null)
        item.textContent = ''
    })
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
    highlightCells(sudokuArr[9*row+col])
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
                        value={sudokuArr[9*row+col] === 0 ? '' : sudokuArr[9*row+col]} 
                        className={'cell-complete'}
                        >{sudokuArr[9*row+col] === 0 ? <div className='cell-note-grid'>{[1,2,3,4,5,6,7,8,9].map((i) => {
                          return <div id={9*row+col+'-'+i} className='cell-subgrid'>{''}</div>})}</div> : sudokuArr[9*row+col]}
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
