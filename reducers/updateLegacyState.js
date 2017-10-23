var uuidv4 = require("uuid/v4");

var updateLegacyState = (data) => {
    console.log("Updating legacy state");
    console.log(data)
    data.universes.forEach(u => u.id = uuidv4());
    data.paths.forEach(p => p.id = uuidv4());
    return data;
}

module.exports = updateLegacyState;
