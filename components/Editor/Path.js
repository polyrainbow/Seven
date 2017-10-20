import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var moment = require("moment");

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {setPathStartTime, setPathEndTime, deletePath} from '../../actions/index.js';

class Path extends Component {

	constructor(props, context) {
		super(props, context);
	}


	render() {

		var path = this.props.path;

		return (
			<div style={{
				"border": "2px solid grey",
				"margin": "10px",
				"padding": "10px"
			}}>
				<h3>Path</h3>
				<label htmlFor={path.id + "_start_time_input"} >Start Time in RS 2: </label>
				<input id={path.id + "_start_time_input"} type="datetime-local" onChange={(e) => {
					var object = moment(e.target.value).toObject();
					if (!objectIsUnixStartTime(object)){
						this.props.setPathStartTime(path.id, object);
					}
				}}/>
				<br/>
				<label htmlFor={path.id + "_end_time_input"} >End Time in RS 2: </label>
				<input id={path.id + "_end_time_input"} type="datetime-local" onChange={(e) => {
					var object = moment(e.target.value).toObject();
					if (!objectIsUnixStartTime(object)){
						this.props.setPathEndTime(path.id, object)
					}
				}}/>
				<br/>
				<label htmlFor={path.id + "_time_dilation_factor_input"} >Time Dilation Factor: </label>
				<input id={path.id + "_time_dilation_factor_input"} type="number" defaultValue={path.dilationFactor}/>
				<br/>
				<label htmlFor={path.id + "_universe_input"} >Universe: </label>
				<input id={path.id + "_universe_input"} type="number" defaultValue={path.universe_index}/>
				<br/>
				<button onClick={() => this.props.deletePath(path.id)}>Delete Path</button>
			</div>
		);
  }
}

function mapStateToProps(state){
	return {
	}
}

function matchDispatchToProps(dispatch){
	return bindActionCreators({
		setPathStartTime,
		setPathEndTime,
		deletePath
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Path);
