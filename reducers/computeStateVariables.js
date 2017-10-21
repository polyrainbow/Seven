var moment = require("moment");

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
		if (
			(!objectIsUnixStartTime(moment(p.startTime).toObject()))
			&& moment(p.startTime).isAfter(latest_date)
		){
			latest_date = moment(p.startTime);
		}

		if (
			(!objectIsUnixStartTime(moment(p.endTime).toObject()))
			&& moment(p.endTime).isAfter(latest_date)
		){
			latest_date = moment(p.endTime);
		}
	});

	return latest_date.toObject();

}


var getDurationOfRS1 = (paths) => {
	var RS1duration = 0;
	paths.forEach(path => {
		RS1duration += path.durationInRS1;
	});
	return RS1duration;
}

var getRelativeStartOfPathInRS1 = (path_id, state) => {
	var p_index = state.paths.findIndex(p => p.id === path_id);

	var start_in_ms = 0;

	for (var i = 0; i < p_index; i++){
		start_in_ms += state.paths[i].durationInRS1;
	}

	return start_in_ms / state.RS1duration;

}


var getRelativeEndOfPathInRS1 = (path_id, state) => {
	var p_index = state.paths.findIndex(p => p.id === path_id);

	var end_in_ms = 0;

	for (var i = 0; i <= p_index; i++){
		end_in_ms += state.paths[i].durationInRS1;
	}

	return end_in_ms / state.RS1duration;

}


var computeStateVariables = (currentPath, state) => {
	//currentPath.startTime && currentPath.endTime && currentPath.dilationFactor are already defined here

	currentPath.durationInRS1 = Math.abs(moment(currentPath.startTime).diff(currentPath.endTime)) / currentPath.dilationFactor;

	state.earliestDateOfRef2 = getEarliestDateOfRefSys2(state.paths);
	state.latestDateOfRef2 = getLatestDateOfRefSys2(state.paths);

	//Here, we rely on path.durationInRS1
	state.RS1duration = getDurationOfRS1(state.paths);
	//Here we rely on earliestDateOfRef2 and latestDateOfRef2
	state.RS2duration = Math.abs(moment(state.earliestDateOfRef2).diff(state.latestDateOfRef2));

	state.paths.forEach(path => {

		path.relativeStartRS1 = getRelativeStartOfPathInRS1(path.id, state);
		path.relativeEndRS1 = getRelativeEndOfPathInRS1(path.id, state);
		path.relativeStartRS2 = moment(path.startTime).diff(state.earliestDateOfRef2) / state.RS2duration;
		path.relativeEndRS2 = Math.abs(moment(path.endTime).diff(state.earliestDateOfRef2)) / state.RS2duration;

	});

};



module.exports = computeStateVariables;
