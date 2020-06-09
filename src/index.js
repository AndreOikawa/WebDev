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
      {/* {props.y} */}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      squares: new Array(HEIGHT).fill().map(() => new Array(WIDTH).fill("empty")),
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
    setInterval(this.fall, 500);

    this.lock = this.lock.bind(this)
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
      const cellY = cells[i].y + y;
      const cellX = cells[i].x + x;
      
      if (cellX >= 0 && cellY >= 0) board[cellY][cellX] = (clear ? "empty" : val);
    }
    
    this.setState({
      squares: board,
      xPos: x,
      yPos: y,
    });
  }

  invalidDownMove(tiles, x, y) {
    function checkTiles(a) {
      const squareY = a.y + this.y;
      const squareX = a.x + this.x;
      if (squareY < 0) return false;
      return (squareY >= HEIGHT || this.squares[squareY][squareX] !== "empty");
    }
    return tiles.map(checkTiles, {x: x, y: y, squares: this.state.squares}).reduce((a,b) => { return a || b; } )
  }

  // clearLines(yVals) {
  //   const squares = this.state.squares.slice();
  //   for (let i = yVals.length - 1; i > 0; --i) {

  //     for (let square = yVals[i] * WIDTH; square < (yVals[i] + 1) * WIDTH; square++) {
  //       squares[square] = "empty";
  //     }
  //   }

  //   this.setState({
  //     squares: squares,
  //   });
  // }

  newPiece() {
    
    const y = this.state.yPos;
    const pieceY = [...new Set(this.state.currBag[this.state.currentPiece].getCells().slice().map(a => a.y))].sort().reverse();
    
    console.log(pieceY);

    const squares = this.state.squares.slice();
    let count = 0;
    let change = false;
    for (let i = 0; i < pieceY.length; i++) {
      var filled = true;
      for (let x = 0; x < WIDTH; x++) {
        if (squares[pieceY[i] + y][x] == "empty") {
          filled = false;
          break;
        }
      }
      if (filled) {
        change = true;
        console.log("clear line", pieceY[i]+y);
        squares.splice(pieceY[i] + y, 1);
        count++;
      }
    }

    while (count > 0) {
      const emptyLine = Array(WIDTH).fill("empty");
      squares.splice(0,0,emptyLine);
      count--;
    }

    if (change) {
      this.setState({
        squares: squares,
      })
    }

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
      const squareY = a.y + this.y;
      const squareX = a.x + this.x;
      if (squareY < 0) return false;
      return (squareY >= HEIGHT || this.squares[squareY][squareX] !== "empty");
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
    console.log(x,y);
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
        const squareY = a.y + y;
        const squareX = a.x + x;
        if (squareY < 0) return false;
        return (squareX < 0 || this.state.squares[squareY][squareX] !== "empty");
      }).reduce((a,b) => { return a || b; })) {
        x++;
      }
    } 

    if (movedRight) {
      const rightMost = this.state.currBag[this.state.currentPiece].getRightParts().slice();
      while (rightMost.map(a => {
        const squareY = a.y + y;
        const squareX = a.x + x;        
        if (squareY < 0) return false;
        return (squareX >= WIDTH || this.state.squares[squareY][squareX] !== "empty");
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

  renderSquare(xy) {
    return (
      <Square key={xy.x + xy.y * WIDTH} 
        value={this.state.squares[xy.y][xy.x]}
        // y={xy.y}
      />
    );
    
  }

  renderRow(rowNum) {
    const row = [];
    for (let i = 0; i < WIDTH; i++) {
      row.push({y: rowNum, x: i});
    }

    return (
      <div key={rowNum} className="board-row">
        {row.map(xy => {
          return this.renderSquare(xy);
        })}
      </div>
    );
  }

  renderBoard() {
    const rows = [];
    
    for (let i = 0; i < HEIGHT; i++) {
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
  
