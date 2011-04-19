/**
 * @framework	CFF - Classy Frontend Framework
 * @author		Angelo Dini | original by Armin Ronacher.
 * @copyright	http://www.divio.ch under the BSD Licence
 * @requires	qunit.js
 */

/*
 * setting up data
 */

var Animal = Class.$extend({
	initialize: function(options) {
		options = typeof(options) == 'object' ? options : {name: 'Animal', health: 100};
		for (var key in options) {
			this[key] = options[key];
		}
		// required defaults
		this.name = (typeof(options.name) == 'string' ? options.name : 'Animal');
		this.health = (typeof(options.health) == 'integer' ? options.health : 100);
	},

	die: function() {
		this.health = 0;
	},

	eat: function(what) {
		this.health += 5;
	},

	dead: function() {
		return (this.health <= 0);
	}
});

var Parasite = Animal.$extend({
	eat: function(animal) {
		this.$super(animal);
		animal.health -= 5;
	}
});

var Cat = Animal.$extend({
	eat: function(animal) {
		this.$super(animal);
		animal.die();
	}
});

var HouseCat = Cat.$extend({
	'cute': true,
	'scary': false
});

var Lion = Cat.$extend({
	'cute': false,
	'scary': true
});

/*
 * starting tests
 */

module("classy.js");

test('Classy exists', function() {
	ok(typeof(Class) == 'function', 'Class is a function defined globally');
});

test('Namespace exists', function() {
	ok(typeof(Cl) != 'undefined', 'Namespace Cl is defined globally');
});

test('$noConflict unsets Class from window', function() {
	var original = Class;

	var Classy = Class.$noConflict();

	equals(typeof(Class), 'undefined', '$noConflict unsets Class from window');

	same(Classy, original, 'the returned Class is the same as the original');

	// cleanup
	window.Class = original;
});

test('$super calls parent method', function() {
	var Greeter = Class.$extend({
		greeting: function() { return 'Armin!'; }
	});
	var Spaniard = Greeter.$extend({
		greeting: function() { return 'Hola, ' + this.$super(); }
	});
	var Englishman = Greeter.$extend({
		greeting: function() { return 'Hello, ' + this.$super(); }
	});
	same((Spaniard().greeting()), 'Hola, Armin!', 'Spanish greeting generated.');
	same((Englishman().greeting()), 'Hello, Armin!', 'English greeting generated.');
});

test('$extend exists and works', function() {
	same(typeof(Class.$extend), 'function', 'basic class has $extend function');

	var SubClass = Class.$extend({});

	same(typeof(SubClass.$extend), 'function', 'subclasses also receive $extend');

	same(SubClass.$extend, Class.$extend, 'base class and subclass have same $extend function');
});

test('classes can be used with or without "new".', function() {
	var pig1 = new Animal('pig');
	var pig2 = Animal('pig');

	same(pig1, pig2, 'Animal instances are the same when made with or without `new`');
});

test('initialize is called with correct arguments', function() {
	var Instrument = Class.$extend({
		initialize: function(volume) {
			this.volume = volume;
		}
	});
	flute = Instrument(20);
	cymbal = Instrument(100);
	equal(flute.volume, 20);
	equal(cymbal.volume, 100);
});

test('basic classical inheritence works', function() {
	garfield = HouseCat({funny: true});
	heathcliff = HouseCat({funny: false});

	equal(garfield.funny, true, 'attribute was set on instance');
	equal(heathcliff.funny, false, 'attribute was set on instance');
	equal(typeof(HouseCat().funny), 'undefined', 'base HouseCat is not affected by subclass mutations');
});

test('instanceof works', function() {
	var lion = Lion();
	ok(lion instanceof Lion, 'instanceof works on class instances');
	ok(lion instanceof Cat, 'instanceof works on subclass instances');
	ok(lion instanceof Animal, 'instanceof works on deep subclass instances');
	ok(!(lion instanceof HouseCat), 'isinsinstance is false when expected');
});

test('mixins work', function() {
	FatMixin = {
		'is_fat': true,
		'describe': function() {
			return this.name + ' is fat!';
		}
	};
	FatCat = Cat.$extend({
		'implement': [FatMixin]
	});
	garfield = FatCat({name:'Garfield'});

	ok(garfield.is_fat, 'mixin attribute is defined');
	equal(garfield.describe(), 'Garfield is fat!', 'mixin has access to corrent `this.');
});

test('exercise test methods', function() {
  var tick = Parasite();
  var leo = Lion();
  var garfield = HouseCat();

	ok(!(garfield.scary), 'Cat instances are not scary.');
	
	ok(leo.scary, 'Lion instances are scary.');
	
	equal(garfield.health, 100, 'default health is 100');
	
	tick.eat(garfield);
	
	equal(garfield.health, 95, 'tick removes 5 health');
	
	ok(!(garfield.dead()), 'still not dead');
	
	leo.eat(garfield);
	
	ok(garfield.dead(), 'garfield is death');
});

test('non-new creation calls initialize just once', function() {
	var catched = [];
	var Test = Class.$extend({
		initialize: function() {
			catched.push(true);
		}
	});
	Test();
	new Test();
	equal(catched.length, 2);
});

test('class attributes work', function() {
	var Test = Class.$extend({
		options: {
			foo: 23,
			bar: 'test'
		},
		initialize: function() {
			this.foo = 42;
		}
	});

	equal(Test.foo, 23, 'Test.foo is 23');
	equal(Test.bar, 'test', 'Test.bar is "test"');
	equal(Test().foo, 42, 'Test().foo is 42');
});

test('patching in prototypes', function() {
	var called = [];
	var Test = Class.$extend({
		initialize: function() {
			called.push(42);
		},
		getFoo: function() {
			return this.foo;
		},
		toString: function() {
			return this.foo + ' ' + this.bar;
		}
	});
	var data = {'foo': 23, 'bar': 42};
	var obj = Test.$withData(data);
	equal(obj.foo, 23, 'Test.foo is 23');
	equal(obj.bar, 42, 'Test.bar is 42');
	equal(obj.getFoo(), obj.foo, 'getFoo() returns foo');
	// IE bug we cannot support
	if(!navigator.userAgent.match(/MSIE/)) equal(obj.toString(), '23 42', 'Test.toString() is "23 42"');
	equal(called.length, 0, 'constructor was never called');
});

test('$options gives class access', function() {
	var Test = Class.$extend({
		options: {'classattr': 42}
	});
	equal(Test().$options.classattr, 42, 'classattr is 42');
});

test('class variable inheritance', function() {
	var Test = Class.$extend({
		options: {
			foo: 23,
			bar: 'test'
		}
	});
	var SubTest = Test.$extend({
		options: {
			bar: 'subtest'
		}
	});
	var SubSubTest = SubTest.$extend({
		options: {
			foo: 999
		}
	});

	ok(SubTest.foo, 'SubTest also has a foo');
	equal(SubTest.foo, Test.foo, 'SubTest.foo is Test.foo');
	equal(SubTest.bar, 'subtest', 'SubTest.bar has been overridden');
	equal(SubSubTest.bar, SubTest.bar, 'SubSubTest.bar is Test.bar');
	equal(SubSubTest.foo, 999, 'SubSubTest.foo has been overridden');
});