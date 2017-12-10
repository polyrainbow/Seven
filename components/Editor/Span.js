import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var moment = require("moment");

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {
	setSpanStartTime,
	setSpanEndTime,
	setSpanType,
	deleteSpan,
	setTimeDilationFactor,
	setSpanDescription,
	setUniverseForSpan,
	setSpanActivity,
	setRF1DurationSpentInFrozenTime
} from '../../actions/spans.js';

class Span extends Component {

	constructor(props, context) {
		super(props, context);
	}


	getUniverseOptions(data){
		return data.universes.map((u, i) => {
			return <option value={u.id}>{u.name}</option>;
		});
	}

	render() {

		var span = this.props.span;

		return (
			<div className="span" style={{
				"border": "2px solid grey",
				"margin": "10px 0px",
				"padding": "10px",
				"background": "radial-gradient(circle at 50% 10%, rgba(226, 251, 255, 0.79) -10%, transparent 90%), linear-gradient(140deg, rgba(255, 87, 87, 0.48) -20%, transparent 90%), linear-gradient(-150deg, rgb(0, 255, 8) -10%, transparent 60%), radial-gradient(40% 50% at 50% 120%, rgba(72, 0, 255, 0.25), transparent), linear-gradient(to right, rgba(34, 187, 245, 0.63), rgba(39, 249, 191, 0.65), rgb(142, 148, 255))"
			}}>
				<div style={{
					"display": "flex",
					"justifyContent": "space-between"
				}}>
					<h4>🕰️ Span</h4>
					<button onClick={() => this.props.deleteSpan(span.id)}>Delete</button>
				</div>
				<label htmlFor={span.id + "_universe_select"}>Universe: </label>
				<select
					id={span.id + "_universe_select"}
					defaultValue={span.universe_id}
					onChange={(e) => this.props.setUniverseForSpan(span.id, e.target.value)}
				>
					{this.getUniverseOptions(this.props.data)}
				</select>
				<br/>
				<label htmlFor={span.id + "_start_time_input"} >Start Time in Reference Frame 2: </label>
				<input
					id={span.id + "_start_time_input"}
					type="datetime-local"
					onChange={(e) => {
						var object = moment(e.target.value).toObject();
						if (!objectIsUnixStartTime(object)){
							this.props.setSpanStartTime(span.id, object);
						}
					}}
					defaultValue={moment(span.startTime).format('YYYY-MM-DDTHH:mm')}
				/>
				<br/>
				<label htmlFor={span.id + "_end_time_input"} >End Time in Reference Frame 2: </label>
				<input
					id={span.id + "_end_time_input"}
					type="datetime-local"
					onChange={(e) => {
						var object = moment(e.target.value).toObject();
						if (!objectIsUnixStartTime(object)){
							this.props.setSpanEndTime(span.id, object)
						}
					}}
					defaultValue={moment(span.endTime).format('YYYY-MM-DDTHH:mm')}
					disabled={span.type === "frozen-2"}
				/>
				<br/>
				<fieldset style={{
					"backgroundColor": "rgba(255,255,255,0.3)",
					"padding": "10px",
					"marginBottom": "10px"
				}}>
					<input
						type="radio"
						style={{
							"transform": "scale(2)",
					    "marginLeft": "6px",
					    "marginRight": "10px",
						}}
						name={span.id + "_span_type"}
						id={span.id + "_radio_type_frozen-0"}
						checked={span.type === 'frozen-0'}
						onChange={(e) => {
								this.props.setSpanType(span.id, "frozen-0");
						}}
					/>
					<label htmlFor={span.id + "_radio_type_frozen-0"}>Time passes in both reference frames</label>
					<br/>
					<label htmlFor={span.id + "_time_dilation_factor_input"}>Time Dilation Factor: </label>
					<input
						id={span.id + "_time_dilation_factor_input"}
						type="number"
						defaultValue={span.dilationFactor}
						onChange={(e) => this.props.setTimeDilationFactor(span.id, parseFloat(e.target.value))}
						title="The higher this factor, the faster you travel through the time of reference system 2"
						disabled={span.type !== "frozen-0"}
					/>
					<br/>
					<input
						type="radio"
						style={{
							"transform": "scale(2)",
							"marginLeft": "6px",
							"marginRight": "10px",
						}}
						name={span.id + "_span_type"}
						id={span.id + "_radio_type_frozen-1"}
						checked={span.type === 'frozen-1'}
						onChange={(e) => {
								this.props.setSpanType(span.id, "frozen-1");
						}}
					/>
					<label htmlFor={span.id + "_radio_type_frozen-1"}>Time frozen in frame 1</label>
					<br/>
					<input
						type="radio"
						style={{
							"transform": "scale(2)",
					    "marginLeft": "6px",
					    "marginRight": "10px",
						}}
						name={span.id + "_span_type"}
						id={span.id + "_radio_type_frozen-2"}
						checked={span.type === 'frozen-2'}
						onChange={(e) => {
								this.props.setSpanType(span.id, "frozen-2");
						}}
					/>
					<label htmlFor={span.id + "_radio_type_frozen-2"}>Time frozen in frame 2</label>
					<br/>
					<label htmlFor={span.id + "_RF1_duration_spent_in_frozen_time_input"}>RF1 duration spent in frozen time (seconds): </label>
					<input
						id={span.id + "_RF1_duration_spent_in_frozen_time_input"}
						type="number"
						defaultValue={span.RF1DurationSpentInFrozenTime}
						onChange={
							(e) => this.props.setRF1DurationSpentInFrozenTime(span.id, parseFloat(e.target.value * 1000))
							/* we immediately convert from seconds to ms */
						}
						disabled={span.type !== "frozen-2"}
					/>
					<br/>
				</fieldset>
				<input
					style={{
						"transform": "scale(2)",
				    "marginLeft": "6px",
				    "marginRight": "10px",
					}}
					id={span.id + "_inactive_input"}
					type="checkbox"
					defaultChecked={span.isInactive}
					onChange={(e) => this.props.setSpanActivity(span.id, e.target.checked)}
				/>
				<label htmlFor={span.id + "_inactive_input"}>Inactive Period</label>
				<br/>
				<label htmlFor={span.id + "_description_input"}>Description: </label>
				<textarea
					style={{
						"width": "100%",
    				"height": "90px"
					}}
					id={span.id + "_description_input"}
					defaultValue={span.description}
					onChange={(e) => this.props.setSpanDescription(span.id, e.target.value)}
				/>
			</div>
		);
  }
}

function mapStateToProps(state){
	return {
		data: state.data
	}
}

function matchDispatchToProps(dispatch){
	return bindActionCreators({
		setSpanStartTime,
		setSpanEndTime,
		setSpanType,
		deleteSpan,
		setTimeDilationFactor,
		setSpanDescription,
		setUniverseForSpan,
		setSpanActivity,
		setRF1DurationSpentInFrozenTime
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Span);
