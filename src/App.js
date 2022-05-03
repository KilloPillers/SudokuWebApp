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

  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr))
  }

  function onNumberButtonClick(val) {
    sudokuArr[Math.floor(selected/9)][selected%9] = val
    setSudokuArr(sudokuArr)
    forceUpdate()
  }

  function onGridButtonClick(row, col) {
    setSelected(9*row+col)
    let row_array = [...Array(9).keys()].map(x => col+x*9);
    let col_array = [...Array(9).keys()].map(y => y+row*9);
    let square_array = []
    for (let y = parseInt(row/3)*3; y < parseInt(row/3)*3+3; y++){
      for (let x = parseInt(col/3)*3; x < parseInt(col/3)*3+3; x++) {
        square_array.push(9*y+x)
      }
    }
    setHighlight(square_array.concat(row_array, col_array))
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
                      value={sudokuArr[row][col] === -1 ? '' : sudokuArr[row][col]} 
                      className={highlight.includes(9*row+col) ? 'cell-highlighted' : 'cell'}
                      disabled={initial[row][col] !== -1}
                      >{sudokuArr[row][col] === -1 ? '' : sudokuArr[row][col]}</button>
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
        </div>
      </header>
    </div>
  );
}

export default App;
