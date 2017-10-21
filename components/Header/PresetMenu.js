import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class PresetMenu extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<label>Presets</label>
				<select>
					<option></option>
					<option>Marty McFly</option>
					<option>Spock</option>
					<option>Cooper</option>
				</select>
			</div>
		);
	}
}
