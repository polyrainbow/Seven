import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import PathEditor from './PathEditor';
import UniverseEditor from './UniverseEditor';

class Editor extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			"active_tab": "universes"
		}
	}


	render() {
		return (
			<div className="editor" style={{
				"gridArea": "2 / 1 / 3 / 2",
				"overflow": "auto"
			}}>
				<ul className="nav nav-tabs">
					<li className="nav-item" onClick={() => this.setState({"active_tab": "universes"})}>
						<a className={"nav-link" + (this.state.active_tab === "universes" ? " active" : "")} href="#">
							Universes
						</a>
					</li>
					<li className="nav-item" onClick={() => this.setState({"active_tab": "paths"})}>
						<a className={"nav-link" + (this.state.active_tab === "paths" ? " active" : "")} href="#">
							Paths
						</a>
					</li>
				</ul>
				<div style={{
					"padding": "10px"
				}}
				>
					{this.state.active_tab === "universes" ? <UniverseEditor /> : <PathEditor />}
				</div>
			</div>
		);
  }
}

function mapStateToProps(state){
	return {
	}
}

function matchDispatchToProps(dispatch){
	return bindActionCreators({
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Editor);
