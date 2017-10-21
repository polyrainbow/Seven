import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AppTitle from './AppTitle';
import PresetMenu from './PresetMenu';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class Header extends Component {

	constructor(props) {
		super(props);
	}

	downloadState(){
		var json = JSON.stringify(this.props.appState, null, "\t");
		var blob = new Blob([json], {type: "application/json;charset=utf-8"});
		saveAs(blob, "events.seven.json");
	}

	render() {
		return (
			<div className="header" style={{
			  "backgroundColor": "lightskyblue",
				"gridArea": "1 / 1 / 2 / 3",
				"padding": "10px",
				"display": "flex",
				"alignItems": "center",
				"justifyContent": "space-between"
			}}>
				<AppTitle/>
				<div style={{
				  	"padding": "10px",
					"display": "flex",
					"alignItems": "baseline",
				}}>
					<PresetMenu/>
					<button onClick={() => this.downloadState()}>Download</button>
				</div>
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
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Header);
