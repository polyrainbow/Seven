import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {addSpan} from '../../actions/spans.js';
import {setActivePath} from '../../actions/paths.js';

import Span from './Span';

class SpanEditor extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			"active_path_id": null
		}
	}


	getPathSelectOptions(paths){
		return paths.map(p =>
			<option
				onChange={() => this.props.setActivePath(p.id)}
				value={p.id}
			>
				{p.name || "Unnamed path"}
			</option>
		)

	}


	renderSpansOfPath(path){

		var markup = [];

		path.spans.forEach((s, i, a) => {
			markup.push(
				<button onClick={() => this.props.addSpan(path.id, i)}>Add span here</button>
			);

			markup.push(
				//keys of spans must be truly unique, so that there will be no mixing up in input fields
				<Span span={s} key={"span_" + s.id}/>
			);

			if (i === a.length - 1){
				markup.push(
					<button onClick={() => this.props.addSpan(path.id, i + 1)}>Add span here</button>
				);
			}

		});

		if (path.spans.length === 0){
			markup.push(
				<button onClick={() => this.props.addSpan(path.id, 0)}>Add span</button>
			);
		}

		return markup;

	}

	render() {
		return (
			<div>
				<h2>Spans</h2>
				<label htmlFor="spans_for_path_select">Spans for path: </label>
				<select>
					{this.getPathSelectOptions(this.props.data.paths)}
				</select>
				<br/>
				{this.props.data.active_path_id ? this.renderSpansOfPath(
					this.props.data.paths.find(p => p.id === this.props.data.active_path_id)
				) : "Please create a path before creating spans."}
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
		addSpan,
		setActivePath
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(SpanEditor);
