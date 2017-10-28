import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PresetMenu from './PresetMenu';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {
	loadState
} from '../../actions/system.js';

class Toolbar extends Component {

	constructor(props) {
		super(props);
	}


	downloadState(){
		var json = JSON.stringify(this.props.appState, null, "\t");
		var blob = new Blob([json], {type: "application/json;charset=utf-8"});
		saveAs(blob, "my-timeline.seven.json");
	}

	handleFileInputChange(file){
		readFileAsJSON(file, (newState) => {
			this.props.loadState(newState);
		}, (e) => console.log(e));
	}

	render() {
		return (
			<div style={{
				"padding": "10px",
				"display": "flex",
				"alignItems": "baseline",
			}}>
				<PresetMenu/>
				<button
					style={{
						"marginLeft": "5px"
					}}
					onClick={() => this.downloadState()}
					disabled={this.props.appState.data.universes.length === 0 && this.props.appState.data.paths.length === 0}
				>
					Download
				</button>
				<button
					style={{
						"marginLeft": "5px"
					}}
					onClick={() => this.refs.fileInput.click()}
				>
					Load
				</button>
				<input
					ref="fileInput"
					id="fileInput"
					type="file"
					style={{"display": "none"}}
					onChange={(e) => this.handleFileInputChange(e.target.files[0])}
				/>
			</div>
		);
	}
}


function mapStateToProps(state){
	return {
		appState: state
	}
}

function matchDispatchToProps(dispatch){
	return bindActionCreators({
		loadState
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Toolbar);
