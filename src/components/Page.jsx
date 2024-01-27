import React, { Component } from 'react';

import Header from './Header/index.jsx';
import Editor from './Editor/index.jsx';
import Visual from './Visual/index.jsx';

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
