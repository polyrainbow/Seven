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


const setPathName = (path_id, name) => {
	return {
		type: "SET_PATH_NAME",
		path_id,
		name
	}
}


const setPathDescription = (path_id, description) => {
	return {
		type: "SET_PATH_DESCRIPTION",
		path_id,
		description
	}
}


module.exports = {
	addPath,
	deletePath,
	setPathName,
	setPathDescription
}
