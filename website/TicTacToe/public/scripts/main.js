var rhit = rhit || {};

rhit.PageController = class {
	constructor() {
		this.game = new rhit.Game();
		const squares = document.querySelectorAll(".square");
		for (const square of squares){
			square.onclick = (event) => {
				const buttonIndex = parseInt(square.dataset.buttonIndex);
				this.game.pressedButtonAtIndex(buttonIndex);
				this.updateView();
			}
		}

		document.querySelector("#newGameButton").onclick = (event) =>{
			this.game = new rhit.Game();
			this.updateView();
		}

		this.updateView();
	}

	updateView() {
		const squares = document.querySelectorAll(".square");
		for (let k = 0; k < 9; k++){
			squares[k].innerHTML = this.game.getMarkAtIndex(k);
		}
		document.querySelector("#gameStateText").innerHTML = this.game.getState();
	}
}

rhit.Game = class {

	static Mark = {
		X: "X",
		O: "O",
		NONE: " "
	}

	static State = {
		X_TURN: "X's Turn",
		O_TURN: "O's Turn",
		X_WIN: "X Wins!",
		O_WIN: "O Wins!",
		TIE: "Tie Game"
	}

	constructor() {
		this.board = [];
		this.state = rhit.Game.State.X_TURN;
		for (let k = 0; k < 9; k++){
			this.board.push(rhit.Game.Mark.NONE);
		}
		// console.log('this.board :>> ', this.board);
		// console.log('this.state :>> ', this.state);
	}

	pressedButtonAtIndex(buttonIndex) {
		// this.board[buttonIndex] = rhit.Game.Mark.X;
		if (this.state == rhit.Game.State.X_WIN || 
			this.state == rhit.Game.State.O_WIN ||
			this.state == rhit.Game.State.TIE){
			return;
		}
		if (this.board[buttonIndex] != rhit.Game.Mark.NONE){
			return;
		}
		if (this.state == rhit.Game.State.X_TURN){
			this.board[buttonIndex] = rhit.Game.Mark.X;
			this.state = rhit.Game.State.O_TURN;
		}else{
			this.board[buttonIndex] = rhit.Game.Mark.O;
			this.state = rhit.Game.State.X_TURN;
		}
		this._checkForGameOver();
	}

	_checkForGameOver(){
		// Check for Tie
		if (!this.board.includes(rhit.Game.Mark.NONE)){
			this.state = rhit.Game.State.TIE;
		}

		// Check for Win
		const linesOf3 = [];{
			linesOf3.push(this.board[0] + this.board[1] + this.board[2]);
			linesOf3.push(this.board[3] + this.board[4] + this.board[5]);
			linesOf3.push(this.board[6] + this.board[7] + this.board[8]);

			linesOf3.push(this.board[0] + this.board[3] + this.board[6]);
			linesOf3.push(this.board[1] + this.board[4] + this.board[7]);
			linesOf3.push(this.board[2] + this.board[5] + this.board[8]);

			linesOf3.push(this.board[0] + this.board[4] + this.board[8]);
			linesOf3.push(this.board[2] + this.board[4] + this.board[6]);

			for (const lineOf3 of linesOf3){
				if(lineOf3 == "XXX"){
					this.state = rhit.Game.State.X_WIN;
				}else if(lineOf3 == "OOO"){
					this.state = rhit.Game.State.O_WIN;
				}
			}
		}
	}

	getMarkAtIndex(buttonIndex){
		return this.board[buttonIndex];
	}

	getState(){
		return this.state;
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	new rhit.PageController();
};

rhit.main();
