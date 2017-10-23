import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

var presets = require("../../reducers/presets.js");
console.log(presets)

import {
	setPreset
} from '../../actions/index.js';

class PresetMenu extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<label>Presets</label>
				<select onChange={(e) => this.props.setPreset(e.target.selectedIndex)}>
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
