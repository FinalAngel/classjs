/**
 * @author		Angelo Dini
 * @version     2.0
 * @copyright	http://www.divio.ch under the BSD Licence
 */

/**
 * TESTS
 */
module("class.js");

test('Core functionality', function() {
	// tests
	equal(typeof(window.Class), 'function', 'class is available within the window object');
	equal(typeof(Class), 'function', 'Class is available to be called');
	equal(objIsEmpty(Class.prototype), true, 'prototype is empty');

	testConstructor(Class);
});

test('Class constructor', function () {
	// setup
	var Animal = new Class();
	var Person = new Class({});
	var Computer = new Class({
		'calc': function () {}
	});

	// tests
	equal(typeof(Animal), 'function', 'class is created');
	equal(objIsEmpty(Animal.prototype), true, 'animal prototype is empty');
	equal(objIsEmpty(Person.prototype), true, 'person prototype is empty');
	equal(objIsEmpty(Computer.prototype), false, 'computer prototype is not empty');

	ok(!(Animal instanceof Class), 'animal is not an instance of class');

	var Correct = new Class({
		'isCorrect': function () {}
	});
	// using strict mode allows it at this point to "forget" the new keyword
	var Wrong = Class({
		'isWrong': function () {}
	});
	equal(typeof(Correct.prototype.isCorrect), 'function', 'invoking class with new keyword works');
	equal(typeof(Wrong.prototype.isWrong), 'function', 'invoking class without the new keyword works');

	equal(typeof(new Correct().isCorrect), 'function', 'invoking instance with new keyword works');
	// you should not be able to call Wrong().isWrong without the new keyword
	equal(typeof(new Wrong().isWrong), 'function', 'invoking instance with new keyword works');

	testConstructor(Animal);
});

test('Class noConflict', function () {
	// setup
	var Original = window.Class;
	var Classy = Class.noConflict();
	var Animal = new Classy();

	// tests
	strictEqual(window.Class, undefined, 'noConflict unsets Class from window');
	deepEqual(Classy, Original, 'noConflict binds the new variable with Class behaviour');

	testConstructor(Animal);

	ok(true, 'For a live example consult libsTest.html');

	window.Class = Original;
});

test('Class method extend', function () {
	// setup
	var Animal = new Class({
		'initialize': function (name, age) {
			this.name = name;
			this.age = age;
		}
	});
	Animal.extend({
		'eat': function () {
			return this.name + ' is eating';
		},
		'die': function () {
			return this.name + ' died at age ' + this.age;
		}
	});
	var name = 'Cat', age = 43, instance = new Animal(name, age);

	// tests
	equal(typeof(Animal.prototype.initialize), 'function', 'initialize has been added');
	equal(typeof(Animal.prototype.eat), 'function', 'eat has been added');
	equal(typeof(Animal.prototype.die), 'function', 'die has been added');

	equal(instance.name, name, 'this.name can be called');
	equal(instance.age, age, 'this.age can be called');

	equal(instance.eat(), name + ' is eating', 'this.eat() can be called');
	equal(instance.die(), name + ' died at age ' + age, 'this.die() can be called');

	ok(instance instanceof Animal, 'correct instance for class is given');
});

test('Class method implement', function () {
	// setup
	var Animal = new Class({
		'initialize': function (name, age) {
			this.name = name;
			this.age = age;
		}
	});
	var essentials = {
		'eat': function () {
			return this.name + ' is eating';
		},
		'die': function () {
			return this.name + ' died at age ' + this.age;
		}
	};
	var advanced = {
		'dance': function () {
			return this.name + ' is dancing';
		},
		'fly': function () {
			return this.name + ' is flying';
		}
	};
	var professional = {
		'invincible': true
	};

	Animal.implement([essentials, advanced]);

	var Cat = new Class({
		'implement': [Animal],
		// initialize is not passed by implement
		'initialize': function (name, age) {
			this.name = name;
			this.age = age;
		},
		'cuteness': function () {
			return this.name + '\'s level is 99';
		}
	});
	Cat.extend({
		'implement': [professional],
		'superpower': true
	});
	var myCat = new Cat('Sora', 2);

	// tests
	equal(typeof(Cat.prototype.initialize), 'function', 'initialize has been added');
	equal(typeof(Cat.prototype.eat), 'function', 'eat has been added');
	equal(typeof(Cat.prototype.die), 'function', 'die has been added');
	equal(typeof(Cat.prototype.dance), 'function', 'dance has been added');
	equal(typeof(Cat.prototype.fly), 'function', 'fly has been added');
	equal(typeof(Cat.prototype.cuteness), 'function', 'cuteness has been added');
	strictEqual(Cat.prototype.invincible, true, 'cuteness has been added');
	strictEqual(Cat.prototype.superpower, true, 'cuteness has been added');
	strictEqual(Cat.prototype.implement, undefined, 'implement has not been passed');
	equal(myCat.cuteness(), 'Sora\'s level is 99', 'appropriate methods can be called');
});

