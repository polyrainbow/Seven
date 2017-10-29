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

			var timelineStart = 0.1 * intrinsicWidth;
			var timelineEnd = 0.9 * intrinsicWidth;
			var timelineWidth = timelineEnd - timelineStart;

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
			.attr('x1', timelineStart)
			.attr('y1', t => getTimelineY(t.index))
			.attr('x2', timelineEnd)
			.attr('y2', t => getTimelineY(t.index));


			timelineEnter
			.filter(u => u.isCreatedAtFirstEntering)
			.append("line")
			.attr('class', 'timeline')
			.style("fill", "#000")
			.style("stroke", "#000")
			.style("stroke-width", "5")
			.attr('x1', timelineStart)
			.attr('y1', t => getTimelineY(t.index - 1))
			.attr('x2', timelineStart)
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
				return "translate(" + (timelineStart + 6) + "," + (getTimelineY(u.index) + 9) + ")";
			});


			timelineEnter
			.append('text')
			.attr("dy", ".35em")
			.attr("text-anchor", "start")
			.text(u => moment(u.earliestDateOfRef2).format("MMM Y"))
			.attr('font-size', "12")
			.style('font-family', "sans-serif")
			.attr('fill', "black")
			.attr("transform", function(u) {
				return "translate(" + (timelineStart + 6) + "," + (getTimelineY(u.index) - 14) + ")";
			});


			timelineEnter
			.append('text')
			.attr("dy", ".35em")
			.attr("text-anchor", "end")
			.text(u => moment(u.latestDateOfRef2).format("MMM Y"))
			.attr('font-size', "12")
			.style('font-family', "sans-serif")
			.attr('fill', "black")
			.attr("transform", function(u) {
				return "translate(" + (timelineEnd - 6) + "," + (getTimelineY(u.index) - 14) + ")";
			});




			//TEST
			var spans = paths[0] && paths[0].spans || [];

			var i = 0;
			var svgSpans = svg
			.selectAll('g.span')
			.data(spans, function(d) { d.index = i; i++; return d.id; });

			// Enter any new timeline at the parent's previous position.
			var spanEnter = svgSpans
			.enter()
			.append('g')
			.attr('class', 'span');


			spanEnter
			.append("line")
			.attr('class', 'span')
			.style("stroke", "#0AF")
			.style("stroke-width", "5")
			.attr('x1', span => timelineStart + (span.relativeStartRS2 * timelineWidth))
			.attr('y1', span => getTimelineY(span.universe_index) - 5)
			.attr('x2', span => timelineStart + (span.relativeEndRS2 * timelineWidth))
			.attr('y2', span => getTimelineY(span.universe_index) - 5);


			spanEnter
			.filter((s, i) => {
				var next = spanEnter.data()[i+1];
				return next && (s.universe_index !== next.universe_index);
			})
			.append("line")
			.attr('class', 'span')
			.style("stroke", "#00E")
			.style("stroke-width", "5")
			.attr('x1', (span, i) => timelineStart + (span.relativeEndRS2 * timelineWidth))
			.attr('y1', (span, i) => getTimelineY(span.universe_index) - 5)
			.attr('x2', (span, i) => {
				return timelineStart + (spans[span.index+1].relativeStartRS2 * timelineWidth);
			})
			.attr('y2', (span, i) => {
				return getTimelineY(spans[span.index+1].universe_index) - 5;
			});

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
