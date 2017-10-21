var constants = require("../constants.js");

const addPath = (insertIndex) => {
	return {
		type: "ADD_PATH",
		insertIndex
	}
}

const deletePath = (path_id) => {
	return {
		type: "DELETE_PATH",
		path_id
	}
}

const setPathStartTime = (path_id, startTime) => {
	return {
		type: "SET_PATH_START_TIME",
		path_id,
		startTime
	}
}

const setPathEndTime = (path_id, endTime) => {
	return {
		type: "SET_PATH_END_TIME",
		path_id,
		endTime
	}
}


const setTimeDilationFactor = (path_id, factor) => {
	return {
		type: "SET_TIME_DILATION_FACTOR",
		path_id,
		factor
	}
}


const addUniverse = (insertIndex) => {
	return {
		type: "ADD_UNIVERSE",
		insertIndex
	}
}

const deleteUniverse = (universe_id) => {
	return {
		type: "DELETE_UNIVERSE",
		path_id
	}
}

const setUniverseName = (universe_id, name) => {
	return {
		type: "SET_UNIVERSE_NAME",
		universe_id,
		name
	}
}

module.exports = {
	addPath,
	deletePath,
	setPathStartTime,
	setPathEndTime,
	setTimeDilationFactor,
	addUniverse,
	deleteUniverse,
	setUniverseName
}
