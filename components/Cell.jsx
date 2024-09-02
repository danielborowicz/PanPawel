import React from "react";
import styles from "./styles/Cell.module.css";

const Cell = ({ cell, onClick, onContextMenu }) => {
	let cellContent = "";
	let cellClass = styles.cell;

	if (cell.isRevealed) {
		cellClass += ` ${styles.revealed}`;
		if (cell.isMine) {
			cellContent = "💣";
		} else if (cell.neighborMines > 0) {
			cellContent = cell.neighborMines;
		}
	} else if (cell.isFlagged) {
		cellContent = "🚩";
	}

	return (
		<div className={cellClass} onClick={onClick} onContextMenu={onContextMenu}>
			{cellContent}
		</div>
	);
};

export default Cell;
