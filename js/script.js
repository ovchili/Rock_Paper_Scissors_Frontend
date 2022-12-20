import {
	templateBlockLogin,
	templateLoginPage,
	templateLobbyPage,
	templateLobbyBlock,
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
	renderBlock: function (blockName, container) {
		if (!(blockName in application.blocks)) {
			console.log("Такого блока нет");
			return;
		}
		application.blocks[`${blockName}`](container);
	},
	timers: [],
	token: localStorage.getItem("token"),
	idGame: localStorage.getItem("idGame"),
};

application.screens["login"] = templateLoginPage;
application.blocks["blockLogin"] = templateBlockLogin;
application.blocks["playerList"] = templateLobbyBlock;
application.screens["lobby"] = templateLobbyPage;
window.addEventListener("DOMContentLoaded", () => {
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
