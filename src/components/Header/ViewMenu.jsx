import { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
	setVisualizationMode
} from '../../actions/system.js';

class ViewMenu extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<label
					style={{
						"margin": "0px 5px"
					}}
					htmlFor="toolbar_select_view"
				>
					View
				</label>
				<select
					onChange={(e) => this.props.setVisualizationMode(e.target.value)}
					value={this.props.data.visualization_mode}
					id="toolbar_select_view"
				>
					<option value="3D Universes">3D Universes</option>
					<option value="Timeline Tree">Timeline Tree</option>
				</select>
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
		setVisualizationMode
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ViewMenu);
