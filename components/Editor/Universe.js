import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var moment = require("moment");

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {
	setUniverseName,
	deleteUniverse,
	setActiveUniverse,
	setUniverseCreationType
} from '../../actions/universes.js';

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
					<div>
						<button
							onClick={() => this.props.setActiveUniverse(universe.id)}
							style={{
								"margin": "0px 5px"
							}}
						>
							Focus
						</button>
						<button onClick={() => this.props.deleteUniverse(universe.id)}>Delete</button>
					</div>
				</div>
				<label htmlFor={universe.id + "_name_input"} >Name: </label>
				<input
					id={universe.id + "_name_input"}
					type="text"
					onChange={(e) => {
						this.props.setUniverseName(universe.id, e.target.value);
					}}
					defaultValue={universe.name}
				/>
			<br/>
			<label htmlFor={universe.id + "_created_at_entering_input"}>Is created at first entering: </label>
			<input
				style={{
					"transform": "scale(2)"
				}}
				id={universe.id + "_created_at_entering_input"}
				type="checkbox"
				defaultChecked={universe.isCreatedAtFirstEntering}
				onChange={(e) => this.props.setUniverseCreationType(universe.id, e.target.checked)}
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
		deleteUniverse,
		setActiveUniverse,
		setUniverseCreationType
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Universe);
