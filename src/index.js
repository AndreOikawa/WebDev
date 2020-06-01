import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
        currentPos: 4,
        colors: ["empty", "i", "s", "z", "t", "l", "j", "o"],

        // test stuff
        testTick: 0,
      };
      
      this.tick = this.tick.bind(this)
      setInterval(this.tick, 1000);
    }

    // handleKeyPress = event => {
    //   const squares = this.state.squares.slice();
      
    //   squares[0] = event.key;

    //   this.setState({
    //     squares: squares,
    //   });
    // };

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
          // onKeyDown={this.handleKeyPress}
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
  
