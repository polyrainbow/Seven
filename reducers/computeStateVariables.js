var moment = require("moment");

var getEarliestDateOfRefSys2 = (paths, universe_id) => {

	var all_spans = [].concat(...paths.map(p => p.spans));

	//if universe_id is given, consider spans in this universe only
	if (universe_id){
		var spans_to_consider = all_spans.filter(s => s.universe_id === universe_id);
	} else {
		spans_to_consider = all_spans;
	}

	if (spans_to_consider.length === 0) return moment().toObject();

	if (!objectIsUnixStartTime(moment(spans_to_consider[0].startTime).toObject())){
		var earliest_date = moment(spans_to_consider[0].startTime);
	} else {
		earliest_date = moment();
	}

	spans_to_consider.forEach(p => {
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

var getLatestDateOfRefSys2 = (paths, universe_id) => {

	var all_spans = [].concat(...paths.map(p => p.spans));

	//if universe_id is given, consider spans in this universe only
	if (universe_id){
		var spans_to_consider = all_spans.filter(s => s.universe_id === universe_id);
	} else {
		spans_to_consider = all_spans;
	}

	if (spans_to_consider.length === 0) return moment().toObject();

	if (!objectIsUnixStartTime(moment(spans_to_consider[0].startTime).toObject())){
		var latest_date = moment(spans_to_consider[0].startTime);
	}	else {
		latest_date = moment();
	}

	spans_to_consider.forEach(p => {
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
	//currentSpan.startTime && currentSpan.endTime && currentSpan.dilationFactor are already defined

	state.paths.forEach(path => {
		path.spans.forEach(span => {
			span.durationInRS1 = Math.abs(moment(span.startTime).diff(span.endTime)) / span.dilationFactor;
		});
	});


	// Here we compute the earliest/latest date in RS2 for each universe with
	// spans of all paths considered.
	// TODO: Compute earliest/latest dates per path per universe
	state.universes.forEach((u) => {
		u.earliestDateOfRef2 = getEarliestDateOfRefSys2(state.paths, u.id);
		u.latestDateOfRef2 = getLatestDateOfRefSys2(state.paths, u.id);
		u.RS2duration = Math.abs(moment(u.earliestDateOfRef2).diff(u.latestDateOfRef2));
	});


	// Earliest/latest date and duration of all universes combined (RS2)
	state.earliestDateInRS2 = getEarliestDateOfRefSys2(state.paths);
	state.latestDateInRS2 = getLatestDateOfRefSys2(state.paths);
	state.RS2duration = Math.abs(moment(state.earliestDateInRS2).diff(state.latestDateInRS2));


	//compute relative start/end of universe times in relation to master times
	state.universes.forEach((u) => {
		if (state.RS2duration > 0){
			u.relativeStart = Math.abs(moment(u.earliestDateOfRef2).diff(state.earliestDateInRS2)) / state.RS2duration;
			u.relativeEnd = Math.abs(moment(u.latestDateOfRef2).diff(state.earliestDateInRS2)) / state.RS2duration;
		} else {
			u.relativeStart = 0;
			u.relativeEnd = 0;
		}
	})


	//Here, we rely on span.durationInRS1
	state.paths.forEach(path =>
		path.RS1duration = getDurationOfRS1(path.spans)
	);


	state.paths.forEach(path => {
		path.spans.forEach(span => {
			var u = state.universes.find(u => u.id === span.universe_id);

			span.relativeStartRS1 = getRelativeStartOfSpanInRS1(span.id, path);
			span.relativeEndRS1 = getRelativeEndOfSpanInRS1(span.id, path);

			span.relativeStartRS2 = moment(span.startTime).diff(u.earliestDateOfRef2) / u.RS2duration;
			span.relativeEndRS2 = Math.abs(moment(span.endTime).diff(u.earliestDateOfRef2)) / u.RS2duration;

			//relative start with times of all universes combined
			span.relativeStartRS2Global = moment(span.startTime).diff(state.earliestDateInRS2) / state.RS2duration;
			span.relativeEndRS2Global = Math.abs(moment(span.endTime).diff(state.earliestDateInRS2)) / state.RS2duration;
		});
	});

};



module.exports = computeStateVariables;