test('Class method getOptions', function () {
	// setup
	var Animal = new Class({
		'options': {
			'name': 'Unnamed',
			'age': 5
		},
		'initialize': function (name, age) {
			this.name = name || this.options.name;
			this.age = age || this.options.age;
		}
	});
	var options = Animal.getOptions();
	var Cat = new Animal('Sora', 2);

	// tests
	equal(options.name, 'Unnamed', 'option name can be read via getOptions');
	equal(options.age, 5, 'option age can be read via getOptions');

	equal(Cat.options.name, 'Unnamed', 'option name can be read via method call');
	equal(Cat.options.age, 5, 'option age can be read via method call');

	equal(Cat.name, 'Sora', 'class name is set correctly');
	equal(Cat.age, 2, 'class age is set correctly');
});

test('Class method setOptions', function () {
	// setup
	var Animal = new Class({
		'options': {
			'name': 'Unnamed',
			'age': 5
		},
		'initialize': function (name, age) {
			this.name = name || this.options.name;
			this.age = age || this.options.age;
		}
	});

	var Cat = new Animal('Sora', 2);
	var Dog = new Animal('Pitschy', 1);

	// tests
	equal(Cat.options.age, 5, 'option age can be read via method call');
	equal(Dog.options.age, 5, 'option age can be read via method call');

	Animal.setOptions({ 'age': 10 });
	equal(Cat.options.age, 10, 'option age can be read via method call');
	equal(Dog.options.age, 10, 'option age can be read via method call');

	Animal.setOptions({ 'age': 15 });
	equal(Cat.options.age, 15, 'option age can be read via method call');
	equal(Dog.options.age, 15, 'option age can be read via method call');

	equal(Cat.age, 2, 'correct age is given');
	equal(Dog.age, 1, 'correct age is given');

	equal(Cat.options.name, 'Unnamed', 'option name can be read via method call');
	equal(Dog.options.name, 'Unnamed', 'option name can be read via method call');

	ok(Cat instanceof Animal, 'correct instance for class is given');
	ok(Dog instanceof Animal, 'correct instance for class is given');
});

test('Class method parent', function () {
	// setup
	var Animal = new Class({
		'initialize': function (name, age) {
			this.name = name;
			this.age = age;
		},
		'eat': function () {
			this.name = 'Pitschy';

			return this.name + ' call FIRST eat';
		},
		'live': function () {
			// the return value will be overwritten
			return this.age + ' call FIRST live';
		}
	});
	Animal.extend({
		'die': function () {}
	});
	Animal.extend({
		'eat': function () {
			this.parent();

			return this.name + ' call SECOND eat';
		},
		'live': function () {
			this.parent();

			return this.age + ' call SECOND live';
		}
	});

	var Cat = new Animal('Sora', 2);

	// tests
	equal(Cat.eat(), 'Pitschy call SECOND eat', 'parent works on first invocation');
	equal(Cat.live(), '2 call SECOND live', 'parent works on second invocation');
	equal(typeof(Cat.die), 'function', 'extending function has been attached');

	ok(Cat.parent(), 'parent is attached to the normal object');
});

test('Class method version', function () {
	// tests
	equal(typeof(Class.version), 'string', 'Class.version() can be called');
});

test('Class demo examples', function () {
	var Dimmer = new Class({
		initialize: function (container) {
			this.container = document.getElementById(container);
		},
		showDim: function () {
			console.log('first');
			return 'show dim';
		},
		hideDim: function () {
			return 'hide dim';
		}
	});

	var Lightbox = new Class({
		implement: [Dimmer],
		initialize: function (container) {
			this.container = document.getElementById(container);
		},
		show: function () {
			this.showDim();
		},
		hide: function () {
			this.hideDim();
		},
		hideDim: function () {
			// this does NOT work, implement overwrites custom methods
			// if you want to create a custom hideDime use extend on Dimmer
			this.parent();
			return 'hide custom dim';
		}
	});

	Lightbox.implement([Dimmer]);

	var lb = new Lightbox();

	// tests
	equal(lb.hideDim(), 'hide dim', 'implement successfully overwrites the instnace method');
});

test('Cleanup check', function () {
	// tests
	equal(typeof(window.Class), 'function', 'class is available within the window object');
	equal(typeof(Class), 'function', 'Class is available to be called');
	equal(objIsEmpty(Class.prototype), true, 'prototype is empty');

	testConstructor(Class);
});

/**
 * HELPERS
 */
// test if an obj is empty or not
function objIsEmpty(obj) {
	for(var prop in obj) {
		if(prop) return false;
	}
	return true;
}
// base constructor tests
function testConstructor(obj) {
	equal(typeof(obj.extend), 'function', 'extend is available');
	equal(typeof(obj.implement), 'function', 'implement is available');
	equal(typeof(obj.setOptions), 'function', 'setOptions is available');
	equal(typeof(obj.getOptions), 'function', 'getOptions is available');
}