import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const {I} = require('./piece.js');

const WIDTH = 10;
const HEIGHT = 20;

function Square(props) {
  return (
    <button className={props.value + " square"} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      squares: Array(200).fill("empty"),
      xPos: 4,
      yPos: 0,
      colors: ["empty", "i", "s", "z", "t", "l", "j", "o"],
      
      currentPiece: new I("i"),

      // test stuff
      testTick: 0,
      currentPos: 4,
    };
    
    this.tick = this.tick.bind(this)
    // setInterval(this.tick, 1000);
  }

  paintCells(clear, x, y) {
    const cells = this.state.currentPiece.getCells().slice();
    const val = this.state.currentPiece.type;
    const board = this.state.squares.slice();

    for (let i = 0; i < cells.length; i++) {
      cells[i] += y * WIDTH + x;
      // console.log(toPaint[i]);
    }

    for (let i = 0; i < cells.length; i++) {
        
      board[cells[i]] = (clear ? "empty" : val);
    }
    
    this.setState({
      squares: board,
      xPos: x,
      yPos: y,
    });
  }

  handleKeyPress(e) {
    console.log("key pressed " + e.key);
    let x = this.state.xPos;
    let y = this.state.yPos;

    this.paintCells(true, x, y);

    switch( e.key ) {
      case "ArrowUp":
      case "x": this.state.currentPiece.rotate(true); break;
      case "ArrowDown": if (y+1 < HEIGHT) y++; break;
      case "ArrowLeft": if (x-1 >= 0) x--; break;    
      case "ArrowRight": if (x+1 < WIDTH) x++; break;
      case " ": y = HEIGHT-1; break;
      case "z": this.state.currentPiece.rotate(false); break; 
    }
    
    // console.log(x, y);
    
    const toPaint = this.state.currentPiece.getCells().slice();
    const rightMost = toPaint.reduce((a, b) => {
      return Math.max(a%WIDTH, b%WIDTH);
    });

    if (x + rightMost >= WIDTH) {
        x = WIDTH - rightMost - 1;
    }

    const bottomMost = this.state.currentPiece.getBottomParts().slice();
    console.log("bottomMost ", bottomMost);
    y += bottomMost.map((a) => {
      const arrVal = y * WIDTH + a + 10;
      console.log("arrval y a ",arrVal, y, a);
      return (arrVal >= HEIGHT * WIDTH || this.state.squares[arrVal] != "empty") ? -1 : 0;
    }).reduce((a, b) => { return Math.min(a,b)});

    
    this.paintCells(false, x, y);
    
    // this.state.squares.slice()
    // const squares = this.paintCells(toPaint, Array(200).fill("empty"), this.state.currentPiece.type);

    
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyPress.bind(this));
  }

  componentWillUnmount() {
      document.removeEventListener("keydown", this.handleKeyPress.bind(this));
  }  

  handleClick(i) {
    const squares = this.state.squares.slice();
    
    squares[i] = this.state.colors[this.state.testTick]

    this.setState({
      squares: squares,
    });
  }

  renderSquare(i) {
    return (
      <Square key={i} 
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
        onKeyDown={(e) => this.handleKeyPress(e)}
      />
    );
    
  }

  renderRow(rowNum) {
    const rowLength = 10;
    const row = [];
    for (let i = 0; i < rowLength; i++) {
      row.push(rowLength * rowNum + i);
    }

    return (
      <div key={rowNum} className="board-row">
        {row.map((number) => {
          return this.renderSquare(number);
        })}
      </div>
    );
  }

  renderBoard() {
    const numRows = 20;
    const rows = [];
    
    for (let i = 0; i < numRows; i++) {
      rows.push(i);
    }

    

    return (
      <div className="board">
        {rows.map((number) => {
          return this.renderRow(number)
        })}
      </div>      
    );

  }

  tick() {
    console.log("tick");
    const squares = this.state.squares.slice();
    const tickVal = (this.state.testTick + 1)%this.state.colors.length;
    squares[this.state.currentPos] = this.state.colors[tickVal]
    const newPos = (this.state.currentPos + 10)%squares.length;
    this.setState({
      squares: squares,
      currentPos: newPos,
      testTick: tickVal,
    });
  }

  

  render() {
    let status = "Some texgt";
    
    return (
      <div>
        <div className="status">{status}</div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    // setInterval(Board.tick, 1000);
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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
  
