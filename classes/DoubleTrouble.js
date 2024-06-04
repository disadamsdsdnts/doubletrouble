import DoubleTroubleCard from './DoubleTroubleCard.js';

export default class DoubleTrouble {
	rows = 2;
	cols = 2;
	gameStatus = 'setup';
	boardStatus = [];
	clicks = 0;
	time = 0;
	timer = null;


	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
	}

	restart() {
		// Comprobar si hay un juego guardado
		let status = this.getGame();

		if (status) {
			let newBoardStatus = [];

			console.log('[restart] status', status)

			for (let i = 0; i < status.rows; i++) {
				newBoardStatus[i] = [];

				for (let j = 0; j < status.cols; j++) {
					let currentCard = new DoubleTroubleCard(i, j);

					currentCard.setVisible(status.boardStatus[i][j].visible);
					currentCard.setLocked(status.boardStatus[i][j].locked);
					currentCard.setColor(status.boardStatus[i][j].color);

					newBoardStatus[i][j] = currentCard;
				}
			}

			this.boardStatus = newBoardStatus;

			this.gameStatus = status.gameStatus;
			this.clicks = status.clicks;
			this.time = status.time;
			this.cols = status.cols;
			this.rows = status.rows;
		}

		this.startGame();
	}

	init() {
		// Actualizar los valores de las filas y columnas
		let gameCols = document.querySelector('#double-trouble #game-cols');
		this.updateCols(parseInt(gameCols.value));

		let gameRows = document.querySelector('#double-trouble #game-rows');
		this.updateRows(parseInt(gameRows.value));

		// Comprobar si el juego es válido
		if (!this.checkGame()) {
			return;
		}

		this.startGame();
	}

	updateRows(rows) {
		if (this.rows !== rows && rows > 1) {
			this.rows = rows;
		}
	}

	updateCols(cols) {
		if (this.cols !== cols && cols > 1) {
			this.cols = cols;
		}
	}

	checkGame() {
		if ((this.rows == 1 && this.cols == 2) || (this.rows == 2 && this.cols == 1)) {
			alert('¿En serio? Un juego de una pareja. ¡Eres el rey de la diversión!');
			return false;
		}

		if (this.rows == 1 && this.cols == 1) {
			alert('¿En serio? ¿Un juego de parejas con una sola carta? ¡Venga ya!');
			return false;
		}

		if (this.rows * this.cols % 2 !== 0) {
			alert('El juego tiene que tener un número par de cartas... ¡Esto es un juego de parejas! Aquí no vale traer de carabina a un amigo imaginario.');
			return false;
		}

		return true;
	}

	startGame() {
		this.gameStatus = 'playing';

		/* Creamos el tablero si no existe previamente */
		this.createBoard();

		/* Mostramos el tablero */
		this.showBoard();

		/* Mostramos las cartas durante unos segundos */
		this.updateScoreboard();

		setTimeout(() => {
			this.hideCards();

			/* Iniciar el temporizador */
			this.timer = setInterval(() => {
				this.time++;
				this.updateScoreboard();
				this.saveGame();
			}, 1000);

		}, 2000);
	}

	resetGame() {
		this.boardStatus = [];
		this.gameStatus = 'setup';

		// Eliminar el tablero
		let board = document.querySelector('#double-trouble #board');

		if (board) {
			board.remove();
		}

		let scoreboard = document.querySelector('#double-trouble #scoreboard');

		if (scoreboard) {
			scoreboard.remove();
		}

		// Reiniciar el temporizador
		clearInterval(this.timer);

		// Reiniciar el contador de clicks
		this.clicks = 0;

		// Reiniciar el contador de tiempo
		this.time = 0;

		//

		this.showSetup();
	}

	createBoard() {
		let board = document.querySelector('#double-trouble #board');

		if (!board) {
			let board = document.createElement('div');
			board.id = 'board';
			board.classList.add('c-board');

			board.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
			board.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;

			// Añadir el tablero después del setup
			document.querySelector('#double-trouble #setup').insertAdjacentElement('afterend', board);
		}

		// Generar los colores
		let colors = this.generateColors();

		// Duplicar los colores
		colors = [...colors, ...colors];

		// Barajar los colores
		colors.sort(() => Math.random() - 0.5);

		// Crear las cartas
		for (let i = 0; i < this.rows; i++) {
			this.boardStatus[i] = [];

			for (let j = 0; j < this.cols; j++) {
				let currentCard = new DoubleTroubleCard(i, j);
				let color = colors[i * this.cols + j];
				currentCard.setColor(color);

				let card = document.createElement('div');
				card.classList.add('c-card');
				card.dataset.row = currentCard.getRow();
				card.dataset.col = currentCard.getCol();
				card.style.backgroundColor = currentCard.getColor();
				card.dataset.visible = currentCard.getVisible();
				card.dataset.locked = currentCard.getLocked();

				// add two divs to the card
				let front = document.createElement('div');
				front.classList.add('c-card__front');
				card.appendChild(front);

				let back = document.createElement('div');
				back.classList.add('c-card__back');
				card.appendChild(back);

				card.addEventListener('click', ev => {
					this.countClick();

					if (ev.target.classList.contains('c-card')) {
						console.log('[createBoard] card clicked', ev.target)
						this.flipCard(ev.target);
					} else {
						console.log('[createBoard] card clicked', ev.target.closest('.c-card'))
						this.flipCard(ev.target.closest('.c-card'));
					}
				});

				document.querySelector('#double-trouble #board').appendChild(card);

				this.boardStatus[i][j] = currentCard
			}
		}
	}

	updateScoreboard() {
		let clicks = this.clicks;
		let remaining = this.boardStatus.flat().filter(card => !card.getLocked()).length / 2;


		if (!document.querySelector('#double-trouble #scoreboard')) {
			let score = /* html */`
					<div class="c-score" id="scoreboard">
						<div class="c-score__item">
							<div class="c-score__time">
								Tiempo: <span id="time">${this.getTimestap()}</span>
							</div>
						</div>

						<div class="c-score__item">
							<div class="c-score__clicks">
								Clicks: <span id="clicks">${clicks}</span>
							</div>
						</div>

						<div class="c-score__item">
							<div class="c-score__remaining">
								Quedan: <span id="remaining">${remaining}</span>
							</div>
						</div>

						<div class="c-score__item">
							<button id="js-restart-game">Reiniciar</button>
						</div>
					</div>
				`;


			// Añadir antes del tablero
			document.querySelector('#double-trouble #board').insertAdjacentHTML('beforebegin', score);

			// Añadir evento al botón de reiniciar
			document.querySelector('#double-trouble #js-restart-game').addEventListener('click', ev => {
				this.resetGame();
			});
		} else {
			document.querySelector('#double-trouble #time').innerText = this.getTimestap();
			document.querySelector('#double-trouble #clicks').innerText = clicks;
			document.querySelector('#double-trouble #remaining').innerText = remaining;
		}

	}

	flipCard(card) {
		// Obtenemos los valores de la carta actual
		let row = parseInt(card.dataset.row);
		let col = parseInt(card.dataset.col);

		// Comprobamos si la carta está bloqueada
		if (this.boardStatus[row][col].getLocked()) {
			return;
		}

		// Comprobamos si la carta está visible o no
		if (this.boardStatus[row][col].getVisible()) {
			this.boardStatus[row][col].setVisible(false);
		} else {
			this.boardStatus[row][col].setVisible(true);
		}

		// Comprobamos si hay dos cartas visibles
		let visibleCards = this.boardStatus.flat().filter(card => card.getVisible() && !card.getLocked());

		// Si hay dos cartas visibles, comprobamos si son iguales
		if (visibleCards.length === 2) {
			const [card1, card2] = visibleCards;

			if (card1.getColor() === card2.getColor()) {
				card1.setLocked(true);
				card2.setLocked(true);
			} else {
				setTimeout(() => {
					card1.setVisible(false);
					card2.setVisible(false);
					this.updateBoard();
				}, 1000);
			}
		}

		this.updateBoard();

		// Comprobamos si todas las cartas están bloqueadas para ver si el juego ha terminado
		let lockedCards = this.boardStatus.flat().filter(card => card.getLocked());

		if (lockedCards.length === this.rows * this.cols) {
			alert('¡Enhorabuena! Has encontrado todas las parejas');

			let name = prompt('¿Cuál es tu nombre?');

			if (name) {
				alert(`¡Enhorabuena, ${name}! Has encontrado todas las parejas`);
			}

			this.resetGame();
		}
	}

	updateBoard() {
		this.boardStatus.forEach(row => {
			row.forEach(card => {
				let cardEl = document.querySelector(`#double-trouble #board .c-card[data-row="${card.getRow()}"][data-col="${card.getCol()}"]`);

				if (card.getVisible()) {
					cardEl.classList.add('active');
				} else {
					cardEl.classList.remove('active');
				}
			});
		});
	}

	showBoard() {
		document.querySelector('#double-trouble #setup').classList.add('hidden');
		document.querySelector('#double-trouble #board').classList.remove('hidden');
	}

	showSetup() {
		if (document.querySelector('#double-trouble #setup')) {
			document.querySelector('#double-trouble #setup').classList.remove('hidden');
		}

		if (document.querySelector('#double-trouble #board')) {
			document.querySelector('#double-trouble #board').classList.add('hidden');
		}
	}

	generateColors() {
		let colors = new Set();

		while (colors.size < this.rows * this.cols / 2) {
			let color = this.getRandomColor();
			colors.add(color);
		}

		console.log('[generateColors] colors', colors)
		return colors;
	}

	getRandomColor() {
		// Hex
		let letters = '0123456789ABCDEF';
		let color = '#';

		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}

		return color;
	}

	hideCards() {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.boardStatus[i][j].setVisible(false);
			}
		}

		this.updateBoard();
	}

	getTimestap() {
		let date = new Date(this.time * 1000);

		var hh = date.getUTCHours();
		var mm = date.getUTCMinutes();
		var ss = date.getSeconds();

		if (hh < 10) { hh = "0" + hh; }
		if (mm < 10) { mm = "0" + mm; }
		if (ss < 10) { ss = "0" + ss; }

		// This formats your string to HH:MM:SS
		var t = hh + ":" + mm + ":" + ss;

		return t;
	}

	countClick() {
		this.clicks += 1
	}

	saveGame() {
		localStorage.setItem('double-trouble', JSON.stringify({
			rows: this.rows,
			cols: this.cols,
			boardStatus: this.boardStatus,
			clicks: this.clicks,
			time: this.time
		}));
	}

	deleteGame() {
		localStorage.removeItem('double-trouble');
	}

	getGame() {
		return JSON.parse(localStorage.getItem('double-trouble'));
	}
}
