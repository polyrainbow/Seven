var constants = require('../constants.js');
var moment = require("moment");
var computeStateVariables = require("./computeStateVariables.js")
var presets = require("../presets/");
var uuidv4 = require("uuid/v4");

var getSpan = (state, span_id) => {
	for (var p = 0; p < state.paths.length; p++){
		var path = state.paths[p];
		for (var s = 0; s < path.spans.length; s++){
			var span = path.spans[s];
			if (span.id === span_id){
				return span;
			}
		}
	}
}

const initialState = {
	paths: [],
	universes: [],
	active_universe_id: null,
	active_path_id: null,
	visualization_mode: "3D Universes"
};


export default function reducer(state=initialState, action){

	if (action.type === "DELETE_SPAN"){
		var newState = {...state};
		newState.paths.forEach(p => {
			p.spans = p.spans.filter(s => s.id !== action.span_id);
		});
		computeStateVariables(newState);
		return newState;
	}

	if (action.type === "DELETE_PATH"){
		var newState = {...state};
		newState.paths = newState.paths.filter(p => p.id !== action.path_id);
		computeStateVariables(newState);
		return newState;
	}

	if (action.type === "ADD_PATH"){
		var newState = {...state};

		var newPath = {
			id: uuidv4(),
			name: "",
			description: "",
			RS1duration: 0,
			spans: []
		};


		if (action.insertIndex === newState.paths.length){
			newState.paths.push(newPath);
		} else if (action.insertIndex < newState.paths.length){
			newState.paths = immutableSplice(newState.paths, action.insertIndex, 0, newPath);
		} else {
			console.log("Strange insert index: " + action.insertIndex)
		}

		newState.active_path_id = newPath.id;

		return newState;

	}


	if (action.type === "SET_ACTIVE_PATH"){
		var newState = {...state};
		newState.active_path_id = action.path_id;
		return newState;
	}


	if (action.type === "SET_PATH_NAME"){
		var newState = {...state};
		var path = newState.paths.find(p => p.id === action.path_id);
		path.name = action.name;
		newState.active_path_id = path.id;
		return newState;
	}


	if (action.type === "ADD_SPAN"){
		var newState = {...state};

		var newSpan = {
			id: uuidv4(),
			startTime: null,
			endTime: null,
			dilationFactor: 1,
			universe_id: newState.universes[0].id,
			durationInRS1: 0,
			description: "",
			isInactive: false
		};

		var path = newState.paths.find(p => p.id === action.path_id);

		if (action.insertIndex === path.spans.length){
			path.spans.push(newSpan);
		} else if (action.insertIndex < path.spans.length){
			path.spans = immutableSplice(path.spans, action.insertIndex, 0, newSpan);
		} else {
			console.log("Strange insert index: " + action.insertIndex)
		}
		return newState;
	}


	if (action.type === "SET_SPAN_START_TIME"){
		var newState = {...state};
		var span = getSpan(newState, action.span_id);
		span.startTime = action.startTime;
		computeStateVariables(newState);
		return newState;
	}


	if (action.type === "SET_SPAN_END_TIME"){
		var newState = {...state};
		var span = getSpan(newState, action.span_id);
		span.endTime = action.endTime;
		computeStateVariables(newState);
		return newState;
	}


	if (action.type === "SET_SPAN_ACTIVITY"){
		var newState = {...state};
		var span = getSpan(newState, action.span_id);
		span.isInactive = action.isInactive;
		return newState;
	}


	if (action.type === "SET_TIME_DILATION_FACTOR"){
		var newState = {...state};
		var span = getSpan(newState, action.span_id);
		span.dilationFactor = action.factor;
		computeStateVariables(newState);
		return newState;
	}


	if (action.type === "SET_SPAN_DESCRIPTION"){
		var newState = {...state};
		var span = getSpan(newState, action.span_id);
		span.description = action.description;
		newState.active_universe_id = span.universe_id;
		return newState;
	}


	if (action.type === "SET_UNIVERSE_NAME"){
		var newState = {...state};
		var universe = newState.universes.find(u => u.id === action.universe_id);
		universe.name = action.name;
		newState.active_universe_id = action.universe_id;
		return newState;
	}


	if (action.type === "ADD_UNIVERSE"){
		var newState = {...state};

		var newUniverse = {
			id: uuidv4(),
			name: "",
			description: "",
			earliestDateOfRef2: null,
			latestDateOfRef2: null,
			RS2duration: 0,
			isCreatedAtFirstEntering: newState.universes.length > 0
		};

		if (action.insertIndex === newState.universes.length){
			newState.universes.push(newUniverse);
		} else if (action.insertIndex < newState.universes.length){
			newState.universes = immutableSplice(newState.universes, action.insertIndex, 0, newUniverse);
		} else {
			console.log("Strange insert index: " + action.insertIndex);
		}

		newState.active_universe_id = newUniverse.id;
		computeStateVariables(newState);
		return newState;
	}


	if (action.type === "DELETE_UNIVERSE"){
		var newState = {...state};
		newState.universes = newState.universes.filter(u => u.id !== action.universe_id);
		if (newState.active_universe_id === action.universe_id){
			if (newState.universes.length > 0){
				newState.active_universe_id = newState.universes[0].id;
			} else {
				newState.active_universe_id = null;
			}
		}

		//delete all spans in this universe
		newState.paths.forEach(p => {
			p.spans = p.spans.filter(s => s.universe_id !== action.universe_id);
		})

		return newState;
	}


	if (action.type === "SET_UNIVERSE_CREATION_TYPE"){
		var newState = {...state};
		var universe = newState.universes.find(u => u.id === action.universe_id);
		universe.isCreatedAtFirstEntering = action.isCreatedAtFirstEntering;
		return newState;
	}



	if (action.type === "SET_ACTIVE_UNIVERSE"){
		var newState = {...state};
		newState.active_universe_id = action.universe_id;
		return newState;
	}


	if (action.type === "SET_UNIVERSE_FOR_SPAN"){
		var newState = {...state};
		var span = getSpan(newState, action.span_id);
		span.universe_index = action.universe_index;
		return newState;
	}


	if (action.type === "LOAD_STATE"){
		var newState = action.state.data;
		computeStateVariables(newState);
		if (newState.universes.length > 0){
			newState.active_universe_id = newState.universes[0].id;
		} else {
			newState.active_universe_id = null;
		}
		return newState;
	}


	if (action.type === "SET_PRESET"){
		var newState = presets[action.preset_index].data;
		computeStateVariables(newState);
		if (newState.universes.length > 0){
			newState.active_universe_id = newState.universes[0].id;
		} else {
			newState.active_universe_id = null;
		}
		return newState;
	}


	if (action.type === "SET_VISUALIZATION_MODE"){
		var newState = {...state};
		newState.visualization_mode = action.visualization_mode;
		return newState;
	}


	else {
		return state;
	}
};
