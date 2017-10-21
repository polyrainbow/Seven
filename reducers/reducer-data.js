var constants = require('../constants.js');
var moment = require("moment");
var computeStateVariables = require("./computeStateVariables.js")

const initialState = {
	paths: [],
	id_counter: 0,
	earliestDateOfRef2: null,
	latestDateOfRef2: null,
	RS1duration: 0,
	RS2duration: 0,
	universes: []
};


export default function reducer(state=initialState, action){

	if (action.type == "DELETE_PATH"){
		var newState = {...state};
		newState.paths = newState.paths.filter(p => p.id !== action.path_id);
		return newState;
	}

	if (action.type == "ADD_PATH"){
		var newState = {...state};
		newState.id_counter++;

		var newPath = {
			id: newState.id_counter,
			startTime: 0,
			endTime: 0,
			dilationFactor: 1,
			universe_index: 0,
			durationInRS1: 0
		};
		console.log(action.insertIndex)

		if (action.insertIndex === newState.paths.length){
			newState.paths.push(newPath);
		} else if (action.insertIndex < newState.paths.length){
			newState.paths = immutableSplice(newState.paths, action.insertIndex, 0, newPath);
		} else {
			console.log("Strange insert index: " + action.insertIndex)
		}
		return newState;
	}

	if (action.type == "SET_PATH_START_TIME"){
		var newState = {...state};
		var path = newState.paths.find(p => p.id === action.path_id);
		path.startTime = action.startTime;
		computeStateVariables(path, newState);
		return newState;
	}

	if (action.type == "SET_PATH_END_TIME"){
		var newState = {...state};
		var path = newState.paths.find(p => p.id === action.path_id);
		path.endTime = action.endTime;
		computeStateVariables(path, newState);
		return newState;
	}

	if (action.type == "SET_TIME_DILATION_FACTOR"){
		var newState = {...state};
		var path = newState.paths.find(p => p.id === action.path_id);
		path.dilationFactor = action.factor;
		computeStateVariables(path, newState);
		return newState;
	}

	if (action.type == "SET_UNIVERSE_NAME"){
		var newState = {...state};
		var universe = newState.universes.find(u => u.id === action.universe_id);
		universe.name = action.name;
		return newState;
	}


	if (action.type == "ADD_UNIVERSE"){
		var newState = {...state};
		newState.id_counter++;

		var newUniverse = {
			id: newState.id_counter,
			name: "",
			description: ""
		};

		if (action.insertIndex === newState.universes.length){
			newState.universes.push(newUniverse);
		} else if (action.insertIndex < newState.universes.length){
			newState.universes = immutableSplice(newState.universes, action.insertIndex, 0, newUniverse);
		} else {
			console.log("Strange insert index: " + action.insertIndex);
		}
		return newState;
	}


	if (action.type == "DELETE_UNIVERSE"){
		var newState = {...state}; console.log(action.universe_id)
		newState.universes = newState.universes.filter(u => u.id !== action.universe_id);
		return newState;
	}


	else {
		return state;
	}
};
