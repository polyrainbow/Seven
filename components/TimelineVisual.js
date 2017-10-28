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
		this.createVisualization(newProps)
	}


	createVisualization(zettel){

		var collectTimelines = (paths, universes) => {
			var timelines = [];
			var level = 0;

			var last_universe_index = null;

			paths.forEach((p, i, paths) => {
				if (p.universe_index !== last_universe_id){
					timelines.push({
						level,
					})
					level++;
				}
			});


		}


		var draw = function(paths, universes){

			var div = document.querySelector("#timeline-vis");
			var intrinsicWidth = 600;
			var intrinsicHeight = 400;

			var timelines = collectTimelines(paths, universes);

			// ****************** D3 section ***************************

			// append the svg object to the body of the page
			// appends a 'group' element to 'svg'
			var svg = d3
			.select("#timeline-vis")
			.html("")
			.append("svg")
			.attr("viewBox", [0, 0, intrinsicWidth, intrinsicHeight].join(" "))
			.append("g");

			// Update the nodes...
			var i = 0;
			var node = svg
			.selectAll('g.node')
			.data(nodes, function(d) {
				return d.id || (d.id = ++i);
			})

			// Enter any new modes at the parent's previous position.
			var nodeEnter = node
			.enter()
			.append('g')
			.attr('class', 'node');


			// Add Circle for the "normal" nodes, which are not substitutions
			// and have a reference node (which means, they are not the central
			// Home Node)
			nodeEnter
			.filter(function(d){ return (!d.isSubstitution) && (d.referenceNode); })
			.append("a")
		    .attr("xlink:href", function(d){
				return zettel_url_prefix + d.ekin;
			})
			.append('circle')
			.attr('class', 'node')
			.style("fill", "#fff")
			.style("stroke", "#77a")
			.style("stroke-width", "5")
			.attr('r', "27")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

			// ... and now for the central node
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

		}

		draw(data);

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
