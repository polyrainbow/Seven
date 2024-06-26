import { Component } from 'react';
import ViewMenu from './ViewMenu.jsx';
import PresetMenu from './PresetMenu.jsx';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
	loadState
} from '../../actions/system.js';
import { readFileAsJSON } from '../../utils/helpers.js';
import saveAs from '../../utils/FileSaver.js';

class Toolbar extends Component {

	constructor(props) {
		super(props);
	}


	downloadState(){
		var json = JSON.stringify(this.props.appState, null, "  ");
		var blob = new Blob([json], {type: "application/json;charset=utf-8"});
		saveAs(blob, "my-timeline.seven.json");
	}

	handleFileInputChange(e){
		var file = e.target.files[0];
		readFileAsJSON(file, (newState) => {
			this.props.loadState(newState);
		}, (e) => console.log(e));
		e.target.value = "";
	}

	render() {
		return (
			<div style={{
				"padding": "10px",
				"display": "flex",
				"alignItems": "center",
			}}>
				<ViewMenu/>
				<PresetMenu/>
				<button
					style={{
						"marginLeft": "5px"
					}}
					onClick={() => this.downloadState()}
					disabled={this.props.appState.data.universes.length === 0 && this.props.appState.data.paths.length === 0}
				>
					Save
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
					onChange={this.handleFileInputChange.bind(this)}
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
