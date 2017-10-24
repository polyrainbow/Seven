var moment = require("moment");

var getEarliestDateOfRefSys2 = (paths, universe_index) => {

	var paths_of_universe = paths.filter(p => p.universe_index === universe_index);

	if (paths_of_universe.length === 0) return moment().toObject();

	if (!objectIsUnixStartTime(moment(paths_of_universe[0].startTime).toObject())){
		var earliest_date = moment(paths_of_universe[0].startTime);
	} else {
		earliest_date = moment();
	}

	paths_of_universe.forEach(p => {
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

var getLatestDateOfRefSys2 = (paths, universe_index) => {

	var paths_of_universe = paths.filter(p => p.universe_index === universe_index);

	if (paths_of_universe.length === 0) return moment().toObject();

	if (!objectIsUnixStartTime(moment(paths_of_universe[0].startTime).toObject())){
		var latest_date = moment(paths_of_universe[0].startTime);
	}	else {
		latest_date = moment();
	}

	paths_of_universe.forEach(p => {
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


var computeStateVariables = (state) => {
	//currentPath.startTime && currentPath.endTime && currentPath.dilationFactor are already defined here

	state.paths.forEach(p => {
		p.durationInRS1 = Math.abs(moment(p.startTime).diff(p.endTime)) / p.dilationFactor;
	});

	state.universes.forEach((u, i) => {
		u.earliestDateOfRef2 = getEarliestDateOfRefSys2(state.paths, i);
		u.latestDateOfRef2 = getLatestDateOfRefSys2(state.paths, i);
		u.RS2duration = Math.abs(moment(u.earliestDateOfRef2).diff(u.latestDateOfRef2));
	});

	//Here, we rely on path.durationInRS1
	state.RS1duration = getDurationOfRS1(state.paths);

	state.paths.forEach(path => {
		var u = state.universes[path.universe_index];

		path.relativeStartRS1 = getRelativeStartOfPathInRS1(path.id, state);
		path.relativeEndRS1 = getRelativeEndOfPathInRS1(path.id, state);

		path.relativeStartRS2 = moment(path.startTime).diff(u.earliestDateOfRef2) / u.RS2duration;
		path.relativeEndRS2 = Math.abs(moment(path.endTime).diff(u.earliestDateOfRef2)) / u.RS2duration;
	});

};



module.exports = computeStateVariables;
