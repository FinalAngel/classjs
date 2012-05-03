/**
 * @author		Angelo Dini
 * @version     2.0
 * @copyright	http://www.divio.ch under the BSD Licence
 */
(function(){

	var Original = window.Class;
	var Constructor = function(){};

	var Class = this.Class = function (obj) {
		obj = obj || {};
		// creating constructor
		Constructor = function() {
			return (this.initialize) ? this.initialize.apply(this, arguments) : this;
		};
		// handle implement
		if(obj.implement) {
			obj = extend(obj, implement(obj.implement));
			obj.implement = null;
		}
		// assign prototype
		Constructor.prototype = copy(obj);
		// save untouched object as parent
		Constructor._parent = copy(obj);
		// attaching properties
		for(var i = 0, values = ['extend', 'implement', 'getOptions', 'setOptions', 'parent']; i < values.length; i++) {
			Constructor[values[i]] = Class[values[i]];
		}
		console.log(Constructor);

		// return
		return Constructor;
	};

	// implementing extend
	Class.extend = function (obj) {
		// check if implement is passed through extend
		if(obj.implement) {
			this.prototype = extend(this.prototype, implement(obj.implement));
			// remove implement from obj
			delete obj.implement;
		}
		// invoke parent if its called within a method
		for(var key in obj) {
			obj[key] = typeof obj[key] === 'function' && /parent/.test(obj[key].toString()) ? (function(method, name) {
				return function () {
					this.parent = Constructor._parent[name];
					return method.apply(this, arguments);
				};
			})(obj[key], key) : obj[key]
		}
		// assign new parent
		this._parent = extend(this._parent, obj, true);
		// assign new prototype
		this.prototype = extend(this.prototype, obj);
	};

	// implementing implement
	Class.implement = function (array) {
		// assigning new prototype
		return this.prototype = extend(this.prototype, implement(array));
	};

	// get options back from constructor
	Class.getOptions = function () {
		// return the available options or an empty object
		return this.prototype.options || {};
	};

	// set options for constructor
	Class.setOptions = function (options) {
		return this.prototype.options = extend(this.prototype.options, options);
	};

	// preventing conflicts
	Class.noConflict = function () {
		// reassign original Class obj to window
		window.Class = Original;
		return Class;
	};

	// helper for assigning methods to a new prototype
	function copy(obj) {
		var F = function() {};
			F.prototype = obj.prototype || obj;
		return new F();
	}

	// helper for merging two object with each other
	function extend(oldObj, newObj, preserve) {
		// return available object if
		if(!oldObj || !newObj) return oldObj || newObj || {};

		// make sure we work with copies
		oldObj = copy(oldObj);
		newObj = copy(newObj);

		for(var key in newObj) {
			if(Object.prototype.toString.call(newObj[key]) === '[object Object]') {
				extend(oldObj[key], newObj[key]);
			} else {
				// if preserce is active and the oldObj already has the required method
				// we skip the reassigning
				oldObj[key] = (preserve && oldObj[key]) ? oldObj[key] : newObj[key];
			}
		}

		return oldObj;
	}

	// helper for implementing other classes or objects
	function implement(array) {
		var collection = {};

		for(var i = 0; i < array.length; i++) {
			// check if a class is implemented and save its prototype
			if(typeof(array[i]) === 'function') array[i] = array[i].prototype;

			// array[i].implement || array[i].implement
			if(array[i].implement) {
				collection = implement(array[i].implement);
			} else {
				collection = extend(collection, array[i].prototype || array[i]);
			}
		}

		return collection;
	}

})();