import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {addPath} from '../../actions/index.js';

import Path from './Path';

class PathEditor extends Component {

	constructor(props, context) {
		super(props, context);
	}

	renderPaths(paths){

		var markup = [];

		paths.forEach((p, i, a) => {
			markup.push(
				<Path path={p}/>
			);

			markup.push(
				<button onClick={() => this.props.addPath(i)}>Add path here</button>
			);

		});

		if (paths.length === 0){
			markup.push(
				<button onClick={() => this.props.addPath(0)}>Add path here</button>
			);
		}

		return markup;

	}

	render() {
		return (
			<div>
				<h2>Paths</h2>
				{this.renderPaths(this.props.data.paths)}
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
		addPath
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(PathEditor);
