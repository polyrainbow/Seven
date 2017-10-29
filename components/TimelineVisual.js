import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

var renderer = require("../utils/renderer.js");

class TimelineVisual extends Component {

	constructor(props, context) {
		super(props, context);
	}

	componentDidMount(){
		this.createVisualization(this.props.data)
	}


	componentWillReceiveProps(newProps){
		this.createVisualization(newProps.data)
	}


	createVisualization(data){

		var draw = function(paths, universes){

			var div = document.querySelector("#timeline-vis");
			var intrinsicWidth = div.getBoundingClientRect().width;
			var intrinsicHeight = div.getBoundingClientRect().height;

			// append the svg object to the body of the page
			// appends a 'group' element to 'svg'
			var svg = d3
			.select("#timeline-vis")
			.html("")
			.append("svg")
			.attr("viewBox", [0, 0, intrinsicWidth, intrinsicHeight].join(" "))
			.append("g");

			svg
			.append("rect")
			.style("fill", "#AAAAFF")
			.attr('x', "0")
			.attr('y', "0")
			.attr('width', "100%")
			.attr('height', "100%");

			var i = 0;
			var timelines = svg
			.selectAll('g.timeline')
			.data(universes, function(d) { d.index = ++i; return d.id; });

			// Enter any new timeline at the parent's previous position.
			var timelineEnter = timelines
			.enter()
			.append('g')
			.attr('class', 'timeline');


			timelineEnter
			.append("rect")
			.attr('class', 'timeline')
			.style("fill", "#000")
			.style("stroke", "#000")
			.style("stroke-width", "5")
			.attr('x', "20")
			.attr('y', t => t.index * 100)
			.attr('width', "300")
			.attr('height', "5");

			/*
			nodeEnter
			.filter(function(d){ return (!d.referenceNode); })
			.append("a")
		    .attr("xlink:href", function(d){
				return zettel_url_prefix + d.ekin;
			})
			.append('circle')
			.attr('class', 'node')
			.style("fill", "#fca")
			.style("stroke", "#000")
			.style("stroke-width", "8")
			.attr('r', "33")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

*/
		/*

			// Add labels for the (real) nodes
			nodeEnter
			.filter(d => !d.isSubstitution)
			.append("a")
		    .attr("xlink:href", function(d){
				return zettel_url_prefix + d.ekin;
			})
			.append('text')
			.attr("dy", ".35em")
			.attr("text-anchor", "middle")
			.text(d => d.name)
			.attr('font-size', "12")
			.style('font-family', "sans-serif")
			.attr('fill', "black")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
*/

/*
			var stub = svg
			.selectAll('g.stub')
			.data(stubs, function(d) {
				return d.id || (d.id = ++i);
			})
			.enter()
			.filter(d => !d.subNodes)
			.insert('path', "g")
			.attr("class", "link")
			.attr("stroke", "#77a")
			.attr("stroke-width", "7")
			.attr('d', function(d){
				return `M ${d.origin.x} ${d.origin.y}, ${d.origin.x + 30} ${d.origin.y + 30}`
			});
*/
		}

		draw(data.paths, data.universes);

	}

	render() {
		return (
			<div id="timeline-vis"/>
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

export default connect(mapStateToProps, matchDispatchToProps)(TimelineVisual);
