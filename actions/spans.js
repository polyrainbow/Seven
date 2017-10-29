var constants = require("../constants.js");

const addSpan = (path_id, insertIndex) => {
	return {
		type: "ADD_SPAN",
		path_id,
		insertIndex
	}
}

const deleteSpan = (span_id) => {
	return {
		type: "DELETE_SPAN",
		span_id
	}
}

const setSpanStartTime = (span_id, startTime) => {
	return {
		type: "SET_SPAN_START_TIME",
		span_id,
		startTime
	}
}

const setSpanEndTime = (span_id, endTime) => {
	return {
		type: "SET_SPAN_END_TIME",
		span_id,
		endTime
	}
}


const setTimeDilationFactor = (span_id, factor) => {
	return {
		type: "SET_TIME_DILATION_FACTOR",
		span_id,
		factor
	}
}


const setSpanDescription = (span_id, description) => {
	return {
		type: "SET_SPAN_DESCRIPTION",
		span_id,
		description
	}
}


const setUniverseForSpan = (span_id, universe_id) => {
	return {
		type: "SET_UNIVERSE_FOR_SPAN",
		span_id,
		universe_id
	}
}


const setSpanActivity = (span_id, isInactive) => {
	return {
		type: "SET_SPAN_ACTIVITY",
		span_id,
		isInactive
	}
}



module.exports = {
	addSpan,
	deleteSpan,
	setSpanStartTime,
	setSpanEndTime,
	setTimeDilationFactor,
	setSpanDescription,
	setSpanActivity,
	setUniverseForSpan
}
