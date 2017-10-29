import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var moment = require("moment");

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {
	setSpanStartTime,
	setSpanEndTime,
	deleteSpan,
	setTimeDilationFactor,
	setSpanDescription,
	setUniverseForSpan,
	setSpanActivity
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
				"background": "radial-gradient(circle at 50% 10%, rgba(226, 251, 255, 0.79) -10%, transparent 90%), linear-gradient(140deg, rgba(255, 87, 87, 0.48) -20%, transparent 90%), linear-gradient(-150deg, rgb(207, 230, 107) -10%, transparent 60%), radial-gradient(40% 50% at 50% 120%, rgba(72, 0, 255, 0.25), transparent), linear-gradient(to right, rgba(34, 187, 245, 0.63), rgba(39, 249, 191, 0.65), #8e94ff)"
			}}>
				<div style={{
					"display": "flex",
					"justifyContent": "space-between"
				}}>
					<h4>📍 Span</h4>
					<button onClick={() => this.props.deleteSpan(span.id)}>Delete</button>
				</div>
				<label htmlFor={span.id + "_start_time_input"} >Start Time in Reference Timeline 2: </label>
				<input
					id={span.id + "_start_time_input"}
					type="datetime-local"
					onChange={(e) => {console.log(e.target.value)
						var object = moment(e.target.value).toObject();
						if (!objectIsUnixStartTime(object)){
							this.props.setSpanStartTime(span.id, object);
						}
					}}
					defaultValue={moment(span.startTime).format('YYYY-MM-DDTHH:mm')}
				/>
				<br/>
				<label htmlFor={span.id + "_end_time_input"} >End Time in Reference Timeline 2: </label>
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
				/>
				<br/>
				<label htmlFor={span.id + "_time_dilation_factor_input"}>Time Dilation Factor: </label>
				<input
					id={span.id + "_time_dilation_factor_input"}
					type="number"
					defaultValue={span.dilationFactor}
					onChange={(e) => this.props.setTimeDilationFactor(span.id, parseFloat(e.target.value))}
					title="The higher this factor, the faster you travel through the time of reference system 2"
				/>
				<br/>
				<label htmlFor={span.id + "_universe_select"}>Universe: </label>
				<select
					id={span.id + "_universe_select"}
					defaultValue={span.universe_id}
					onChange={(e) => this.props.setUniverseForSpan(span.id, e.target.value)}
				>
					{this.getUniverseOptions(this.props.data)}
				</select>
				<br/>
				<label htmlFor={span.id + "_inactive_input"}>Inactive Period: </label>
				<input
					style={{
						"transform": "scale(2)"
					}}
					id={span.id + "_inactive_input"}
					type="checkbox"
					defaultChecked={span.isInactive}
					onChange={(e) => this.props.setSpanActivity(span.id, e.target.checked)}
				/>
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
		deleteSpan,
		setTimeDilationFactor,
		setSpanDescription,
		setUniverseForSpan,
		setSpanActivity
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Span);
