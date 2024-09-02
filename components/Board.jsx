import React from "react";
import Cell from "./Cell";
import styles from "./styles/Board.module.css";

const Board = ({ board, onCellClick, onFlagCell }) => {
	return (
		<div className={styles.board}>
			{board.map((row, rowIndex) => (
				<div key={rowIndex} className={styles.row}>
					{row.map((cell, colIndex) => (
						<Cell
							key={`${rowIndex}-${colIndex}`}
							cell={cell}
							onClick={() => onCellClick(rowIndex, colIndex)}
							onContextMenu={(e) => {
								e.preventDefault();
								onFlagCell(rowIndex, colIndex);
							}}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default Board;
