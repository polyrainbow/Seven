import { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addUniverse} from '../../actions/universes.js';
import Universe from './Universe.jsx';

class UniverseEditor extends Component {

	constructor(props, context) {
		super(props, context);
	}

	renderUniverses(universes){
		var markup = [];

		universes.forEach((u, i, a) => {
			markup.push(
				<button key={Math.random()} onClick={() => this.props.addUniverse(i)}>Add universe here</button>
			);

			markup.push(
				<Universe universe={u} key={"universe_" + u.id}/>
			);

			if (i === a.length - 1){
				markup.push(
					<button key={Math.random()} onClick={() => this.props.addUniverse(i + 1)}>Add universe here</button>
				);
			}

		});

		if (universes.length === 0){
			markup.push(
				<button key={Math.random()} onClick={() => this.props.addUniverse(0)}>Add universe</button>
			);
		}

		return markup;

	}

	render() {
		return (
			<div>
				<h2>Universes</h2>
				{this.renderUniverses(this.props.data.universes)}
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
		addUniverse
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(UniverseEditor);
