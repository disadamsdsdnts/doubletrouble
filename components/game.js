import DoubleTrouble from '../classes/DoubleTrouble.js';

export function main() {
	document.addEventListener('DOMContentLoaded', ev => {
		let buttonStart = document.querySelector('#double-trouble #js-init-game');

		if (!buttonStart) {
			alert('El juego no ha cargado correctamente. Por favor, recarga la página.');
		}

		if (localStorage.getItem('double-trouble')) {
			let savedGame = JSON.parse(localStorage.getItem('double-trouble'));

			let DoubleTroubleGame = new DoubleTrouble(savedGame.rows, savedGame.cols);

			DoubleTroubleGame.restart();
		}

		buttonStart.addEventListener('click', ev => {
			ev.preventDefault();

			let rows = parseInt(document.querySelector('#double-trouble #game-rows').value);
			let cols = parseInt(document.querySelector('#double-trouble #game-cols').value);

			var DoubleTroubleGame = new DoubleTrouble(rows, cols);

			DoubleTroubleGame.init();
		});
	})
}
