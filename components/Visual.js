import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

var renderer = require("../utils/renderer.js");

class Visual extends Component {

	constructor(props, context) {
		super(props, context);
	}

	componentDidMount(){
		//renderer.init(this.refs.visualWrapper);
		//renderer.refresh(this.props.data);
	}


	componentWillReceiveProps(newProps){
		//renderer.refresh(newProps.data);
	}

	render() {
		return (
			<div ref="visualWrapper" className="visualWrapper" style={{
				"gridArea": "2 / 2 / 3 / 3"
			}} />
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
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Visual);
