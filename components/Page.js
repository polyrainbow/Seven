import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from './Header';
import Editor from './Editor/';
import Visual from './Visual/';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class Page extends Component {

	constructor(props, context) {
		super(props, context);
	}


	render() {
		var page =
			<div style={{
				"display": "grid",
				"gridTemplateColumns": "600px auto",
  				"gridTemplateRows": "50px auto",
				"position": "fixed",
				"top": "0px",
				"bottom": "0px",
				"left": "0px",
				"right": "0px",
			}}>
				<Header/>
				<Editor/>
				<Visual/>
			</div>;

		return page;

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

export default connect(mapStateToProps, matchDispatchToProps)(Page);
