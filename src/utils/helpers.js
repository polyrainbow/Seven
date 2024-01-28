/*
Copyright 2014 Sebastian Zimmer

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Helper functions. These are available in the global namespace!
 *
 * @module HELPERS
 */


/**
 * Clones a javascript object (instead of just copying references of it).
 * @method cloneObject
 * @param {mixed} obj Source object.
 * @return {mixed} clone Clone of the object
 * @static
 */
export function cloneObject(obj) {
    var clone = {};

	if (Array.isArray(obj)){
		clone = [];
	}


    for (var i in obj) {
        if (obj[i] && typeof obj[i] == 'object') {
            clone[i] = cloneObject(obj[i]);
        } else {
            clone[i] = obj[i];
        }
    }

    return clone;
}


/**
 * Parses a Javascript Blob object for its text. This obviously works only with text files.
 * @method readFileAsText
 * @param {mixed} file File as Blob object.
 * @param {function} onsuccess Callback function to be called when file is parsed. It gets the resulting string, if parsing was successful.
 * @static
 */
export function readFileAsText(file, onsuccess){

	var reader = new FileReader();

	reader.onload = function(e){

		var result = e.target.result;

		onsuccess(result);

	};

	reader.readAsText(file);

}



/**
 * Parses a JSON string to a JavaScript object. If JSON is invalid, the error is catched and a callback function is called. This is better than just relying on JSON.parse throwing real errors.
 * @method parseJSON
 * @param {string} string JSON string
 * @param {function} onsuccess Function to be called when JSON could be parsed. Javascript Object is passed as parameter.
 * @param {function} onerror Function to be called when JSON could not be parsed. No parameters are passed here.
 * @static
 */
function parseJSON(string, onsuccess, onerror){

	var object;

	try {
		object = JSON.parse(string);
	}

	catch (e) {
		log("parseJSON: String is not valid JSON");
		if (typeof onerror == "function"){
			onerror(e);
		}
		return;
	}

	if (typeof object == "undefined"){
		log("parseJSON: String is not valid JSON");
		if (typeof onerror == "function"){
			onerror();
		}
		return;
	}

	onsuccess(object);

}


/**
 * Reads the JSON content of a Javascript File Object and parses it.
 * @method readFileAsJSON
 * @param {Object} Javascript File Object to be parsed
 * @param {function} onsuccess Function to be called when JSON could be parsed. Javascript Object is passed as parameter.
 * @param {function} onerror Function to be called when JSON could not be parsed. No parameters are passed here.
 * @static
 */
export function readFileAsJSON(file, onsuccess, onerror){

	readFileAsText(file, function(result){
		parseJSON(result, onsuccess, onerror);
	});

}


/**
 * Searches an array of objects. If an object is found, where object[key]==value, the function returns the index of the object in the array.
 * @method getIndex
 * @param {Array} array Array of Javascript Objects
 * @param {String} key Key in object
 * @param {String} value Value of key in object
 * @return {Mixed} Returns index as number or undefined, if there is no such object.
 * @static
 */
export function getIndex(array, key, value){

	for (var i=0; i < array.length; i++){

		if (array[i][key] == value){
			return i;
		}
	}

	return undefined;

}

/**
 * Searches an array of objects. If an object is found, where object["id"]==value, the function returns the index of the object in the array.
 * @method getIndexByID
 * @param {Array} array Array of Javascript Objects
 * @param {String} id Value of ID
 * @return {Mixed} Returns index as number or undefined, if there is no such object.
 * @static
 */
export function getIndexByID(array, id){

	return getIndex(array, "id", id);

}


/**
 * Searches an array of objects. If an object is found, where object[key]==value, the function returns the respective object.
 * @method getObject
 * @param {Array} array Array of Javascript Objects
 * @param {String} key Key in object
 * @param {String} value Value of key in object
 * @return {Mixed} Returns an object or undefined, if there is no such object.
 * @static
 */
export function getObject(array, key, value){
  for (var i=0; i < array.length; i++){

    if (array[i][key] == value){
      return array[i];
    }
  }

  return undefined;

}


/**
 * Searches an array of objects. If an object is found, where object["id"]==value, the function returns the the respective object.
 * @method getIndexByID
 * @param {Array} array Array of Javascript Objects
 * @param {String} id Value of ID
 * @return {Mixed} Returns an object or undefined, if there is no such object.
 * @static
 */
export function getObjectByID(array, id){

	return getObject(array, "id", id);

}


