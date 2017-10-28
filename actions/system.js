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


module.exports = {
	loadState,
	setPreset,
}
