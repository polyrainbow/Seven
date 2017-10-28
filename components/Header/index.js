import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AppTitle from './AppTitle';
import Toolbar from './Toolbar';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {
	loadState
} from '../../actions/system.js';

class Header extends Component {

	constructor(props) {
		super(props);
	}


	render() {
		return (
			<div className="header" style={{
			  "backgroundColor": "lightskyblue",
				"gridArea": "1 / 1 / 2 / 3",
				"padding": "10px",
				"display": "flex",
				"alignItems": "center",
				"justifyContent": "space-between"
			}}>
				<AppTitle/>
				<a
					style={{
						"margin": "0px 5px",
						"color": "#1d00ff",
						"textDecoration": "underline"
					}}
					href="https://webaudiotech.com/2017/10/25/seven-a-science-fiction-event-graph-generator/">
					About
				</a>
				<Toolbar/>
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

export default connect(mapStateToProps, matchDispatchToProps)(Header);
