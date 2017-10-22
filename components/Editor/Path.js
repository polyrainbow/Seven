import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var moment = require("moment");

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {
	setPathStartTime,
	setPathEndTime,
	deletePath,
	setTimeDilationFactor,
	setPathDescription,
	setUniverse,
	setPathActivity
} from '../../actions/index.js';

class Path extends Component {

	constructor(props, context) {
		super(props, context);
	}


	getUniverseOptions(data){
		return data.universes.map((u, i) => {
			return <option value={i}>{u.name}</option>;
		});
	}

	render() {

		var path = this.props.path;

		return (
			<div className="path" style={{
				"border": "2px solid grey",
				"margin": "10px 0px",
				"padding": "10px",
				"background": "radial-gradient(circle at 50% 10%, rgba(247, 221, 189, 0.79) -10%, transparent 90%), linear-gradient(140deg, rgba(255, 87, 87, 0.48) -20%, transparent 90%), linear-gradient(-150deg, #6BCCE6 -10%, transparent 60%), radial-gradient(40% 50% at 50% 120%, rgba(30, 12, 76, 0.25), transparent), linear-gradient(to right, rgba(245, 34, 116, 0.63), rgba(39, 97, 249, 0.65), white)"
			}}>
				<div style={{
					"display": "flex",
					"justifyContent": "space-between"
				}}>
					<h4>📍 Path</h4>
					<button onClick={() => this.props.deletePath(path.id)}>Delete</button>
				</div>
				<label htmlFor={path.id + "_start_time_input"} >Start Time in Reference Timeline 2: </label>
				<input
					id={path.id + "_start_time_input"}
					type="datetime-local"
					onChange={(e) => {console.log(e.target.value)
						var object = moment(e.target.value).toObject();
						if (!objectIsUnixStartTime(object)){
							this.props.setPathStartTime(path.id, object);
						}
					}}
					defaultValue={moment(path.startTime).format('YYYY-MM-DDTHH:mm')}
				/>
				<br/>
				<label htmlFor={path.id + "_end_time_input"} >End Time in Reference Timeline 2: </label>
				<input
					id={path.id + "_end_time_input"}
					type="datetime-local"
					onChange={(e) => {
						var object = moment(e.target.value).toObject();
						if (!objectIsUnixStartTime(object)){
							this.props.setPathEndTime(path.id, object)
						}
					}}
					defaultValue={moment(path.endTime).format('YYYY-MM-DDTHH:mm')}
				/>
				<br/>
				<label htmlFor={path.id + "_time_dilation_factor_input"}>Time Dilation Factor: </label>
				<input
					id={path.id + "_time_dilation_factor_input"}
					type="number"
					defaultValue={path.dilationFactor}
					onChange={(e) => this.props.setTimeDilationFactor(path.id, parseFloat(e.target.value))}
					title="The higher this factor, the faster you travel through the time of reference system 2"
				/>
				<br/>
				<label htmlFor={path.id + "_universe_select"}>Universe: </label>
				<select
					id={path.id + "_universe_select"}
					defaultValue={path.universe_index}
					onChange={(e) => this.props.setUniverse(path.id, e.target.selectedIndex)}
				>
					{this.getUniverseOptions(this.props.data)}
				</select>
				<br/>
				<label htmlFor={path.id + "_inactive_input"}>Inactive Period: </label>
				<input
					id={path.id + "_inactive_input"}
					type="checkbox"
					defaultValue={path.isInactive}
					onChange={(e) => this.props.setPathActivity(path.id, e.target.checked)}
				/>
				<br/>
				<label htmlFor={path.id + "_description_input"}>Description: </label>
				<textarea id={path.id + "_description_input"} defaultValue={path.description}/>
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
		setPathStartTime,
		setPathEndTime,
		deletePath,
		setTimeDilationFactor,
		setPathDescription,
		setUniverse,
		setPathActivity
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Path);
