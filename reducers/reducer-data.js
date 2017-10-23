var constants = require('../constants.js');
var moment = require("moment");
var computeStateVariables = require("./computeStateVariables.js")
var presets = require("./presets.js");
var uuidv4 = require("uuid/v4");
var updateLegacyState = require("./updateLegacyState.js");

const initialState = {
	paths: [],
	earliestDateOfRef2: null,
	latestDateOfRef2: null,
	RS1duration: 0,
	RS2duration: 0,
	universes: [],
	active_universe_index: 0
};


export default function reducer(state=initialState, action){

	if (action.type == "DELETE_PATH"){
		var newState = {...state};
		newState.paths = newState.paths.filter(p => p.id !== action.path_id);
		return newState;
	}

	if (action.type == "ADD_PATH"){
		var newState = {...state};

		var newPath = {
			id: uuidv4(),
			startTime: null,
			endTime: null,
			dilationFactor: 1,
			universe_index: 0,
			durationInRS1: 0,
			description: "",
			isInactive: false
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


	if (action.type == "SET_PATH_ACTIVITY"){
		var newState = {...state};
		var path = newState.paths.find(p => p.id === action.path_id);
		path.isInactive = action.isInactive;
		return newState;
	}


	if (action.type == "SET_TIME_DILATION_FACTOR"){
		var newState = {...state};
		var path = newState.paths.find(p => p.id === action.path_id);
		path.dilationFactor = action.factor;
		computeStateVariables(path, newState);
		return newState;
	}


	if (action.type == "SET_PATH_DESCRIPTION"){
		var newState = {...state};
		var path = newState.paths.find(p => p.id === action.path_id);
		path.description = action.description;
		newState.active_universe_index = newState.universes.findIndex(u => u.id === path.universe_id);
		return newState;
	}


	if (action.type == "SET_UNIVERSE_NAME"){
		var newState = {...state};
		var universe = newState.universes.find(u => u.id === action.universe_id);
		universe.name = action.name;
		newState.active_universe_index = newState.universes.findIndex(u => u.id === action.universe_id);
		return newState;
	}


	if (action.type == "ADD_UNIVERSE"){
		var newState = {...state};
		newState.id_counter++;

		var newUniverse = {
			id: uuidv4(),
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

		newState.active_universe_index = action.insertIndex;

		return newState;
	}


	if (action.type == "DELETE_UNIVERSE"){
		var newState = {...state}; console.log(action.universe_id)
		newState.universes = newState.universes.filter(u => u.id !== action.universe_id);
		if (newState.active_universe_index >= newState.universes.length){
			newState.active_universe_index = 0;
		}
		return newState;
	}


	if (action.type == "SET_UNIVERSE"){
		var newState = {...state};
		var universe_index = newState.universes.findIndex(u => u.id === action.universe_id);
		newState.active_universe_index = universe_index;
		return newState;
	}


	if (action.type == "LOAD_STATE"){
		var data = action.state.data;
		var data = updateLegacyState(data);
		return data;
	}


	if (action.type == "SET_PRESET"){
		return presets[action.preset_index].data;
	}


	else {
		return state;
	}
};
