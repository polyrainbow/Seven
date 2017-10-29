var msToYears = ms => Math.round(ms / 1000 / 60 / 60 / 24 / 365);
var msToDays = ms => Math.round(ms / 1000 / 60 / 60 / 24);
var msToHours = ms => Math.round(ms / 1000 / 60 / 60);
var msToSeconds = ms => Math.round(ms / 1000);

    var month_names = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

var msPairToUseful = (ms0, ms1) => {

	var distance = Math.abs(ms1 - ms0);

    if (distance > 31536000000){
        var unit = "years";
        var start_value = msToYears(ms0) + " " + unit;
        var end_value = msToYears(ms1) + " " + unit;
    } else if (distance > 86400000){
        unit = "days";
        start_value = msToDays(ms0) + " " + unit;
        end_value = msToDays(ms1) + " " + unit;
    } else if (distance > 3600000){
        unit = "hours";
        start_value = msToHours(ms0) + " " + unit;
        end_value = msToHours(ms1) + " " + unit;
    } else {
        unit = "seconds";
        start_value = msToSeconds(ms0) + " " + unit;
        end_value = msToSeconds(ms1) + " " + unit;
    }

	return {
		"start": start_value,
		"end": end_value
	};
}


module.exports = {
	msPairToUseful,
	month_names
}
