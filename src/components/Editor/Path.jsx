import { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {
	setPathName,
	deletePath,
	setPathDescription,
	setActivePath
} from '../../actions/paths.js';

class Path extends Component {

	constructor(props, context) {
		super(props, context);
	}


	getUniverseOptions(data){
		return data.universes.map((u, i) => {
			return <option value={i}>{u.name}</option>;
		});
	}

	render() {

		var path = this.props.path;

		var background_active = "radial-gradient(circle at 50% 10%, rgba(255, 197, 125, 0.79) -10%, transparent 90%), linear-gradient(140deg, rgba(255, 87, 87, 0.48) -20%, transparent 90%), linear-gradient(-150deg, rgb(59, 214, 255) -10%, transparent 60%), radial-gradient(40% 50% at 50% 120%, rgba(30, 12, 76, 0.25), transparent), linear-gradient(to right, rgba(245, 34, 116, 0.63), rgb(39, 97, 249), white)";
		var background_passive = "radial-gradient(circle at 50% 10%, rgba(202, 202, 202, 0.79) -10%, transparent 90%), linear-gradient(140deg, rgba(255, 87, 87, 0.48) -20%, transparent 90%), linear-gradient(-150deg, rgb(169, 199, 207) -10%, transparent 60%), radial-gradient(40% 50% at 50% 120%, rgba(30, 12, 76, 0.25), transparent), linear-gradient(to right, rgba(226, 194, 207, 0.63), rgb(151, 159, 178), white)";

		return (
			<div className="path" style={{
				"border": "2px solid grey",
				"margin": "10px 0px",
				"padding": "10px",
				"background": this.props.data.active_path_id === path.id ? background_active : background_passive
			}}>
				<div style={{
					"display": "flex",
					"justifyContent": "space-between"
				}}>
					<h4>📈 Path</h4>
					<div>
						<button
							onClick={() => this.props.setActivePath(path.id)}
							style={{
								"margin": "0px 5px"
							}}
						>
							Display
						</button>
						<button onClick={() => this.props.deletePath(path.id)}>Delete</button>
					</div>
				</div>
				<label htmlFor={path.id + "_name"} >Name: </label>
				<input
					id={path.id + "_name"}
					type="text"
					onChange={(e) => {this.props.setPathName(path.id, e.target.value)}}
					defaultValue={path.name}
				/>
				<br/>
				<label htmlFor={path.id + "_description_input"}>Description: </label>
				<textarea
					style={{
						"width": "100%",
    					"height": "90px"
					}}
					id={path.id + "_description_input"}
					defaultValue={path.description}
					onChange={(e) => this.props.setPathDescription(path.id, e.target.value)}
				/>
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
		setPathName,
		deletePath,
		setPathDescription,
		setActivePath
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Path);
