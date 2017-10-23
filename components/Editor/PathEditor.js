import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {addPath} from '../../actions/index.js';

import Path from './Path';

const uuidv4 = require('uuid/v4');

class PathEditor extends Component {

	constructor(props, context) {
		super(props, context);
	}

	renderPaths(paths){

		var markup = [];

		paths.forEach((p, i, a) => {
			markup.push(
				<button onClick={() => this.props.addPath(i)}>Add path here</button>
			);

			markup.push(
				//keys of paths must be truly unique, so that there will be no mixing up in input fields
				<Path path={p} key={uuidv4()}/>
			);

			if (i === a.length - 1){
				markup.push(
					<button onClick={() => this.props.addPath(i + 1)}>Add path here</button>
				);
			}

		});

		if (paths.length === 0){
			markup.push(
				<button onClick={() => this.props.addPath(0)}>Add path</button>
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
