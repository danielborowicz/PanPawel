import React from "react";
import Game from "./components/Game";
import styles from "./App.module.css";

function App() {
	return (
		<div className={styles.app}>
			<h1>Minesweeper</h1>
			<Game />
		</div>
	);
}

export default App;
