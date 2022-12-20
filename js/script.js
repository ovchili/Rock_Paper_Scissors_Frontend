import {
	templateBlockLogin,
	templateLoginPage,
	templateLobbyPage,
	templateLobbyBlock,
	templateGamePage,
	templateGameWaiting,
	templateGameBlock,
	templateBlockButton,
	templateEndGame,
	templateButtons,
} from "./templates.js";
window.application = {
	blocks: {},
	screens: {},
	renderScreen: function (screenName) {
		if (!(screenName in application.screens)) {
			console.log("Такого экрана нет");
			return;
		}
		application.screens[`${screenName}`]();
	},
	renderBlock: function (blockName, container, ...args) {
		if (!(blockName in application.blocks)) {
			console.log("Такого блока нет");
			return;
		}
		application.blocks[`${blockName}`](container, ...args);
	},
	timers: [],
	token: localStorage.getItem("token"),
	idGame: localStorage.getItem("idGame"),
};

application.screens["login"] = templateLoginPage;
application.blocks["blockLogin"] = templateBlockLogin;
application.blocks["playerList"] = templateLobbyBlock;
application.screens["lobby"] = templateLobbyPage;
application.screens["game"] = templateGamePage;
application.blocks["waitingBlock"] = templateGameWaiting;
application.blocks["gameBlock"] = templateGameBlock;
application.blocks["button"] = templateBlockButton;
application.blocks["endGame"] = templateEndGame;
application.blocks["buttons"] = templateButtons;

const syncronToken = () => {
	const token = localStorage.getItem("token");
	fetch(
		`https://skypro-rock-scissors-paper.herokuapp.com/player-status?token=${token}`
	)
		.then((res) => res.json())
		.then((result) => {
			if (result.status !== "error") {
				application.token = token;
				localStorage.setItem("token", token);
				if (result["player-status"].status === "game") {
					application.idGame = result["player-status"].game.id;
					localStorage.setItem("idGame", result["player-status"].game.id);
				}
				return;
			}
			localStorage.removeItem("token");
			localStorage.removeItem("idGame");
			application.token = application.idGame = "";
		});
};

window.addEventListener("DOMContentLoaded", () => {
	syncronToken();
	if (!application.token) {
		application.renderScreen("login");
		return;
	}
	if (!application.idGame) {
		application.renderScreen("lobby");
		return;
	}
	application.renderScreen("game");
});
