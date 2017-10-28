import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import UniverseEditor from './UniverseEditor';
import PathEditor from './PathEditor';
import SpanEditor from './SpanEditor';

class Editor extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			"active_tab": "universes"
		}
	}


	getEditor(active_tab){
		if (active_tab === "universes"){
			return <UniverseEditor />;
 		}
		if (active_tab === "paths"){
			return <PathEditor/>;
		}
		if (active_tab === "spans"){
			return <SpanEditor />;
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
					<li className="nav-item" onClick={() => this.setState({"active_tab": "spans"})}>
						<a className={"nav-link" + (this.state.active_tab === "spans" ? " active" : "")} href="#">
							Spans
						</a>
					</li>
				</ul>
				<div style={{
					"padding": "10px"
				}}
				>
					{this.getEditor(this.state.active_tab)}
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
