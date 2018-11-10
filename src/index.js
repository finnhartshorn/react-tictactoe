import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'


const Square = (props) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(rowNumber, numColumns) {
    let squares = [];
    for (let i = 0; i < numColumns; i++) {
      squares.push(this.renderSquare(rowNumber * numColumns + i));
    }
    return <div className="board-row">{squares}</div>;
  }

  renderBoard(numColumns, numRows) {
    let rows = [];
    for (let i = 0; i < numColumns; i++) {
      rows.push(this.renderRow(i, numColumns));
    }
    return <div>{rows}</div>;
  }

  render() {
    return this.renderBoard(3, 3);
  }
}

class Game extends React.Component {
    state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      nextMove: "X",
      reverseHistory: false,
    }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const nextState = this.state.nextMove === "X" ? "O" : "X";
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.nextMove;
    this.setState({
      history: history.concat([{
        squares: squares,
        movePosition: [i % 3 + 1, Math.ceil((i+1)/3)]
      }]),
      stepNumber: history.length,
      nextMove: nextState,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      nextMove: (step % 2) === 0 ? "X" : "O"
    });
  }

  reverseHistory() {
    this.setState({
      reverseHistory: !this.state.reverseHistory,
    });
  }

  render() {
    const history = this.state.reverseHistory ? this.state.history.slice().reverse() : this.state.history;
    const current = this.state.history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      move = this.state.reverseHistory ? history.length - move - 1 : move;
      let desc = step.movePosition ?
        'Go to move #' + move + " " + moveString(step,move) :
        'Go to game start';
      if (move === this.state.stepNumber) {
        desc = <strong>{desc}</strong>
      }
      return  (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    const status = winner ? "Winner: " + winner : "Next player: " + this.state.nextMove;

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.reverseHistory()}>Reverse</button>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function moveString(step, stepNumber) {
  let player = ((stepNumber % 2) === 0 ? "O" : "X")
  let move = " [" + step.movePosition[0] + "," + step.movePosition[1] + "]";
  return player + move
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);