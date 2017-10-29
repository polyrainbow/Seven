var constants = require("../constants.js");

const loadState = (state) => {
	return {
		type: "LOAD_STATE",
		state
	}
}


const setPreset = (preset_index) => {
	return {
		type: "SET_PRESET",
		preset_index
	}
}


const setVisualizationMode = (visualization_mode) => {
	return {
		type: "SET_VISUALIZATION_MODE",
		visualization_mode
	}
}


module.exports = {
	loadState,
	setPreset,
	setVisualizationMode
}
