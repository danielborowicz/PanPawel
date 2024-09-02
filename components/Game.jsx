import React, { useState, useEffect } from "react";
import Board from "./Board";
import styles from "./styles/Game.module.css";

const Game = () => {
	const [board, setBoard] = useState([]);
	const [gameStatus, setGameStatus] = useState("playing");
	const [difficultyLevel, setDifficultyLevel] = useState("easy");
	const [minesLeft, setMinesLeft] = useState(0);

	useEffect(() => {
		initializeBoard();
	}, [difficultyLevel]);

	const initializeBoard = () => {
		let rows, cols, mines;
		switch (difficultyLevel) {
			case "medium":
				rows = 16;
				cols = 16;
				mines = 40;
				break;
			case "hard":
				rows = 16;
				cols = 30;
				mines = 99;
				break;
			default: // easy mode
				rows = 9;
				cols = 9;
				mines = 10;
		}
		setMinesLeft(mines);

		// Board create (logic)
		const newBoard = Array(rows)
			.fill()
			.map(() =>
				Array(cols)
					.fill()
					.map(() => ({
						isMine: false,
						isRevealed: false,
						isFlagged: false,
						neighborMines: 0,
					}))
			);

		// Mines - random
		let minesPlaced = 0;
		while (minesPlaced < mines) {
			const row = Math.floor(Math.random() * rows);
			const col = Math.floor(Math.random() * cols);
			if (!newBoard[row][col].isMine) {
				newBoard[row][col].isMine = true;
				minesPlaced++;
			}
		}

		// Calculate neighbor mines
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				if (!newBoard[i][j].isMine) {
					let count = 0;
					for (let di = -1; di <= 1; di++) {
						for (let dj = -1; dj <= 1; dj++) {
							if (i + di >= 0 && i + di < rows && j + dj >= 0 && j + dj < cols) {
								if (newBoard[i + di][j + dj].isMine) count++;
							}
						}
					}
					newBoard[i][j].neighborMines = count;
				}
			}
		}

		setBoard(newBoard);
		setGameStatus("playing");
	};

	const handleCellClick = (row, col) => {
		if (gameStatus !== "playing") return;

		const newBoard = [...board];
		if (newBoard[row][col].isFlagged || newBoard[row][col].isRevealed) return;

		if (newBoard[row][col].isMine) {
			// Logic (end)
			revealAllMines(newBoard);
			setGameStatus("lost");
		} else {
			revealCell(newBoard, row, col);
			if (checkWin(newBoard)) {
				setGameStatus("won");
			}
		}

		setBoard(newBoard);
	};

	const handleFlagCell = (row, col) => {
		if (gameStatus !== "playing") return;

		const newBoard = [...board];
		if (newBoard[row][col].isRevealed) return;

		newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
		setBoard(newBoard);
		setMinesLeft(minesLeft + (newBoard[row][col].isFlagged ? -1 : 1));
	};

	const revealCell = (board, row, col) => {
		if (
			row < 0 ||
			row >= board.length ||
			col < 0 ||
			col >= board[0].length ||
			board[row][col].isRevealed ||
			board[row][col].isFlagged
		)
			return;

		board[row][col].isRevealed = true;

		if (board[row][col].neighborMines === 0) {
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					revealCell(board, row + i, col + j);
				}
			}
		}
	};

	const revealAllMines = (board) => {
		board.forEach((row) =>
			row.forEach((cell) => {
				if (cell.isMine) cell.isRevealed = true;
			})
		);
	};

	const checkWin = (board) => {
		return board.every((row) => row.every((cell) => cell.isMine || cell.isRevealed));
	};

	return (
		<div className={styles.game}>
			<div className={styles.controls}>
				<select onChange={(e) => setDifficultyLevel(e.target.value)}>
					<option value="easy">Easy</option>
					<option value="medium">Medium</option>
					<option value="hard">Hard</option>
				</select>
				<button onClick={initializeBoard}>New Game</button>
				<div>Mines left: {minesLeft}</div>
			</div>
			<Board board={board} onCellClick={handleCellClick} onFlagCell={handleFlagCell} />
			<div className={styles.status}>{gameStatus}</div>
		</div>
	);
};

export default Game;
