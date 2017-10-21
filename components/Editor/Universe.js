import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var moment = require("moment");

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {
	setUniverseStartTime,
	setUniverseEndTime,
	deleteUniverse,
	setTimeDilationFactor
} from '../../actions/index.js';

class Universe extends Component {

	constructor(props, context) {
		super(props, context);
	}


	render() {

		var universe = this.props.universe;

		return (
			<div style={{
				"border": "2px solid grey",
				"margin": "10px",
				"padding": "10px"
			}}>
				<h3>Universe</h3>
				<label htmlFor={universe.id + "_name_input"} >Name: </label>
				<input id={universe.id + "_name_input"} type="text" onChange={(e) => {
					this.props.setUniverseName(universe.id, e.target.value);
				}}
					defaultValue={universe.name}
				/>
				<br/>
				<button onClick={() => this.props.deleteUniverse(universe.id)}>Delete Universe</button>
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
		setUniverseStartTime,
		setUniverseEndTime,
		deleteUniverse,
		setTimeDilationFactor
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Universe);
