const app = document.querySelector(".app");
const backURL = "https://skypro-rock-scissors-paper.herokuapp.com";
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
				const player_status = result.playerstatus;
				if (result["player-status"].status === "lobby") {
					application.renderScreen("lobby");
				} else {
					application.idGame = result.game.id;
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
	application.timer = [];
	app.textContent = "";

	const listPlayer = document.createElement("div");
	const playGame = document.createElement("div");

	const buttonPlay = document.createElement("button");
	buttonPlay.textContent = "Играть";
	buttonPlay.classList.add("btn", "btn__play");
	playGame.appendChild(buttonPlay);

	app.appendChild(listPlayer);
	app.appendChild(playGame);
}

export function templateLobbyBlock(container) {
	fetch(`${backURL}/player-list?token=${application.token}`)
		.then((res) => res.json())
		.then((result) => {});
}
