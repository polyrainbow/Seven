import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import PathEditor from './PathEditor';
import UniverseEditor from './UniverseEditor';

class Editor extends Component {

	constructor(props, context) {
		super(props, context);
	}


	render() {
		return (
			<div className="editor" style={{
				"gridArea": "2 / 1 / 3 / 2",
				"padding": "10px",
				"overflow": "auto"
			}}>
				<UniverseEditor />
				<br/>
				<PathEditor />
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
