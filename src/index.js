import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Square extends React.Component {
  constructor(props){
    console.log("Props: " + props.index)
    super(props)
    this.state = {
      index: props.index,
      value: props.board[props.index],
    }
  }

  render() {
    return (
      <button className='box' onClick={()=>{
        selected = this.state.index
        console.log("Selected: " + props.selected)
      }}>
      {this.state.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      board: Array(81).fill(0),
      digits: Array(9).fill().map((_,idx)=>1+idx),
      selected: null,
    }
  }
  
  forceUpdateHandler(){
    this.forceUpdate()
  };

  renderSquare(i) { // Sudoku Grid Buttons
    return ( 
      <Square className="box" index={i}>
      </Square>
    );
  }

  renderDigit(i) { // Digits
    return (
      <button className='digits'
        value={i}
        onClick={() => {
          board[selected] = i
          console.log(i)
          console.log("Board " + board)
          console.log("Selected " + selected)
          this.forceUpdateHandler()
        }}>{i}</button>
      );
  }

  render() {
    return (
      <div>
        <div className="board-wrapper">
          {board.map((x, idx) => {
            return this.renderSquare(idx)
          })}
        </div>
        <div className='digits-wrapper'>
            {this.state.digits.map(x => {
              return this.renderDigit(x)
            })}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

//Rerender the dom when button is clicked