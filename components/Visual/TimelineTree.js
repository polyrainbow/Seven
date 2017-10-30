import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

var renderer = require("../../utils/renderer.js");
var moment = require("moment");

class TimelineTree extends Component {

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

		const PATH_THICKNESS = 5;
		const TIMELINE_GAP = 65;

		var getTimelineY = (i) => (i * TIMELINE_GAP) + TIMELINE_GAP;

		var draw = function(paths, universes){

			var div = document.querySelector("#timeline-vis");
			var intrinsicWidth = div.getBoundingClientRect().width;
			var intrinsicHeight = div.getBoundingClientRect().height;

			const MIN_X = 0.05 * intrinsicWidth;
			const MAX_X = 0.95 * intrinsicWidth;
			var drawingWidth = MAX_X - MIN_X;

			//compute timeline drawing widths for all universes
			universes.forEach(u => {
				u.drawStart = MIN_X + (u.relativeStart * drawingWidth);
				u.drawEnd = MIN_X + (u.relativeEnd * drawingWidth);
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

			//Timeline
			timelineEnter
			.append("line")
			.attr('class', 'timeline')
			.attr('stroke-linecap', "round")
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
			.attr('stroke-linecap', "round")
			.style("fill", "#000")
			.style("stroke", "#000")
			.style("stroke-width", "5")
			.attr('x1', t => t.drawStart)
			.attr('y1', t => {
				// get timeline index of last timeline that began before this one
				var timelinesThatBeganEarlier = universes.filter(u => {
					return (
						(u.relativeStart < t.relativeStart)
						&& (u.index < t.index)
					);
				});

				//parent timeline is the last timeline before this timeline, that began earlier
				if (timelinesThatBeganEarlier.length > 0){
					var parentTimeline = timelinesThatBeganEarlier[timelinesThatBeganEarlier.length - 1];
					return getTimelineY(parentTimeline.index);
				} else {
					return getTimelineY(t.index - 1);
				}


			})
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
			.text(u => {
			    if (u.RS2duration > 31536000000){
			        return u.earliestDateOfRef2.years;
			    } else if (u.RS2duration > 2628000000){
			        return moment(u.earliestDateOfRef2).format("MMM Y");
			    } else {
			        return moment(u.earliestDateOfRef2).format("D MMM Y");
			    }
			})
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
			.text(u => {
			    if (u.RS2duration > 31536000000){
			        return u.latestDateOfRef2.years;
			    } else if (u.RS2duration > 2628000000){
			        return moment(u.latestDateOfRef2).format("MMM Y");
			    } else {
			        return moment(u.latestDateOfRef2).format("D MMM Y");
			    }
			})
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


				//Valid (renderable) Span lines
				spanEnter
				.filter(span => {
					return (
						(typeof span.relativeStartRS2 === "number")
						&& (!isNaN(span.relativeStartRS2))
						&& (typeof span.relativeEndRS2 === "number")
						&& (!isNaN(span.relativeEndRS2))
					);
				})
				.append("line")
				.attr('class', 'span')
				.attr('stroke-linecap', "round")
				.style("stroke", path_colors[path_index])
				.style("stroke-width", PATH_THICKNESS)
				.attr('x1', span => {
					var u = universes.find(u => u.id === span.universe_id);
					return u.drawStart + (span.relativeStartRS2 * u.drawWidth);
				})
				.attr('y1', span => {
					var universe_index = universes.findIndex(u => u.id === span.universe_id);
					return getTimelineY(universe_index) - (PATH_THICKNESS * (path_index + 1));
				})
				.attr('x2', span => {
					var u = universes.find(u => u.id === span.universe_id);
					return u.drawStart + (span.relativeEndRS2 * u.drawWidth);
				})
				.attr('y2', span => {
					var universe_index = universes.findIndex(u => u.id === span.universe_id);
					return getTimelineY(universe_index) - (PATH_THICKNESS * (path_index + 1));
				});


				//universe cross links between spans
				spanEnter
				.filter((s, i) => {
					var next = spanEnter.data()[i+1];
					return next && (s.universe_id !== next.universe_id);
				})
				.append("line")
				.attr('class', 'span-crossline')
				.attr('stroke-linecap', "round")
				.attr('stroke-dasharray', "5, 10")
				.style("stroke", path_colors[path_index])
				.style("stroke-width", PATH_THICKNESS)
				.attr('x1', (span, i) => {
					var u = universes.find(u => u.id === span.universe_id);
					return u.drawStart + (span.relativeEndRS2 * u.drawWidth);
				})
				.attr('y1', (span, i) => {
					var universe_index = universes.findIndex(u => u.id === span.universe_id);
					return getTimelineY(universe_index) - (PATH_THICKNESS * (path_index + 1));
				})
				.attr('x2', (span, i) => {
					var target_universe = universes.find(u => u.id === spans[span.index+1].universe_id);spans[span.index+1];
					return target_universe.drawStart + (spans[span.index+1].relativeStartRS2 * target_universe.drawWidth);
				})
				.attr('y2', (span, i) => {
					var nextSpan = spans[span.index+1];
					var universe_index = universes.findIndex(u => u.id === nextSpan.universe_id);
					return getTimelineY(universe_index) - (PATH_THICKNESS * (path_index + 1));
				});

			});  //of paths.forEach

		}

		draw(data.paths, data.universes);

	}

	render() {
		return (
			<div
				id="timeline-vis"
				className="visualWrapper"
				style={{
					"gridArea": "2 / 2 / 3 / 3"
				}}
			/>
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

export default connect(mapStateToProps, matchDispatchToProps)(TimelineTree);
