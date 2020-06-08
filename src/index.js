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
    <button className={props.value + " square"}>
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
      yPos: -3,
      colors: ["empty", "i", "s", "z", "t", "l", "j", "o"],
      lock: false,
      fall: false,
      currentPiece: 0,
      currBag: [],
      nextBag: [],
    };
    
    this.fall = this.fall.bind(this);
    setInterval(this.fall, 100);

    this.lock = this.lock.bind(this)
    // setInterval(this.lock, 500);
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

  invalidDownMove(tiles, x, y) {
    function checkTiles(a) {
      const squareVal = (a.y + this.y) * WIDTH + (a.x + this.x);
      if (a.y + this.y < 0) return false;
      return (a.y + this.y >= HEIGHT || this.squares[squareVal] !== "empty");
    }
    return tiles.map(checkTiles, {x: x, y: y, squares: this.state.squares}).reduce((a,b) => { return a || b; } )
  }

  newPiece() {
    const currentPiece = (this.state.currentPiece + 1) % this.state.currBag.length;
    console.log(currentPiece);
    
    if (currentPiece == 0) {
      this.createBag();
    }

    this.setState({
      currentPiece: currentPiece,
      yPos: -3,
      xPos: 4,
    });
  }

  highestY(x, y) {
    const tiles = this.state.currBag[this.state.currentPiece].getBottomParts().slice();
    function checkTiles(a) {
      const squareVal = (a.y + this.y) * WIDTH + (a.x + this.x);
      if (a.y + this.y < 0) return false;
      return (a.y + this.y >= HEIGHT || this.squares[squareVal] !== "empty");
    }

    while (!tiles.map(checkTiles, {x: x, y: y, squares: this.state.squares}).reduce((a,b) => { return a || b; } )) {
      y++;
    }

    return y - 1;
    
  }

  handleKeyPress(e) {
    // console.log("key pressed " + e.key);
    
    let redraw = false;
    let reset = false;
    switch( e.key ) {
      case "p":
      case "r": reset = true;
      case "ArrowUp":
      case "x": 
      case "z": 
      case "ArrowDown": 
      case "ArrowLeft": 
      case "ArrowRight": 
      case " ": redraw = true; break;
      default: break;
    }
    if (!redraw) {
      // console.log("Nothing to do");
      return;
    }
    if (reset) {
      const arr = Array(200).fill("empty");
      this.setState({
        squares: arr,
      });
    }
    let x = this.state.xPos;
    let y = this.state.yPos;
    this.paintCells(true, x, y);

    let movedLeft = false;
    let movedRight = false;
    let movedDown = false;
    let rotated = false;
    let hardDrop = false;

    let testPiece = this.state.currentPiece;
    switch( e.key ) {
      case "p": testPiece = (testPiece + 1) % this.state.currBag.length; break;
      case "ArrowUp":
      case "x": rotated = true; this.state.currBag[this.state.currentPiece].rotate(true); break;
      case "z": rotated = true; this.state.currBag[this.state.currentPiece].rotate(false); break; 
      case "ArrowDown": movedDown = true; y++; break;
      case "ArrowLeft": movedLeft = true; x--; break;    
      case "ArrowRight": movedRight = true; x++; break;
      case " ": movedDown = true; hardDrop = true; y = this.highestY(x, y); break;
      default: break;
    }
    
    if (testPiece !== this.state.currentPiece) this.setState({currentPiece: testPiece});
    if (rotated) {
      movedDown = true;
      movedLeft = true;
      movedRight = true;
    }
    if (movedDown) {
      const tiles = this.state.currBag[this.state.currentPiece].getCells().slice();
      while (this.invalidDownMove(tiles, x, y)) {
        y--;
      }
    } 

    if (movedLeft) {
      const leftMost = this.state.currBag[this.state.currentPiece].getLeftParts().slice();
      while (leftMost.map(a => {
        const squareVal = (a.y + y) * WIDTH + (a.x + x);
        if (a.y + y < 0) return false;
        return (a.x + x < 0 || this.state.squares[squareVal] !== "empty");
      }).reduce((a,b) => { return a || b; })) {
        x++;
      }
    } 

    if (movedRight) {
      const rightMost = this.state.currBag[this.state.currentPiece].getRightParts().slice();
      while (rightMost.map(a => {
        const squareVal = (a.y + y) * WIDTH + (a.x + x);
        if (a.y + y < 0) return false;
        return (a.x + x >= WIDTH || this.state.squares[squareVal] !== "empty");
      }).reduce((a,b) => { return a || b; })) {
        x--;
      }
    }
    
    this.paintCells(false, x, y);
    if (hardDrop) {
      this.newPiece();
    }
    
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyPress.bind(this));
  }

  componentWillUnmount() {
      document.removeEventListener("keydown", this.handleKeyPress.bind(this));
  }  

  renderSquare(i) {
    return (
      <Square key={i} 
        value={this.state.squares[i]}
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

  lock() {
    let lockFrame = this.state.lock;
    const x = this.state.xPos;
    const y = this.state.yPos + 1;
    const tiles = this.state.currBag[this.state.currentPiece].getBottomParts().slice();
    if (lockFrame && this.invalidDownMove(tiles, x, y)) {
      this.newPiece();
    } else {
      lockFrame = false;
    }

    this.setState({
      lock: lockFrame,
    });
  }

  fall() {
    let lockFrame = this.state.lock;
    const x = this.state.xPos;
    const y = this.state.yPos + 1;
    const tiles = this.state.currBag[this.state.currentPiece].getBottomParts().slice();
    
    if (!this.invalidDownMove(tiles, x, y)) {
      this.paintCells(true, x, y-1);
      this.paintCells(false, x, y);
      lockFrame = false;
      this.setState({
        xPos: x,
        yPos: y,
      });
    } else if (!lockFrame) {
      lockFrame = true;
    } else {
      setTimeout(this.lock, 500);
    }

    this.setState({
      lock: lockFrame,
    });
    
    
  }

  render() {
    // start game
    if (this.state.currBag.length === 0) {
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
  
