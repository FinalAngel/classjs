/*!
 * @author      Angelo Dini
 * @version     1.0
 * @copyright	Distributed under the BSD License.
 */

(function(){
	'use strict';

	// saving constants
	var VERSION = '1.0';
	var ORIGINAL = window.Class;

	// creating global class variable
	var Class = window.Class = function (obj) {
		obj = obj || {};
		// call initialize if given
		var constructor = function () {
			return (this.initialize) ? this.initialize.apply(this, arguments) : self;
		};
		// adds implement to the class itself
		if(obj.implement) {
			var self = window === this ? copy(constructor.prototype) : this;
			var imp = obj.implement;
			remove(obj, 'implement');
			obj = extend(obj, implement(imp));
		}
		// assign prototypes
		constructor.prototype = copy(obj);
		// assign correct constructor for correct instanceof comparison
		constructor.constructor = constructor;
		// save initial object as parent so it can be called by this.parent
		constructor._parent = copy(obj);
		// attaching class properties to constructor
		for(var i = 0, values = ['extend', 'implement', 'getOptions', 'setOptions']; i < values.length; i++) {
			constructor[values[i]] = Class[values[i]];
		}

		return constructor;
	};

	// adding class method extend
	Class.extend = function (obj) {
		var self = this;
		// check if implement is passed through extend
		if(obj.implement) {
			this.prototype = extend(this.prototype, implement(obj.implement));
			// remove implement from obj
			remove(obj, 'implement');
		}
		// check if we should invoke parent when its called within a method
		for(var key in obj) {
			obj[key] = typeof obj[key] === 'function' && /parent/.test(obj[key].toString()) ? (function (method, name) {
				return function () {
					this.parent = self._parent[name];
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
		window.Class = ORIGINAL;
		return Class;
	};

	// returns current running version
	Class.version = VERSION;

	// helper for assigning methods to a new prototype
	function copy(obj) {
		var F = function () {};
			F.prototype = obj.prototype || obj;
		return new F();
	}

	// insures the removal of a given method name
	function remove(obj , name, safe){
		// if save is active we need to copy all attributes over.
		if(safe) {
			var safeObj = {};
			for(var key in obj) {
				if(key !== name) safeObj[key] = obj[key];
			}
		} else {
			delete obj[name];
		}
		return safeObj || obj;
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

			// safely remove initialize
			var safe = remove(array[i], 'initialize', true);

			// we use implement again if array has the apropriate methiod, otherwise we extend
			if(safe.implement) {
				collection = implement(safe.implement);
			} else {
				collection = extend(collection, safe);
			}
		}

		return collection;
	}

})();