var moment = require("moment");

var getEarliestDateOfRefSys2 = (paths, universe_index) => {

	var all_spans = [].concat(...paths.map(p => p.spans));
	var spans_of_universe = all_spans.filter(s => s.universe_index === universe_index);

	if (spans_of_universe.length === 0) return moment().toObject();

	if (!objectIsUnixStartTime(moment(spans_of_universe[0].startTime).toObject())){
		var earliest_date = moment(spans_of_universe[0].startTime);
	} else {
		earliest_date = moment();
	}

	spans_of_universe.forEach(p => {
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

	var all_spans = [].concat(...paths.map(p => p.spans));
	var spans_of_universe = all_spans.filter(s => s.universe_index === universe_index);

	if (spans_of_universe.length === 0) return moment().toObject();

	if (!objectIsUnixStartTime(moment(spans_of_universe[0].startTime).toObject())){
		var latest_date = moment(spans_of_universe[0].startTime);
	}	else {
		latest_date = moment();
	}

	spans_of_universe.forEach(p => {
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


var getDurationOfRS1 = (spans) => {
	var RS1duration = 0;
	spans.forEach(span => {
		RS1duration += span.durationInRS1;
	});
	return RS1duration;
}

var getRelativeStartOfSpanInRS1 = (span_id, path) => {
	var s_index = path.spans.findIndex(s => s.id === span_id);

	var start_in_ms = 0;

	for (var i = 0; i < s_index; i++){
		start_in_ms += path.spans[i].durationInRS1;
	}

	return start_in_ms / path.RS1duration;

}


var getRelativeEndOfSpanInRS1 = (span_id, path) => {
	var s_index = path.spans.findIndex(s => s.id === span_id);

	var end_in_ms = 0;

	for (var i = 0; i <= s_index; i++){
		end_in_ms += path.spans[i].durationInRS1;
	}

	return end_in_ms / path.RS1duration;

}


var computeStateVariables = (state) => {
	//currentSpan.startTime && currentSpan.endTime && currentSpan.dilationFactor are already defined here

	state.paths.forEach(path => {
		path.spans.forEach(span => {
			span.durationInRS1 = Math.abs(moment(span.startTime).diff(span.endTime)) / span.dilationFactor;
		});
	});

	//Shall we compute earliest/latest date for a single path for each universe
	//or for all paths together for each universe? The answer: BOTH!
	// Here we compute the earliest/latest date for each universe with all paths
	// included.
	// TODO: Compute earliest/latest date for each path in each universe
	state.universes.forEach((u, i) => {
		u.earliestDateOfRef2 = getEarliestDateOfRefSys2(state.paths, i);
		u.latestDateOfRef2 = getLatestDateOfRefSys2(state.paths, i);
		u.RS2duration = Math.abs(moment(u.earliestDateOfRef2).diff(u.latestDateOfRef2));
	});

	//Here, we rely on span.durationInRS1
	state.paths.forEach(path =>
		path.RS1duration = getDurationOfRS1(path.spans)
	);

	state.paths.forEach(path => {
		path.spans.forEach(span => {
			var u = state.universes[span.universe_index];

			span.relativeStartRS1 = getRelativeStartOfSpanInRS1(span.id, path);
			span.relativeEndRS1 = getRelativeEndOfSpanInRS1(span.id, path);

			span.relativeStartRS2 = moment(span.startTime).diff(u.earliestDateOfRef2) / u.RS2duration;
			span.relativeEndRS2 = Math.abs(moment(span.endTime).diff(u.earliestDateOfRef2)) / u.RS2duration;
		});
	});

};



module.exports = computeStateVariables;
