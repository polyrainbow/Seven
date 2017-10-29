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


	areSpansInThisUniverse(universe_id, paths){
		var all_spans = [].concat(...paths.map(p => p.spans));
		var spans_in_this_universe = all_spans.filter(s => s.universe_id === universe_id);
		return spans_in_this_universe.length > 0;
	}


	render() {

		var universe = this.props.universe;

		var contains_spans = this.areSpansInThisUniverse(this.props.universe.id, this.props.data.paths);

		var background_active = "radial-gradient(circle at 50% 10%, rgba(226, 240, 255, 0.79) -10%, transparent 90%), linear-gradient(140deg, rgba(255, 87, 87, 0.48) -20%, transparent 90%), linear-gradient(-150deg, rgb(145, 130, 236) -10%, transparent 60%), radial-gradient(40% 50% at 50% 120%, rgba(72, 0, 255, 0.25), transparent), linear-gradient(to right, rgba(135, 104, 255, 0.63), rgba(81, 39, 249, 0.65), #0009b2)";
		var background_passive = "radial-gradient(circle at 50% 10%, rgba(226, 240, 255, 0.79) -10%, transparent 90%), linear-gradient(140deg, rgba(200, 200, 200, 0.48) -20%, transparent 90%), linear-gradient(-150deg, rgb(128, 128, 128) -10%, transparent 60%), radial-gradient(40% 50% at 50% 120%, rgba(72, 0, 255, 0.25), transparent), linear-gradient(to right, rgba(252, 252, 252, 0.63), rgba(138, 138, 138, 0.65), rgb(141, 141, 141))";

		return (
			<div style={{
				"border": "2px solid grey",
				"margin": "10px 0px",
				"padding": "10px",
				"background": this.props.data.active_universe_id === universe.id ? background_active : background_passive
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
						<button
							onClick={() => this.props.deleteUniverse(universe.id)}
							disabled={contains_spans}
							title={contains_spans ? "This universe cannot be deleted because it contains spans. Please assign those spans another universe first." : "Delete this universe"}
						>
							Delete
						</button>
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
