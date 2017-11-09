import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

var presets = require("../../presets/index.js");

import {
	setPreset
} from '../../actions/system.js';

class PresetMenu extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={{
				"margin": "0px 5px"
			}}>
				<label
					style={{
						"margin": "0px 5px"
					}}
					htmlFor="toolbar_select_preset"
				>Presets</label>
				<select
					onChange={(e) => this.props.setPreset(e.target.selectedIndex)}
					id="toolbar_select_preset"
				>
					{presets.map(p => <option>{p.name}</option>)}
				</select>
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
		setPreset
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(PresetMenu);
