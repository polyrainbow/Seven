var constants = require('../constants.js');
var moment = require("moment");

const initialState = {
	paths: [],
	path_id_counter: 0,
	earliestDateOfRef2: null,
	latestDateOfRef2: null,
	RS1duration: 0,
	RS2duration: 0
};

var getEarliestDateOfRefSys2 = (paths) => {

	if (paths.length === 0) return moment().toObject();

	if (!objectIsUnixStartTime(moment(paths[0].startTime).toObject())){
		var earliest_date = moment(paths[0].startTime);
	} else {
		earliest_date = moment();
	}

	paths.forEach(p => {
		if (
			(!objectIsUnixStartTime(moment(p.startTime).toObject()))
			&& moment(p.startTime).isBefore(earliest_date)
		){
			earliest_date = moment(p.startTime);
		}

		if (
			(!objectIsUnixStartTime(moment(p.endTime).toObject()))
			&& moment(p.endTime).isBefore(earliest_date)
		){
			earliest_date = moment(p.endTime);
		}
	});

	return earliest_date.toObject();

}

var getLatestDateOfRefSys2 = (paths) => {

	if (paths.length === 0) return moment().toObject();

	if (!objectIsUnixStartTime(moment(paths[0].startTime).toObject())){
		var latest_date = moment(paths[0].startTime);
	}	else {
		latest_date = moment();
	}

	paths.forEach(p => {
		if (!latest_date){
			latest_date = moment(p.startTime);
		}

		if ((!objectIsUnixStartTime(moment(p.startTime).toObject())) && moment(p.startTime).isAfter(latest_date)){
			latest_date = moment(p.startTime);
		}

		if ((!objectIsUnixStartTime(moment(p.endTime).toObject())) && moment(p.endTime).isAfter(latest_date)){
			latest_date = moment(p.endTime);
		}
	});

	return latest_date.toObject();

}


var getDurationOfRS1 = (paths) => {

	var RS1duration = 0;

	paths.forEach(path => {
		var pathDuration = Math.abs(moment(path.startTime).diff(path.endTime)) / path.dilationFactor;
		RS1duration += pathDuration;
	});

	return RS1duration;

}

export default function reducer(state=initialState, action){

	if (action.type == "DELETE_PATH"){
		var newState = {...state};
		newState.paths = newState.paths.filter(p => p.id !== action.path_id);
		return newState;
	}

	if (action.type == "ADD_PATH"){
		var newState = {...state};
		newState.path_id_counter++;

		var newPath = {
			id: newState.path_id_counter,
			startTime: 0,
			endTime: 0,
			dilationFactor: 1,
			universe_index: 0
		};

		newState.paths = immutableSplice(newState.paths, action.insertIndex, 0, newPath);
		return newState;
	}

	if (action.type == "SET_PATH_START_TIME"){
		var newState = {...state};
		var path = newState.paths.find(p => p.id === action.path_id);
		path.startTime = action.startTime;

		newState.earliestDateOfRef2 = getEarliestDateOfRefSys2(newState.paths);
		newState.latestDateOfRef2 = getLatestDateOfRefSys2(newState.paths);
		newState.RS1duration = getDurationOfRS1(newState.paths);
		newState.RS2duration = Math.abs(moment(newState.earliestDateOfRef2).diff(newState.latestDateOfRef2));

		path.relativeStartRS1 = moment(path.startTime).diff(newState.earliestDateOfRef2) / newState.RS1duration;
		path.relativeEndRS1 = Math.abs(moment(path.endTime).diff(newState.earliestDateOfRef2)) / newState.RS1duration;

		path.relativeStartRS2 = moment(path.startTime).diff(newState.earliestDateOfRef2) / newState.RS2duration;
		path.relativeEndRS2 = Math.abs(moment(path.endTime).diff(newState.earliestDateOfRef2)) / newState.RS2duration;


		return newState;
	}

	if (action.type == "SET_PATH_END_TIME"){
		var newState = {...state};
		var path = newState.paths.find(p => p.id === action.path_id);
		path.endTime = action.endTime;

		newState.earliestDateOfRef2 = getEarliestDateOfRefSys2(newState.paths);
		newState.latestDateOfRef2 = getLatestDateOfRefSys2(newState.paths);
		newState.RS1duration = getDurationOfRS1(newState.paths);
		newState.RS2duration = Math.abs(moment(newState.earliestDateOfRef2).diff(newState.latestDateOfRef2));

		path.relativeStartRS1 = moment(path.startTime).diff(newState.earliestDateOfRef2) / newState.RS1duration;
		path.relativeEndRS1 = Math.abs(moment(path.endTime).diff(newState.earliestDateOfRef2)) / newState.RS1duration;

		path.relativeStartRS2 = moment(path.startTime).diff(newState.earliestDateOfRef2) / newState.RS2duration;
		path.relativeEndRS2 = Math.abs(moment(path.endTime).diff(newState.earliestDateOfRef2)) / newState.RS2duration;



		return newState;
	}

	if (action.type == "SET_TIME_DILATION_FACTOR"){
		var newState = {...state};
		var path = newState.paths.find(p => p.id === action.path_id);
		path.dilationFactor = action.factor;

		newState.earliestDateOfRef2 = getEarliestDateOfRefSys2(newState.paths);
		newState.latestDateOfRef2 = getLatestDateOfRefSys2(newState.paths);
		newState.RS1duration = getDurationOfRS1(newState.paths);
		newState.RS2duration = Math.abs(moment(newState.earliestDateOfRef2).diff(newState.latestDateOfRef2));

		path.relativeStartRS1 = moment(path.startTime).diff(newState.earliestDateOfRef2) / newState.RS1duration;
		path.relativeEndRS1 = Math.abs(moment(path.endTime).diff(newState.earliestDateOfRef2)) / newState.RS1duration;

		path.relativeStartRS2 = moment(path.startTime).diff(newState.earliestDateOfRef2) / newState.RS2duration;
		path.relativeEndRS2 = Math.abs(moment(path.endTime).diff(newState.earliestDateOfRef2)) / newState.RS2duration;



		return newState;
	}

	else {
		return state;
	}
};
