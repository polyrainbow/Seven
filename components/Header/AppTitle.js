import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class AppTitle extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={{
				"display": "flex",
				"alignItems": "center"
			}}>
				<div>
					<img
						src="assets/seven_logo.svg" style={{
							"height": "30px",
							"marginRight": "10px"
						}}
						alt="Seven Logo"
					/>
				</div>
				<div>
					<h1 style={{
						"margin": "0px",
						"fontSize": "20px"
					}}>
						SEven
					</h1>
					<p style={{
						"margin": "0px",
						"fontSize": "12px"
					}}>
						Science Fiction Event Graph Generator
					</p>
				</div>
			</div>
		);
	}
}
