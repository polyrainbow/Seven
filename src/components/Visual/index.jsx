import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import Universes3D from './Universes3D';
import TimelineTree from './TimelineTree';

class Visual extends Component {

	constructor(props, context) {
		super(props, context);
	}


	render() {
		return this.props.data.visualization_mode === "Timeline Tree" ? <TimelineTree/> : <Universes3D/>;
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
