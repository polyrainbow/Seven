import { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addSpan} from '../../actions/spans.js';
import {setActivePath} from '../../actions/paths.js';
import Span from './Span.jsx';

class SpanEditor extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			"active_path_id": null
		}
	}


	renderActivePathSelect(){
		return [
			<label key={Math.random()} htmlFor="spans_for_path_select">Spans for path: </label>,
			<select
				key={Math.random()}
				onChange={(e) => this.props.setActivePath(e.target.value)}
				value={this.props.data.active_path_id}
			>
				{this.getPathSelectOptions(this.props.data.paths)}
			</select>,
			<br key={Math.random()} />
		];
	}


	getPathSelectOptions(paths){
		return paths.map(p =>
			<option
				key={Math.random()}
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
				<button
          key={Math.random()}
					onClick={() => this.props.addSpan(path.id, i)}
				>Add span here</button>
			);

			markup.push(
				//keys of spans must be truly unique, so that there will be no mixing up in input fields
				<Span span={s} key={"span_" + s.id}/>
			);

			if (i === a.length - 1){
				markup.push(
					<button
						key={Math.random()}
            onClick={() => this.props.addSpan(path.id, i + 1)}
					>Add span here</button>
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
				{((this.props.data.paths.length > 0) && (this.props.data.universes.length > 0)) ? this.renderActivePathSelect() : ""}
				{(this.props.data.active_path_id && (this.props.data.universes.length > 0)) ? this.renderSpansOfPath(
					this.props.data.paths.find(p => p.id === this.props.data.active_path_id)
				) : "Please create a universe and a path before creating spans."}
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
