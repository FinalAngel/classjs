*******
methods
*******

The following methods can be attached to a new class.


new Class(object);
==================

``(returns object)`` - This is the class constructor and passes the provided object to the instances prototype.

Create a new Class::

    var Animal = new Class({
        initialize: function (name, age) {
            this.name = name;
            this.age = age;
        },
        eat: function () {
            alert(this.name + ' is eating now.');
        }
    });

For a better explanation to ``initialize`` consult the class.js properties section.


Class.extend(object)
====================

``(returns object)`` - The object or class passed through extend will be **merged** with the assigned class following
the previous example.

Extend the class::

    Animal.extend({
        die: function () {
            alert(this.name + ' died at age ' + this.age);
        }
    });

    var cat = new Animal('Sora', 4);
        cat.die(); // alerts "Sora died at age 4"


Class.implement(array)
======================

``(returns object)`` - Each object or class within the array will be **added** to the assigned class following
the previous example.

Implementing new methods::

    // preparing a class
    var Mammal = new Class({
        swim: function () {
            alert(this.name + ' can swim now.');
        },
        dive: function () {
            alert(this.name + ' can dive now.');
        }
    });

    // preparing a normal object
    var Bird = {
        fly: function () {
            alert(this.name + ' can fly now.');
        }
    };

    Animal.implement([Mammal, Bird]);

    var cat = new Animal('Sora', 4);
        cat.swim(); // alerts "Sora can swim now."
        cat.dive(); // alerts "Sora can dive now."
        cat.fly(); // alerts "Sora can fly now."

.. note::
  implement simply **copies** object methods over into the new class and breaks the prototypal chain.
  It does not create a parent link nor does it copy ``initialize`` into the new class.
  Implemented methods cannot be overwritten to prevent accidental conflicts. Use extend to modify
  available class methods.


Class.getOptions()
==================

``(returns object)`` - Gathers assigned options and returns them.

Getting options from a class::

    var Animal = new Class({
    	options: {
    		'name': '',
    		'age': null
    	},
    	initialize: function (name, age) {
    		this.name = this.options.name || name;
    		this.age = this.options.age || age;
    	}
    });

    Animal.getOptions(); // returns { 'name': '', 'age': null }

It is not possible to get the options once an instance has been created.
You can access the instance objects through their options name ``cat.options.name``.


Class.setOptions(object)
========================

``(returns object)`` - Sets and merges a given options object to the classes internal options object.

Setting options for a class::

    var Animal = new Class({
    	options: {
    		'name': '',
    		'age': null
    	},
    	initialize: function (name, age) {
    		this.name = this.options.name || name;
    		this.age = this.options.age || age;
    	}
    });

    Animal.setOptions({
    	'name': undefined,
    	'dead': false
    });

    Animal.getOptions(); // returns { 'name': undefined, 'age': null, 'dead': false }

It is not possible to change the options once an instance has been created.
You can access the instance objects through their options name ``cat.options.name``.


Class.noConflict()
==================

``(returns Class)`` - Removes the class object from the window object and restores what was there before
class.js was loaded.

Using class.js with multiple libraries::

    // loading MooTools
    var Classy = Class.noConflict();

    var Animal = new Classy({
    	initialize: function (name, age) {
    		this.name = name;
    		this.age = age;
    	},
    	eat: function () {
            alert(this.name + ' is eating now.');
        }
    });

    var cat = new Animal('Sora', 4);
    	cat.eat(); // alerts "Sora is eating now."


Class.version
===============

``(returns string)`` - Returns the current running class.js version as a string.

	alert(Class.version); // alerts current class.js version