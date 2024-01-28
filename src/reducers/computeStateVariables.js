import moment from "moment";
import { objectIsUnixStartTime } from "../utils/helpers";

var getEarliestDateOfRF2 = (paths, universe_id) => {

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

var getLatestDateOfRF2 = (paths, universe_id) => {

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


var getDurationOfRF1 = (spans) => {
	var RF1duration = 0;
	spans.forEach(span => {
		RF1duration += span.durationInRF1;
	});
	return RF1duration;
}

var getRelativeStartOfSpanInRF1 = (span_id, path) => {
	var s_index = path.spans.findIndex(s => s.id === span_id);

	var start_in_ms = 0;

	for (var i = 0; i < s_index; i++){
		start_in_ms += path.spans[i].durationInRF1;
	}

	return start_in_ms / path.RF1duration;

}


var getRelativeEndOfSpanInRF1 = (span_id, path) => {
	var s_index = path.spans.findIndex(s => s.id === span_id);

	var end_in_ms = 0;

	for (var i = 0; i <= s_index; i++){
		end_in_ms += path.spans[i].durationInRF1;
	}

	return end_in_ms / path.RF1duration;

}


var getGridPoints = (state) => {

	var gridPoints = [];
	//Already go to century resolution, when duration longer than a fourth of a century
	if (state.RF2duration > (3153600000000 / 4)){
		//Grid points in century resolution
		var next_century_year = Math.ceil(state.earliestDateInRF2.years/100) * 100;
		var year = next_century_year;
		while (year < state.latestDateInRF2.years){
			var first_day_of_year = moment(year + "-01-01 00:00");
			var relativePosition = first_day_of_year.diff(state.earliestDateInRF2) / state.RF2duration;
			gridPoints.push({
				relativePosition,
				moment: first_day_of_year.toObject(),
				label: year
			});
			year = year + 100;
		}
	} else if (state.RF2duration > 31536000000){
		//Grid points in year resolution
		const first_year = state.earliestDateInRF2.years;
		let year = first_year;
		while (year < state.latestDateInRF2.years){
			year = year + 1;
			const first_day_of_year = moment(year + "-01-01 00:00");
			const relativePosition =	first_day_of_year.diff(state.earliestDateInRF2) / state.RF2duration;
			gridPoints.push({
				relativePosition,
				moment: first_day_of_year.toObject(),
				label: year
			});
		}
	} else if (state.RF2duration > 2628000000){
		//Grid points in month resolution
		let newDate = moment(state.earliestDateInRF2).add(1, "month").startOf("month");
		while (moment(state.latestDateInRF2).diff(newDate) >= 0){
			var date_object = newDate.toObject();
			const relativePosition = newDate.diff(state.earliestDateInRF2) / state.RF2duration;
			gridPoints.push({
				relativePosition,
				moment: date_object,
				label: newDate.format("MMM YYYY")
			});
			newDate = newDate.add(1, 'month');
		}
	} else {
		//Grid points in day resolution
		//go to the next 00:00 date starting at state.earliestDateInRF2
		let newDate = moment(state.earliestDateInRF2).add(1, "day").startOf("day");
		while (moment(state.latestDateInRF2).diff(newDate) >= 0){
			const date_object = newDate.toObject();
			const relativePosition = newDate.diff(state.earliestDateInRF2) / state.RF2duration;
			gridPoints.push({
				relativePosition,
				moment: date_object,
				label: newDate.format("DD MMM YYYY")
			});
			newDate = newDate.add(1, 'day');
		}
	}

	return gridPoints;
}


var getSpanDurationInRF1 = (span) => {
	let result;

	if (span.type === "frozen-0"){
		result = Math.abs(moment(span.startTime).diff(span.endTime)) / span.dilationFactor;
	} else if (span.type === "frozen-1"){
		result = 0;
	} else if (span.type === "frozen-2"){
		result = span.RF1DurationSpentInFrozenTime;
	}

	return result;
}


var computeStateVariables = (state) => {
	/* Already defined by user are:
		span.startTime
		span.endTime
		span.dilationFactor
		span.RF1DurationSpentInFrozenTime
	*/

	// Computing span.durationInRF1
	state.paths.forEach(path => {
		path.spans.forEach(span => {
			span.durationInRF1 = getSpanDurationInRF1(span);
		});
	});


	/* Computing
		universe.earliestDateOfRef2
		universe.latestDateOfRef2
		universe.RF2duration

		Here we compute the earliest/latest date in RF2 for each universe with
		spans of all paths considered.
		TODO: Do we need to compute earliest/latest dates per path per universe?
	*/
	state.universes.forEach((u) => {
		u.earliestDateOfRef2 = getEarliestDateOfRF2(state.paths, u.id);
		u.latestDateOfRef2 = getLatestDateOfRF2(state.paths, u.id);
		u.RF2duration = Math.abs(moment(u.earliestDateOfRef2).diff(u.latestDateOfRef2));
	});


	// Earliest/latest date and duration of all universes combined (RF2)
	state.earliestDateInRF2 = getEarliestDateOfRF2(state.paths);
	state.latestDateInRF2 = getLatestDateOfRF2(state.paths);
	state.RF2duration = Math.abs(moment(state.earliestDateInRF2).diff(state.latestDateInRF2));

	//relies on state.earliestDateInRF2, state.latestDateInRF2, state.RF2duration
	state.gridPoints = getGridPoints(state);


	//compute relative start/end of universe times in relation to master times
	state.universes.forEach((u) => {
		if (state.RF2duration > 0){
			u.relativeStart = Math.abs(moment(u.earliestDateOfRef2).diff(state.earliestDateInRF2)) / state.RF2duration;
			u.relativeEnd = Math.abs(moment(u.latestDateOfRef2).diff(state.earliestDateInRF2)) / state.RF2duration;
		} else {
			u.relativeStart = 0;
			u.relativeEnd = 0;
		}
	})


	//Here, we rely on span.durationInRF1
	state.paths.forEach(path =>
		path.RF1duration = getDurationOfRF1(path.spans)
	);


	state.paths.forEach(path => {
		path.spans.forEach(span => {
			var u = state.universes.find(u => u.id === span.universe_id);

			span.relativeStartRF1 = getRelativeStartOfSpanInRF1(span.id, path);
			span.relativeEndRF1 = getRelativeEndOfSpanInRF1(span.id, path);

			span.relativeStartRF2 = u.RF2duration > 0 ? moment(span.startTime).diff(u.earliestDateOfRef2) / u.RF2duration : 0;

			if (span.type === "frozen-0"){
				span.relativeEndRF2 = u.RF2duration > 0 ? Math.abs(moment(span.endTime).diff(u.earliestDateOfRef2)) / u.RF2duration : 0;
			} else if (span.type === "frozen-1"){
				span.relativeEndRF2 = u.RF2duration > 0 ? Math.abs(moment(span.endTime).diff(u.earliestDateOfRef2)) / u.RF2duration : 0;
			} else if (span.type === "frozen-2"){
				span.relativeEndRF2 = span.relativeStartRF2;
			}

			//relative start with times of all universes combined
			span.relativeStartRF2Global = moment(span.startTime).diff(state.earliestDateInRF2) / state.RF2duration;
			span.relativeEndRF2Global = Math.abs(moment(span.endTime).diff(state.earliestDateInRF2)) / state.RF2duration;
		});
	});

};



export default computeStateVariables;
