import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const {I, J, L, S, Z, O, T, Piece} = require('./piece.js');

const WIDTH = 10;
const HEIGHT = 20;
const START_Y = -1;
const START_X = 4;
const INITIAL_TIMER = 500;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function Square(props) {
  return (
    <button className={props.value + " square"}>
    </button>
  );
}

function Text(props) {
  return (
    <label>
    {props.text + " " + props.value}
    </label>
  );
}

class Display extends React.Component {
  renderSquare(val) {
    return (
      <Square
        value={val}
      />
    );
    
  }

  renderRow(row) {
    return (
      <div className="board-row">
        {row.map(val => {
          return this.renderSquare(val);
        })}
      </div>
    );
  }

  renderBoard(rows) {
    return (
      <div className="board">
        {rows.map((row) => {
          return this.renderRow(row)
        })}
      </div>      
    );

  }
  render() {
    return (
      <div>
        {this.renderBoard(this.props.squares)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    let currBag = [new I("i"), new J("j"), new L("l"),new O("o"),new S("s"),new Z("z"),new T("t")]
    // let currBag = [new T("t"),new T("t"),new T("t"),new T("t"),new T("t"),new T("t"),new T("t")]
    shuffle(currBag);

    let nextBag = [new I("i"), new J("j"), new L("l"),new O("o"),new S("s"),new Z("z"),new T("t")]
    // let nextBag = [new T("t"),new T("t"),new T("t"),new T("t"),new T("t"),new T("t"),new T("t")]
    shuffle(nextBag);

    let arr = [];
    let nextPiece = 1;
    
    while (nextPiece < currBag.length) {
      arr.push(currBag[nextPiece]);
      nextPiece++;
    }
    nextPiece = 0;
    arr.push(nextBag[nextPiece]);
    
    const squares = new Array(19).fill().map(() => new Array(4).fill("empty"));
    
    for (let i = 0; i < 6; i++) {
      const cells = arr[i].cells[0];
      const type = arr[i].type;
      const offset = 3 * i + 1;
      for (let c = 0; c < cells.length; c++) {
        const y = offset + cells[c].y
        const x = cells[c].x;
        squares[y][x] = type;
      }
    }

    this.fall = this.fall.bind(this);
    const fallId = setInterval(this.fall, INITIAL_TIMER);
    this.speedUp = this.speedUp.bind(this);
    const speedUpId = setInterval(this.speedUp, 1000);
    this.state = {
      // timer
      fallId: fallId,
      gameOver: false,
      nextTick: INITIAL_TIMER,
      speedUpId: speedUpId,
      deltaT: 0,
      level: 1,

      // board
      squares: new Array(HEIGHT).fill().map(() => new Array(WIDTH).fill("empty")),
      xPos: START_X,
      yPos: START_Y,
      lock: false,
      fall: false,
      currentPiece: 0,
      currBag: currBag,
      nextBag: nextBag,

      // hold display
      hold: false,
      holdPiece: new Piece("empty"),
      holdSquares: new Array(2).fill().map(() => new Array(4).fill("empty")),
      again: false,

      // next display
      nextSquares: squares,

      // info
      linesCleared: 0,
    };
    
    
    
    this.lock = this.lock.bind(this);
  }
  
  paintSquares(piece) {
    const tiles = piece.cells[0];
    const type = piece.type;
    const squares = new Array(2).fill().map(() => new Array(4).fill("empty"));
    for (let i = 0; i < tiles.length; i++) {
      const x = tiles[i].x;
      const y = tiles[i].y;
      squares[y][x] = type;
    }

    this.setState({
      holdSquares: squares,
    });
  }

  updatePiece(newPiece) {
    this.paintSquares(newPiece);

    this.setState({
      holdPiece: newPiece,
    });
  }

  holdPiece() {
    let holdPiece = this.state.holdPiece;
    holdPiece.orientation = 0;
    if (holdPiece.type === "empty") {
      holdPiece = this.state.currBag[this.state.currentPiece];
      this.updatePiece(holdPiece);
      this.newPiece();
    } else {
      const temp = holdPiece;
      holdPiece = this.state.currBag[this.state.currentPiece];
      this.updatePiece(holdPiece);
      let currBag = this.state.currBag.slice();
      currBag[this.state.currentPiece] = temp;
      
      this.setState({
        currBag: currBag,
      });
    }

    this.setState({
      yPos: START_Y,
      xPos: START_X,
      hold: true,
    });
  }

  createBag() {
    let newBag = [new I("i"), new J("j"), new L("l"),new O("o"),new S("s"),new Z("z"),new T("t")]
    // let newBag = [new T("t"),new T("t"),new T("t"),new T("t"),new T("t"),new T("t"),new T("t")]
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

  gameOver() {
    const timer = this.state.fallId;
    clearInterval(timer);
    const speedUp = this.state.speedUpId;
    clearInterval(speedUp);

    this.setState({
      gameOver: true,
      fallId: timer,
      speedUpId: speedUp,
    });
  }

  invalidDownMove(tiles, x, y) {
    function checkTiles(a) {
      const squareY = a.y + this.y;
      const squareX = a.x + this.x;
      if (squareY < 0 || squareX < 0 || squareX >= WIDTH) return false;
      return (squareY >= HEIGHT || this.squares[squareY][squareX] !== "empty");
    }
    return tiles.map(checkTiles, {x: x, y: y, squares: this.state.squares}).reduce((a,b) => { return a || b; } )
  }

  newPiece() {
    const currentPiece = (this.state.currentPiece + 1) % this.state.currBag.length;
    
    if (currentPiece === 0) {
      this.createBag();
    }
    
    this.setState({
      currentPiece: currentPiece,
      yPos: START_Y,
      xPos: START_X,
    });

    if (this.invalidDownMove(this.state.currBag[this.state.currentPiece].getCells().slice(), START_X,START_Y)) {
      console.log("Game Over");
      this.gameOver();
    } else {
      this.paintNext();
    }

    
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

  clearLine() {
    
    const y = this.state.yPos;
    const pieceY = [...new Set(this.state.currBag[this.state.currentPiece].getCells().slice().map(a => a.y))].sort().reverse();
    let linesCleared = this.state.linesCleared;

    const squares = this.state.squares.slice();
    let count = 0;
    let change = false;
    for (let i = 0; i < pieceY.length; i++) {
      var filled = true;
      if (pieceY[i] + y < 0) continue;
      for (let x = 0; x < WIDTH; x++) {
        
        if (squares[pieceY[i] + y][x] === "empty") {
          filled = false;
          break;
        }
      }
      if (filled) {
        change = true;
        squares.splice(pieceY[i] + y, 1);
        count++;
        linesCleared++;
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
        linesCleared: linesCleared,
      })
    }

    this.setState({
      again: false,
    });
  }

  speedUp() {
    const deltaT = this.state.deltaT + 1;
    let speed = this.state.nextTick;
    let level = this.state.level;
    if (deltaT < 10) {
      speed = 1000;
      level = 1;
    } else if (deltaT < 30) {
      speed = 833;
      level = 2;
    } else if (deltaT < 50) {
      speed = 666;
      level = 3;
    } else if (deltaT < 70) {
      speed = 500;
      level = 4;
    } else if (deltaT < 90) {
      speed = 333;
      level = 5;
    } else if (deltaT < 110) {
      speed = 166;
      level = 6;
    } else if (deltaT < 130) {
      speed = 133;
      level = 7;
    } else if (deltaT < 150) {
      speed = 100;
      level = 8;
    } else if (deltaT < 170) {
      speed = 66;
      level = 9;
    } else if (deltaT < 190) {
      speed = 33;
      level = 10;
    } else {
      speed = 16;
      level = 11;
    }

    this.setState({
      deltaT: deltaT,
      nextTick: speed,
      level: level,
    });
  }

  restart() {
    this.createBag();
    this.createBag();
    const fallId = setInterval(this.fall, INITIAL_TIMER);
    const speedId = setInterval(this.speedUp, 1000);
    const squares = new Array(19).fill().map(() => new Array(4).fill("empty"));
    const arr = this.state.currBag;
    for (let i = 0; i < 6; i++) {
      const cells = arr[i].cells[0];
      const type = arr[i].type;
      const offset = 3 * i + 1;
      for (let c = 0; c < cells.length; c++) {
        const y = offset + cells[c].y
        const x = cells[c].x;
        squares[y][x] = type;
      }
    }
    this.setState({
      // timer
      fallId: fallId,
      gameOver: false,
      nextTick: INITIAL_TIMER,
      deltaT: 0,
      speedUpId: speedId,
      level: 1,

      // board
      squares: new Array(HEIGHT).fill().map(() => new Array(WIDTH).fill("empty")),
      xPos: START_X,
      yPos: START_Y,
      lock: false,
      fall: false,
      currentPiece: 0,

      // hold display
      hold: false,
      holdPiece: new Piece("empty"),
      holdSquares: new Array(2).fill().map(() => new Array(4).fill("empty")),
      again: false,

      // next display
      nextSquares: squares,

      // info
      linesCleared: 0,
    });
  }

  handleKeyPress(e) {
    if (e.key == "r" && this.state.gameOver) {
      this.restart(); 
      return;
    }
    
    if (this.state.hold || this.state.gameOver) return;
    let redraw = false;
    switch( e.key ) {
      case "c":
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
      return;
    }

    let x = this.state.xPos;
    let y = this.state.yPos;
    this.paintCells(true, x, y);

    let movedLeft = false;
    let movedRight = false;
    let movedDown = false;
    let rotated = false;
    let hardDrop = false;
    let hold = false;

    switch( e.key ) {
      case "c": hold = true; break;
      case "ArrowUp":
      case "x": rotated = true; this.state.currBag[this.state.currentPiece].rotate(true); break;
      case "z": rotated = true; this.state.currBag[this.state.currentPiece].rotate(false); break; 
      case "ArrowDown": movedDown = true; y++; break;
      case "ArrowLeft": movedLeft = true; x--; break;    
      case "ArrowRight": movedRight = true; x++; break;
      case " ": movedDown = true; hardDrop = true; y = this.highestY(x, y); break;
      default: break;
    }
    
    if (hold && !this.state.again) {
      this.holdPiece();
      this.setState({
        again: true,
      });
      return;
    }

    if (rotated) {
      movedDown = true;
      movedLeft = true;
      movedRight = true;
      const tiles = this.state.currBag[this.state.currentPiece].getCells().slice();
      while (tiles.map(a => {
        const squareX = a.x + x;
        return (squareX < 0);
      }).reduce((a,b) => { return a || b; })) {
        x++;
      }

      while (tiles.map(a => {
        const squareX = a.x + x;
        return (squareX >= WIDTH);
      }).reduce((a,b) => { return a || b; })) {
        x--;
      }
      if (tiles.map(a => {
        const squareY = a.y + y;
        const squareX = a.x + x;
        return (squareY >= 0 && this.state.squares[squareY][squareX] !== "empty");
      }).reduce((a,b) => { return a || b; })) {
        y++;
      }
      
    }

    if (movedDown) {
      const tiles = this.state.currBag[this.state.currentPiece].getCells().slice();
      let prevY = y;
      while (this.invalidDownMove(tiles, x, y) && y >= 0) {
        y--;
      }
      if (y < 0) y = prevY
    } 

    if (movedLeft) {
      const leftMost = this.state.currBag[this.state.currentPiece].getCells().slice();
      let prevX = x;
      while (leftMost.map(a => {
        const squareY = a.y + y;
        const squareX = a.x + x;
        if (squareY < 0) return false;
        return (squareX < 0 || this.state.squares[squareY][squareX] !== "empty");
      }).reduce((a,b) => { return a || b; }) && x < WIDTH) {
        x++;
      }
      if (x >= WIDTH) x = prevX;
    } 

    if (movedRight) {
      const rightMost = this.state.currBag[this.state.currentPiece].getCells().slice();
      let prevX = x;
      while (rightMost.map(a => {
        const squareY = a.y + y;
        const squareX = a.x + x;        
        if (squareY < 0) return false;
        return (squareX >= WIDTH || this.state.squares[squareY][squareX] !== "empty");
      }).reduce((a,b) => { return a || b; })) {
        x--;
      }
      if (x < 0) x = prevX;
    }
    
    this.paintCells(false, x, y);
    if (hardDrop) {
      this.clearLine();
      this.newPiece();
    }
    
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyPress.bind(this));
  }

  componentWillUnmount() {
      document.removeEventListener("keydown", this.handleKeyPress.bind(this));
  } 
  
  lock() {
    let lockFrame = this.state.lock;
    const x = this.state.xPos;
    const y = this.state.yPos + 1;
    const tiles = this.state.currBag[this.state.currentPiece].getBottomParts().slice();
    if (lockFrame && this.invalidDownMove(tiles, x, y)) {
      this.clearLine();
      this.newPiece();
    } else {
      lockFrame = false;
    }

    this.setState({
      lock: lockFrame,
    });
  }

  fall() {
    let hold = this.state.hold;
    
    if (hold) {
      this.setState({
        hold: false,
        lock: false,
        yPos: START_Y,
        xPos: START_X,
      });
      return;
    }
    
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
      setTimeout(this.lock, INITIAL_TIMER);
    }

    const nextTick = this.state.nextTick;
    let fallId = this.state.fallId;
    clearInterval(fallId);
    fallId = setInterval(this.fall, nextTick);
    this.setState({
      lock: lockFrame,
      fallId: fallId,
      nextTick: nextTick,
    });
    
    
  }

  paintNext() {
    let arr = [];
    let nextPiece = this.state.currentPiece + 1;
    const currBag = this.state.currBag;
    while (nextPiece < currBag.length) {
      arr.push(currBag[nextPiece]);
      nextPiece++;
    }
    nextPiece = 0;
    const nextBag = this.state.nextBag;
    while (arr.length < 6) {
      arr.push(nextBag[nextPiece]);
      nextPiece++;
    }

    console.log("arr",arr, "currbag",currBag, "nextbag", nextBag,"nextpiece", nextPiece);


    const squares = new Array(19).fill().map(() => new Array(4).fill("empty"));
    
    for (let i = 0; i < 6; i++) {
      const cells = arr[i].cells[0];
      const type = arr[i].type;
      const offset = 3 * i + 1;
      for (let c = 0; c < cells.length; c++) {
        const y = offset + cells[c].y
        const x = cells[c].x;
        squares[y][x] = type;
      }
    }

    this.setState({
      nextSquares: squares,
    });
  }

  render() {
    // start game
    

    return (
      <div className="game">
        <div className="hold-piece">
          <Display 
            squares={this.state.holdSquares}
          />
          <Text
            text={"Level:"}
            value={this.state.level}
          />
          <br/>
          <Text
            text={"Time:"}
            value={this.state.deltaT}
          />
          <br/>
          <Text
          text={"Lines Cleared:"}
          value={this.state.linesCleared}
          />
        </div>
        <div className="game-board">
          <Display 
            squares={this.state.squares}
          />
        </div>
        <div className="next-piece">
          <Display
          squares={this.state.nextSquares}
          />
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
  
