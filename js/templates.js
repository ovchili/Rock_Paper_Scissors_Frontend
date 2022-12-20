const app = document.querySelector(".app");
const backURL = "https://skypro-rock-scissors-paper.herokuapp.com";

function clear() {
	if (application.timers.length > 0) {
		application.timers.forEach((timer) => clearInterval(timer));
		application.timers = [];
	}
}
export function templateBlockLogin(container) {
	const form = document.createElement("form");
	form.classList.add("form__login");
	const formControl = document.createElement("div");
	formControl.classList.add("form__control");
	form.appendChild(formControl);
	const formBtnBox = document.createElement("div");
	formBtnBox.classList.add("form__control");
	form.appendChild(formBtnBox);
	const input = document.createElement("input");
	input.placeholder = "Введите логин";
	input.type = "text";
	input.classList.add("form__input");
	formControl.appendChild(input);
	const btn = document.createElement("button");
	btn.textContent = "Войти";
	btn.classList.add("btn", "btn__login");
	formBtnBox.appendChild(btn);
	container.appendChild(form);

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		if (!input.value) {
			input.classList.add("form__input_error");
			return;
		}
		input.classList.remove("form__input_error");
		fetch(`${backURL}/login?login=${input.value}`)
			.then((res) => res.json())
			.then((result) => {
				localStorage.setItem("token", result.token);
				application.token = result.token;
				return fetch(`${backURL}/player-status?token=${application.token}`);
			})
			.then((res) => res.json())
			.then((result) => {
				if (result["player-status"].status === "lobby") {
					application.renderScreen("lobby");
				} else {
					application.idGame = result["player-status"].game.id;
					application.renderScreen("game");
				}
			});
	});
}

export function templateLoginPage() {
	app.textContent = "";
	application.renderBlock("blockLogin", app);
}

export function templateLobbyPage() {
	clear();
	app.textContent = "";

	const listPlayer = document.createElement("ul");
	listPlayer.classList.add("player__list");
	const playGame = document.createElement("div");
	playGame.classList.add("button__list");
	templateLobbyBlock(listPlayer);
	application.timers.push(
		setInterval(() => {
			templateLobbyBlock(listPlayer);
		}, 1000)
	);
	const buttonPlay = document.createElement("button");
	buttonPlay.textContent = "Играть";
	buttonPlay.classList.add("btn", "btn__play");
	buttonPlay.addEventListener("click", () => {
		fetch(`${backURL}/start?token=${application.token}`)
			.then((res) => res.json())
			.then((result) => {
				localStorage.setItem("idGame", result["player-status"].game.id);
				application.idGame = result["player-status"].game.id;
				application.renderScreen("game");
			});
	});
	playGame.appendChild(buttonPlay);

	app.appendChild(listPlayer);
	app.appendChild(playGame);
}

export function templateLobbyBlock(container) {
	fetch(`${backURL}/player-list?token=${application.token}`)
		.then((res) => res.json())
		.then((result) => {
			const players = result.list;
			container.textContent = "";
			for (const player of players) {
				const login = document.createElement("li");
				if (player.you) {
					login.classList.add("player__you");
				}
				login.classList.add("player");
				login.textContent = player.you ? `Вы: ${player.login}` : player.login;
				container.appendChild(login);
			}
		});
}
export function templateGamePage() {
	clear();
	app.textContent = "";
	application.timers.push(
		setInterval(() => {
			fetch(
				`${backURL}/game-status?token=${application.token}&id=${application.idGame}`
			)
				.then((res) => res.json())
				.then((result) => {
					if (result["game-status"].status === "waiting-for-start") {
						app.textContent = "";
						application.renderBlock("waitingBlock", app, "Ожидаем соперника");
					} else if (result["game-status"].status === "waiting-for-your-move") {
						app.textContent = "";
						application.renderBlock("gameBlock", app);
					} else if (
						result["game-status"].status === "waiting-for-enemy-move"
					) {
						app.textContent = "";
						application.renderBlock(
							"waitingBlock",
							app,
							"Ожидаем хода соперника"
						);
					} else if (result["game-status"].status === "win") {
						app.textContent = "";
						application.renderBlock("endGame", app, "win");
					} else if (result["game-status"].status === "lose") {
						app.textContent = "";
						application.renderBlock("endGame", app, "lose");
					}
				});
		}, 1000)
	);
}

export function templateGameWaiting(container, info) {
	const spinner =
		document.querySelector(".spinner") || document.createElement("div");
	container.appendChild(spinner);
	spinner.classList.add("spinner");

	const spinnerAnimation =
		document.querySelector(".spinner__animation") ||
		document.createElement("span");
	spinnerAnimation.classList.add("spinner__animation");
	const spinnerInfo =
		document.querySelector(".spinner__info") || document.createElement("span");
	spinnerInfo.classList.add("spinner__info");
	spinnerInfo.textContent = info;
	spinner.appendChild(spinnerAnimation);
	spinner.appendChild(spinnerInfo);
}
export function templateGameBlock(container) {
	const block =
		document.querySelector(".block") || document.createElement("div");
	block.classList.add("block");
	application.renderBlock("button", block, "rock", "Камень");
	application.renderBlock("button", block, "paper", "Бумага");
	application.renderBlock("button", block, "scissors", "Ножницы");

	container.appendChild(block);
}

export function templateBlockButton(container, move, moveRus) {
	const blockRock =
		document.querySelector(`.block__${move}`) ||
		document.createElement("button");
	blockRock.classList.add(`block__${move}`);
	blockRock.textContent = `${moveRus}`;
	blockRock.addEventListener("click", () => {
		fetch(
			`${backURL}/play?token=${application.token}&id=${application.idGame}&move=${move}`
		);
	});
	container.appendChild(blockRock);
}

export function templateEndGame(container, status) {
	const win = status === "win";
	const imgBlock =
		document.querySelector(".img__block") || document.createElement("div");
	imgBlock.classList.add("img__block");
	container.appendChild(imgBlock);
	const img = document.querySelector(".img") || document.createElement("img");
	img.classList.add("img");
	img.src = win ? "../img/win.png" : "../img/lose.png";
	imgBlock.appendChild(img);

	const buttonBlock =
		document.querySelector(".button__block") || document.createElement("div");
	buttonBlock.classList.add("button__block");
	application.renderBlock("buttons", buttonBlock, "lobby");
	application.renderBlock("buttons", buttonBlock, "play");
	container.appendChild(buttonBlock);
}

export function templateButtons(container, status) {
	const lobbyStatus = status === "lobby";
	const lobby =
		document.querySelector(`.button__${status}`) ||
		document.createElement("button");
	lobby.textContent = lobbyStatus ? "В лобби" : "Играть ещё";
	lobby.classList.add("button", `button__${status}`);
	container.appendChild(lobby);

	lobby.addEventListener("click", () => {
		if (lobbyStatus) {
			application.idGame = "";
			localStorage.removeItem("idGame");
			application.renderScreen("lobby");
			return;
		}
		fetch(`${backURL}/start?token=${application.token}`)
			.then((res) => res.json())
			.then((result) => {
				localStorage.setItem("idGame", result["player-status"].game.id);
				application.idGame = result["player-status"].game.id;
				application.renderScreen("game");
			});
	});
}
