import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var moment = require("moment");

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {
	setUniverseName,
	deleteUniverse
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
				"margin": "10px 0px",
				"padding": "10px",
				"background": "url(assets/HubbleUltraDeepField_fade.jpg)"
			}}>
				<div style={{
					"display": "flex",
					"justifyContent": "space-between"
				}}>
					<h4>🌌 Universe</h4>
					<button onClick={() => this.props.deleteUniverse(universe.id)}>Delete</button>
				</div>
				<label htmlFor={universe.id + "_name_input"} >Name: </label>
				<input id={universe.id + "_name_input"} type="text" onChange={(e) => {
					this.props.setUniverseName(universe.id, e.target.value);
				}}
					defaultValue={universe.name}
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
		setUniverseName,
		deleteUniverse
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Universe);
