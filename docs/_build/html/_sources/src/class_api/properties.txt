**********
properties
**********

The following properties can be used within the Classes passing object.


initialize: function
====================

``(returns constructor)`` - The initialize function serves as constructor on instance creation.

Create a new Class::

    var Animal = new Class({
        initialize: function(name, age) {
            this.name = name;
            this.age = age;
        }
    });

	// the passing options will be passed through the constructor initialize
    new Animal('Satan', 21);


implement: array
================

``(returns object)`` - Each object or class within the array will be **added** to the assigned class.

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

    var Animal = new Class({
        implement: [Mammal, Bird],
        initialize: function (name, age) {
            this.name = name;
            this.age = age;
        },
        eat: function () {
            alert(this.name + ' is eating now.');
        }
    });

    var cat = new Animal('Sora', 4);
        cat.swim(); // alerts "Sora can swim now."
        cat.dive(); // alerts "Sora can dive now."
        cat.fly(); // alerts "Sora can fly now."

This property works identical to the Class.implement method.


options: object
===============

``(returns object)`` - The options object represents a JSON structure.

Attach options to a Class::

    var Animal = new Class({
        options: {
            'name': '',
            'age': null,
            'dead': false
        },
        initialize: function (options) {
            // merging objects using jQuery
            this.options = options;

            // you might want to merge the two ojects using jQuery
            // this.options = jQuery.extend(true, {}, this.options, options)
        }
    });

    var cat = new Animal({
    	'name': 'Sora',
    	'age': 4
    });

	// call options direct
	alert(cat.options.name); // alerts 'Sora'


this.parent()
=============

``(returns function)`` - When called from within a class.js function this invokes the parent function of the same name.
This is useful when extending an existing class.js plugin.

Example usage of parent::

    var Animal = new Class({
    	initialize: function (name, age) {
    		this.name = name;
    		this.age = age;
    	},
    	getName: function () {
    		alert(this.name + ' is eating now.');
    	}
    });

    Animal.extend({
    	getName: function () {
    		// calls previous getName first
    		this.parent();
    		alert(this.name + ' is ' +  this.age + ' years old.');
    	}
    });

    var cat = new Animal('Sora', 4);
    	cat.getName(); // alerts both calls, name and age