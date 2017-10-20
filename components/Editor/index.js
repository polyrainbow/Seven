import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import PathEditor from './PathEditor';

class Editor extends Component {

	constructor(props, context) {
		super(props, context);
	}


	render() {
		return (
			<div className="editor" style={{
				"gridArea": "2 / 1 / 3 / 2",
				"padding": "10px"
			}}>
				<label htmlFor="number_of_universes_input" >Number of universes </label>
				<input id="number_of_universes_input" type="number" defaultValue="1"/>
				<br/>
				<PathEditor paths={[{id: "1"}]}/>
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
