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
				"background": "radial-gradient(circle at 50% 10%, rgba(226, 240, 255, 0.79) -10%, transparent 90%), linear-gradient(140deg, rgba(255, 87, 87, 0.48) -20%, transparent 90%), linear-gradient(-150deg, rgb(145, 130, 236) -10%, transparent 60%), radial-gradient(40% 50% at 50% 120%, rgba(72, 0, 255, 0.25), transparent), linear-gradient(to right, rgba(135, 104, 255, 0.63), rgba(81, 39, 249, 0.65), #0009b2)"
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
