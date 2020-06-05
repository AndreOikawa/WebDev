import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const {I, J, L, S, Z, O, T} = require('./piece.js');

const WIDTH = 10;
const HEIGHT = 20;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function Square(props) {
  return (
    <button className={props.value + " square"} onClick={props.onClick}>
      {/* {props.value} */}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      squares: Array(200).fill("empty"),
      xPos: 4,
      yPos: -1,
      colors: ["empty", "i", "s", "z", "t", "l", "j", "o"],
      
      currentPiece: 0,
      currBag: [],
      nextBag: [],
      // test stuff
      testTick: 0,
      currentPos: 4,
    };
    
    this.tick = this.tick.bind(this)
    // setInterval(this.tick, 1000);
  }

  createBag() {
    let newBag = [new I("i"), new J("j"), new L("l"),new O("o"),new S("s"),new Z("z"),new T("t")]
    shuffle(newBag);

    this.setState({
      currBag: this.state.nextBag,
      nextBag: newBag,
    });
  }

  paintCells(clear, x, y) {
    const piece = this.state.currBag[this.state.currentPiece];
    const cells = piece.getCells().slice();
    const val = piece.type;
    const board = this.state.squares.slice();

    for (let i = 0; i < cells.length; i++) {
      const cell = (cells[i].y + y) * WIDTH + x + cells[i].x;
      if (cell >= 0) board[cell] = (clear ? "empty" : val);
    }
    
    this.setState({
      squares: board,
      xPos: x,
      yPos: y,
    });
  }

  handleKeyPress(e) {
    console.log("key pressed " + e.key);
    
    let redraw = false;
    switch( e.key ) {
      case "p":
      case "ArrowUp":
      case "x": 
      case "z": 
      case "ArrowDown": 
      case "ArrowLeft": 
      case "ArrowRight": 
      case " ": redraw = true; break;
    }
    if (!redraw) {
      console.log("Nothing to do");
      return;
    }

    let x = this.state.xPos;
    let y = this.state.yPos;
    this.paintCells(true, x, y);

    let movedLeft = false;
    let movedRight = false;
    let movedDown = false;
    let rotated = false;

    let testPiece = this.state.currentPiece;
    switch( e.key ) {
      case "p": testPiece = (testPiece + 1) % this.state.currBag.length; break;
      case "ArrowUp":
      case "x": rotated = true; this.state.currBag[this.state.currentPiece].rotate(true); break;
      case "z": rotated = true; this.state.currBag[this.state.currentPiece].rotate(false); break; 
      case "ArrowDown": movedDown = true; y++; break;
      case "ArrowLeft": movedLeft = true; x--; break;    
      case "ArrowRight": movedRight = true; x++; break;
      case " ": movedDown = true; y = HEIGHT-1; break;
    }
    
    if (testPiece != this.state.currentPiece) this.setState({currentPiece: testPiece});
    const toPaint = this.state.currBag[this.state.currentPiece].getCells().slice();
    if (rotated) {
      movedDown = true;
      movedLeft = true;
      movedRight = true;
    }
    if (movedDown) {
      while (toPaint.map(a => {
        const squareVal = (a.y + y) * WIDTH + (a.x + x);
        if (a.y + y < 0) return false;
        return (a.y + y >= HEIGHT || this.state.squares[squareVal] != "empty");
      }).reduce((a,b) => { return a || b; } )) {
        y--;
      }
    } 

    if (movedLeft) {
      const leftMost = this.state.currBag[this.state.currentPiece].getLeftParts().slice();
      while (leftMost.map(a => {
        const squareVal = (a.y + y) * WIDTH + (a.x + x);
        if (a.y + y < 0) return false;
        return (a.x + x < 0 || this.state.squares[squareVal] != "empty");
      }).reduce((a,b) => { return a || b; })) {
        x++;
      }
    } 

    if (movedRight) {
      const rightMost = this.state.currBag[this.state.currentPiece].getRightParts().slice();
      while (rightMost.map(a => {
        const squareVal = (a.y + y) * WIDTH + (a.x + x);
        if (a.y + y < 0) return false;
        return (a.x + x >= WIDTH || this.state.squares[squareVal] != "empty");
      }).reduce((a,b) => { return a || b; })) {
        x--;
      }
    }
    
    this.paintCells(false, x, y);
    
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
    // start game
    if (this.state.currBag.length == 0) {
      this.createBag();
      this.createBag();
    }
    
    return (
      <div>
        {/* <div className="status">{status}</div> */}
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
  
