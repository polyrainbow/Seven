var constants = require("../constants.js");

const addUniverse = (insertIndex) => {
	return {
		type: "ADD_UNIVERSE",
		insertIndex
	}
}

const deleteUniverse = (universe_id) => {
	return {
		type: "DELETE_UNIVERSE",
		universe_id
	}
}


const setUniverseName = (universe_id, name) => {
	return {
		type: "SET_UNIVERSE_NAME",
		universe_id,
		name
	}
}


const setActiveUniverse = (universe_id) => {
	return {
		type: "SET_ACTIVE_UNIVERSE",
		universe_id
	}
}


const setUniverseCreationType = (universe_id, isCreatedAtFirstEntering) => {
	return {
		type: "SET_UNIVERSE_CREATION_TYPE",
		universe_id,
		isCreatedAtFirstEntering
	}
}


module.exports = {
	addUniverse,
	deleteUniverse,
	setUniverseName,
	setActiveUniverse,
	setUniverseCreationType
}
