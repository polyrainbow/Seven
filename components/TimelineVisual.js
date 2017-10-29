import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

var renderer = require("../utils/renderer.js");
var moment = require("moment");

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

		var getTimelineY = (i) => i * 100 + 100;

		var draw = function(paths, universes){

			var div = document.querySelector("#timeline-vis");
			var intrinsicWidth = div.getBoundingClientRect().width;
			var intrinsicHeight = div.getBoundingClientRect().height;

			const PATH_THICKNESS = 5;

			var x_start = 0.05 * intrinsicWidth;
			var x_end = 0.95 * intrinsicWidth;
			var drawingWidth = x_end - x_start;

			//compute timeline drawing widths for all universes
			universes.forEach(u => {
				u.drawStart = x_start + (u.relativeStart * drawingWidth);
				u.drawEnd = x_start + (u.relativeEnd * drawingWidth);
				u.drawWidth = u.drawEnd - u.drawStart;
			});

			// append the svg object to the body of the page
			// appends a 'group' element to 'svg'
			var svg = d3
			.select("#timeline-vis")
			.html("")
			.append("svg")
			.attr("viewBox", [0, 0, intrinsicWidth, intrinsicHeight].join(" "))
			.append("g");

			//Background color
			svg
			.append("rect")
			.style("fill", "#DDDDFF")
			.attr('x', "0")
			.attr('y', "0")
			.attr('width', "100%")
			.attr('height', "100%");

			var i = 0;
			var timelines = svg
			.selectAll('g.timeline')
			.data(universes, function(d) { d.index = i; i++; return d.id; });

			// Enter any new timeline at the parent's previous position.
			var timelineEnter = timelines
			.enter()
			.append('g')
			.attr('class', 'timeline');


			timelineEnter
			.append("line")
			.attr('class', 'timeline')
			.style("fill", "#000")
			.style("stroke", "#000")
			.style("stroke-width", "5")
			.attr('x1', t => t.drawStart)
			.attr('y1', t => getTimelineY(t.index))
			.attr('x2', t => t.drawEnd)
			.attr('y2', t => getTimelineY(t.index));

			//vertical link line of timeline
			timelineEnter
			.filter(u => u.isCreatedAtFirstEntering)
			.append("line")
			.attr('class', 'timeline')
			.style("fill", "#000")
			.style("stroke", "#000")
			.style("stroke-width", "5")
			.attr('x1', t => t.drawStart)
			.attr('y1', t => getTimelineY(t.index - 1))
			.attr('x2', t => t.drawStart)
			.attr('y2', t => getTimelineY(t.index));


			// Universe name label
			timelineEnter
			.append('text')
			.attr("dy", ".35em")
			.attr("text-anchor", "left")
			.text(u => u.name)
			.attr('font-size', "12")
			.style('font-family', "sans-serif")
			.attr('fill', "black")
			.attr("transform", function(u) {
				return "translate(" + (u.drawStart + 6) + "," + (getTimelineY(u.index) + 12) + ")";
			});


			//Start of univere date text
			timelineEnter
			.append('text')
			.attr("dy", ".35em")
			.attr("text-anchor", "start")
			.text(u => moment(u.earliestDateOfRef2).format("MMM Y"))
			.attr('font-size', "12")
			.style('font-family', "sans-serif")
			.attr('fill', "black")
			.attr("transform", function(u) {
				return "translate(" + (u.drawStart + 6) + "," + (getTimelineY(u.index) - 14) + ")";
			});

			//End of universe date text
			timelineEnter
			.append('text')
			.attr("dy", ".35em")
			.attr("text-anchor", "end")
			.text(u => moment(u.latestDateOfRef2).format("MMM Y"))
			.attr('font-size', "12")
			.style('font-family', "sans-serif")
			.attr('fill', "black")
			.attr("transform", function(u) {
				return "translate(" + (u.drawEnd - 6) + "," + (getTimelineY(u.index) - 14) + ")";
			});


			var path_colors = [
				"#07F",
				"#F70",
				"#7F0"
			];

			//draw all paths
			paths.forEach((path, path_index) => {
				var spans = path.spans;

				var i = 0;
				var svgSpans = svg
				.selectAll('g.span_of_path_' + path.id)
				.data(spans, function(d) {
					d.index = i;
					i++;
					return d.id;
				});


				var spanEnter = svgSpans
				.enter()
				.append('g')
				.attr('class', 'span');


				//Span line
				spanEnter
				.append("line")
				.attr('class', 'span')
				.attr('stroke-linecap', "round")
				.style("stroke", path_colors[path_index])
				.style("stroke-width", PATH_THICKNESS)
				.attr('x1', span => {
					var u = universes[span.universe_index];
					return u.drawStart + (span.relativeStartRS2 * u.drawWidth);
				})
				.attr('y1', span => getTimelineY(span.universe_index) - (PATH_THICKNESS * (path_index + 1)))
				.attr('x2', span => {
					var u = universes[span.universe_index];
					return u.drawStart + (span.relativeEndRS2 * u.drawWidth)
				})
				.attr('y2', span => {
					return getTimelineY(span.universe_index) - (PATH_THICKNESS * (path_index + 1));
				});


				//universe cross links between spans
				spanEnter
				.filter((s, i) => {
					var next = spanEnter.data()[i+1];
					return next && (s.universe_index !== next.universe_index);
				})
				.append("line")
				.attr('class', 'span-crossline')
				.attr('stroke-linecap', "round")
				.style("stroke", path_colors[path_index])
				.style("stroke-width", PATH_THICKNESS)
				.attr('x1', (span, i) => {
					var u = universes[span.universe_index];
					return u.drawStart + (span.relativeEndRS2 * u.drawWidth);
				})
				.attr('y1', (span, i) => getTimelineY(span.universe_index) - (PATH_THICKNESS * (path_index + 1)))
				.attr('x2', (span, i) => {
					var target_universe_index = spans[span.index+1].universe_index;
					var u = universes[target_universe_index];
					return u.drawStart + (spans[span.index+1].relativeStartRS2 * u.drawWidth);
				})
				.attr('y2', (span, i) => {
					return getTimelineY(spans[span.index+1].universe_index) - (PATH_THICKNESS * (path_index + 1));
				});

			});  //of paths.forEach

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
