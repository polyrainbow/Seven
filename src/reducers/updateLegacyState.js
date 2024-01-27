export default function updateLegacyState(state) {
	state.paths.forEach(path => {
		path.spans.forEach(span => {
			if (!span.type) span.type = "frozen-0";
		})
	})
}
