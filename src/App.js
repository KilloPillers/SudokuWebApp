import './App.css';
import React, {useState, useReducer} from 'react'

let initial = [
  [-1, 5, -1, 9, -1, -1, -1, -1, -1],
  [8, -1, -1, -1, 4, -1, 3, -1, 7],
  [-1, -1, -1, 2, 8, -1, 1, 9, -1],
  [5, 3, 8, 6, -1, 7, 9, 4, -1],
  [-1, 2, -1, 3, -1, 1, -1, -1, -1],
  [1, -1, 9, 8, -1, 4, 6, 2, 3],
  [9, -1, 7, 4, -1, -1, -1, -1, -1],
  [-1, 4, 5, -1, -1, -1, 2, -1, 9],
  [-1, -1, -1, -1, 3, -1, -1, 7, -1]
]

function App() {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [sudokuArr, setSudokuArr] = useState(initial);
  const [selected, setSelected] = useState(0)
  const [highlight, setHighlight] = useState([])
  const [notesMode, setNotesMode] = useState()
  
  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr))
  }

  function onNumberButtonClick(val) {
    if (notesMode) {
      let item = document.getElementById(selected+'-'+val)
      item.textContent = (item.textContent === '' ? val:'')
    }
    else {
      document.getElementById(selected).style.color = 'blue'
      document.getElementById(selected).classList.toggle('isdigithighlighted', true)
      sudokuArr[Math.floor(selected/9)][selected%9] = val
      setSudokuArr(sudokuArr)
    }
    forceUpdate()
  }

  function onGridButtonClick(row, col) {
    //Revert previously highlighted elements
    document.getElementById(selected).classList.toggle('isselected', false)

    highlight.forEach(element => {
      document.getElementById(element).classList.toggle('ishighlighted', false)
    })
    setSelected(9*row+col)
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
    let uniqueCells = [...new Set(temp)] //remove duplicates from list
    setHighlight(uniqueCells)
    uniqueCells.forEach(element => { //Toggle elements highlighted on grid
      document.getElementById(element).classList.toggle('ishighlighted', true)
    })

    document.getElementById(9*row+col).classList.toggle('ishighlighted', false)
    document.getElementById(9*row+col).classList.toggle('isselected', true)

    //highlights cells with the same value as the selected cell
    for (let i = 0; i < 81; i++) {
      let cell = document.getElementById(i)
      if (parseInt(cell.textContent) === sudokuArr[row][col]) {
        cell.classList.toggle('ishighlighted', false)
        cell.classList.toggle('isdigithighlighted', true)
      }
      else {
        cell.classList.toggle('isdigithighlighted', false)
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>Sudoku</h3>
        <div></div>
        <table className='grid-table'>
          <tbody>
            {
              [0,1,2,3,4,5,6,7,8].map((row, rIndex) => {
                return <tr key={rIndex} className={(row + 1) % 3 === 0 && row != 8 ? 'bBorder':'grid-cell'}>
                  {[0,1,2,3,4,5,6,7,8].map((col, cIndex) => {
                    return <td key={rIndex+cIndex} className={(col + 1) % 3 === 0 && col != 8 ? 'rBorder':'grid-cell'}>
                      <button onClick={()=>onGridButtonClick(row,col)} 
                      id={9*row+col}
                      value={sudokuArr[row][col] === -1 ? '' : sudokuArr[row][col]} 
                      className={(sudokuArr[row][col] === -1) ? 'cell' : 'cell-complete'}
                      >{sudokuArr[row][col] === -1 ? '' : sudokuArr[row][col]}
                        {sudokuArr[row][col] !== -1 ? '' : [1,2,3,4,5,6,7,8,9].map((i) => {
                          return <div id={9*row+col+'-'+i} className='cell-subgrid'>{''}</div>
                        })}
                      </button>
                    </td>
                    })}
                  </tr>
              })
            }
          </tbody>
        </table>
        <div>
          <table className='number-buttons-table'>
            {
              [1,2,3,4,5,6,7,8,9].map((num, val) => {
                return <td className='number-buttons-td' key={val}>
                    <button key={val} value={num} className='number-buttons' 
                    onClick={()=>onNumberButtonClick(num)}
                    >{num}</button>
                  </td>
              })
            }
          </table>
          <button onClick={() => {
            setNotesMode(!notesMode)
          }}>Enable Notes</button>
        </div>
      </header>
    </div>
  );
}

export default App;
