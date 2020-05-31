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
      };
    }

    handleClick(i) {
      const squares = this.state.squares.slice();
      const colors = ["empty", "i", "s", "z", "t", "l", "j", "o"]
      squares[i] = colors[Math.floor(Math.random()*colors.length)]

      this.setState({
        squares: squares,
      });
    }

    renderSquare(i) {
      return (
        <Square 
          value={this.state.squares[i]}
          onClick={() => this.handleClick(i)}
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
        <div className="board-row">
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
  
