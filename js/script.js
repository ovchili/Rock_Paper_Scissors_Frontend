const backURL = "https://skypro-rock-scissors-paper.herokuapp.com";
import {} from "templates.js";
window.application = {
	blocks: {},
	screens: {},
	renderScreen: function (screenName) {
		window.application.screens[`${screenName}`]();
	},
	renderBlock: function (blockName, container) {
		window.application.blocks[`${blockName}`](container);
	},
	timers: [],
	token: "",
	idGame: "",
};
