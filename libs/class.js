/**
 * @author		Angelo Dini
 * @version     2.0
 * @copyright	http://www.divio.ch under the BSD Licence
 */
(function(){

	var Original = window.Class;
	var Constructor = function () {};

	var Class = this.Class = function (obj) {
		obj = obj || {};
		// call initialize if given
		Constructor = function () {
			var self = window === this ? copy(Constructor.prototype) : this;
			return (this.initialize) ? this.initialize.apply(this, arguments) : self;
		};
		// adds implement to the class itself
		if(obj.implement) {
			obj = extend(obj, implement(obj.implement));
			obj.implement = null;
		}
		// assign prototypes
		Constructor.prototype = copy(obj);
		// save initial object as parent so it can be called by this.parent
		Constructor._parent = copy(obj);
		// attaching class properties to constructor
		for(var i = 0, values = ['extend', 'implement', 'getOptions', 'setOptions']; i < values.length; i++) {
			Constructor[values[i]] = Class[values[i]];
		}

		return Constructor;
	};

	// adding class method extend
	Class.extend = function (obj) {
		// check if implement is passed through extend
		if(obj.implement) {
			this.prototype = extend(this.prototype, implement(obj.implement));
			// remove implement from obj
			delete obj.implement;
		}
		// check if we should invoke parent when its called within a method
		for(var key in obj) {
			obj[key] = typeof obj[key] === 'function' && /parent/.test(obj[key].toString()) ? (function (method, name) {
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
		// return the class if its assigned
		return this;
	};

	// adding class method implement
	Class.implement = function (array) {
		return this.prototype = extend(this.prototype, implement(array));
	};

	// gets options from constructor
	Class.getOptions = function () {
		return this.prototype.options || {};
	};

	// sets options for constructor
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
		var F = function () {};
			F.prototype = obj.prototype || obj;
		return new F();
	}

	// helper for merging two object with each other
	function extend(oldObj, newObj, preserve) {
		// failsave if something goes wrong
		if(!oldObj || !newObj) return oldObj || newObj || {};

		// make sure we work with copies
		oldObj = copy(oldObj);
		newObj = copy(newObj);

		for(var key in newObj) {
			if(Object.prototype.toString.call(newObj[key]) === '[object Object]') {
				extend(oldObj[key], newObj[key]);
			} else {
				// if preserve is set to true oldObj will not be overwritten by newObj if
				// oldObj has already a method key
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

			// we use implement again if array has the apropriate methiod, otherwise we extend
			if(array[i].implement) {
				collection = implement(array[i].implement);
			} else {
				collection = extend(collection, array[i].prototype || array[i]);
			}
		}

		return collection;
	}

})();