/**
 * Iterates through ALL items of an array. This function should be preferred over forEach when the action could delete items of the array. I. e. this function iterates really through ALL items, even if some of them are deleted along the way.
 * @method forAllItems
 * @param {Array} array Any array
 * @param {Function} action Action that is performed on each item.
 * @static
 */
export function forAllItems(array, action){

	var i = array.length;

	for (;;){

		if (i !== 0) {
			i = i - 1;
		}

		else {
			return;
		}

		action(array[i]);

	}

}


/**
 * Creates an array with values by an array of JS objects. Of every object, the value of a specific key is taken.
 * @method getArrayWithValuesByKey
 * @param {Array} array Any array
 * @param {String} key Key, of which the value is taken.
 * @return {Array} Array with values.
 * @static
 */
export function getArrayWithValuesByKey(array, key){
	return array.map(function(item){
		return item[key];
	});
}


/**
 * Creates an array with IDs by an array of JS objects. Of every object, the value of the key "id" is taken.
 * @method getArrayWithIDs
 * @param {Array} array Any array
 * @return {Array} Array with IDs
 * @static
 */
export function getArrayWithIDs(array){

	return getArrayWithValuesByKey(array, "id");

}


//this method is also in dom, but has to be here too to avoid circular dependencies
var getSelectedRadioIndex = function (radios){

	for (var r = 0; r < radios.length; r++){

		if (radios[r].checked === true){

			return r;

		}

	}

	return 0;

};


var log = function(item){
	console.log(item);
};


//this method is also in dom, but has to be here too to avoid circular dependencies
var getSelectedRadioValue = function (radios){

	if (typeof radios == "string"){

		radios = document.getElementsByName(radios);

	}

	return radios[getSelectedRadioIndex(radios)].value;

};


export function get(name){

	var elem = document.getElementsByName(name);

	if (elem[0] && elem[0].nodeName == "INPUT" && elem[0].type == "radio"){
		return getSelectedRadioValue(elem);
	}

	elem = elem[0];

	if (typeof elem == "undefined"){

		elem = g(name);

	}

	if (typeof elem == "undefined"){

		console.error("get: Element " + name + " is undefined!");
		return;

	}

	switch (elem.nodeName){

		case "INPUT": return elem.value;

		case "TEXTAREA": return elem.value;

		case "SELECT": {
			if (elem.selectedIndex != -1){
				return elem.options[elem.selectedIndex].value;
			} else {
				return "";
			}
		}

		default: console.log("Function \"get\" has been misused with a " + elem.nodeName + " element. This should not have happened!");

	}
}


export function g(id){

	if (document.getElementById(id)){
		return document.getElementById(id);
	}

	if (document.getElementsByName(id).length > 0){
		return document.getElementsByName(id);
	}

	return undefined;

}


/**
 * Remove an element and provide a function that inserts it into its original position
 * @method removeToInsertLater
 * @param element {Element} The element to be temporarily removed
 * @return {Function} A function that inserts the element into its original position
 **/
export function removeToInsertLater(element) {
	var parentNode = element.parentNode;
	var nextSibling = element.nextSibling;
	parentNode.removeChild(element);
	return function() {
		if (nextSibling) {
			parentNode.insertBefore(element, nextSibling);
		} else {
			parentNode.appendChild(element);
		}
	};
}


/**
 * Remove an element and provide a function that inserts it into its original position
 * @param element {Element} The element to be temporarily removed
 * @return {Function} A function that inserts the element into its original position
 **/
export function o(object, property_array){
//returns value of object properties if they exist, if not returns ""

	var value = object;

	for (var p=0; p<property_array.length; p++){


		if (property_array[p] in value){
			value = value[property_array[p]];

		}

		else {
			return "";
		}

	}

	return value;

}


export function  a(array,index){

	var list = [];

	for (var i=0;i<array.length;i++){

		list.push(array[i][index]);

	}

	return list;

}


export function sortBySubKey(array,keys){

    return array.sort(function(a, b) {
        var x = a[keys[0]][keys[1]];
        var y = b[keys[0]][keys[1]];

        if (typeof x == "string"){
            x = x.toLowerCase();
            y = y.toLowerCase();
        }

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });


}


export function sortByKey(array, key) {

    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];

        if (typeof x == "string"){
            x = x.toLowerCase();
            y = y.toLowerCase();
        }

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


export function immutableSplice(arr, start, deleteCount, ...items) {
  return [ ...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount) ]
}


export function objectIsUnixStartTime(object) {
	return (
		(object.years === 1970)
		&& (object.months === 0)
		&& (object.date === 1)
		&& (object.hours === 1)
		&& (object.minutes === 0)
		&& (object.seconds === 0)
		&& (object.milliseconds === 0)
	);
}
