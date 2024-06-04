export default class DoubleTroubleCard {
	visible = false;
	locked = false;
	color = '';

	row = 0;
	col = 0;

	constructor(row, col) {
		this.row = row;
		this.col = col;
	}

	// Getters
	getActive() {
		return this.active;
	}

	getVisible() {
		return this.visible;
	}

	getLocked() {
		return this.locked;
	}

	getRow() {
		return this.row;
	}

	getCol() {
		return this.col;
	}

	getColor() {
		return this.color;
	}

	// Setters
	setCol(col) {
		if (this.col !== col) {
			this.col = col;
		}
	}

	setRow(row) {
		if (this.row !== row) {
			this.row = row;
		}
	}

	setPosition(row, col) {
		this.setRow(row);
		this.setCol(col);
	}

	setColor(color) {
		this.color = color;
	}

	setActive(active) {
		this.active = active;
	}

	setVisible(visible) {
		this.visible = visible;
	}

	setLocked(locked) {
		this.locked = locked;
	}

	// Functions
	toggleActive() {
		this.active = !this.active;
	}

	toggleVisible() {
		this.visible = !this.visible;
	}

	toggleLocked() {
		this.locked = !this.locked;
	}
}
