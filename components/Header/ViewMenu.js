import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

var presets = require("../../presets/index.js");

import {
	setPreset
} from '../../actions/system.js';

class ViewMenu extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<label>View</label>
				<select onChange={(e) => this.props.setPreset(e.target.selectedIndex)}>
					<option>3D Universes</option>
					<option>Timeline Tree</option>
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

export default connect(mapStateToProps, matchDispatchToProps)(ViewMenu);
