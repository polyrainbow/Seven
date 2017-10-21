import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AppTitle from './AppTitle';
import PresetMenu from './PresetMenu';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

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
				<PresetMenu/>
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
