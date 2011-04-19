/**
 * Classy Framework | QUnit Test Suite
 * @author		Angelo Dini
 * @copyright	http://www.divio.ch under the MIT Licence
 * @requires	qunit.js
 */

module("base.js");

/* base.js */
test('Plugin: DefineTarget', function () {
	// test normal class assertion with rel
	var rel_targets = $('a[rel*="target:"]').defineTarget();
		ok(rel_targets, 'rel targets have been found and passed');

	// test normal class assertion with rel
	var class_targets = $('a[class*="target:"]').defineTarget({ property: 'class' });
		ok(class_targets, 'class targets have been found and passed');

	// test different option parameters
	var option_targets = $('a').defineTarget({});
		ok(option_targets, 'targets have been found with no options and passed');

	// check return value
	var a = $('a[rel*="target:"]');
	var b = $('a[rel*="target:"]').defineTarget();
	same(a, b, 'return value matches jquery object')
});

/* base.js */
test('Plugin: MailCrypte', function () {
	// test normal class assertion with rel
	var autoconvert_true = $('a.mailcrypte').mailCrypte();
		ok(autoconvert_true, 'autoconvert is set to true and passed');

	// test normal class assertion with rel
	var autoconvert_false = $('a.mailcrypte').mailCrypte({ autoConvert: false });
		ok(autoconvert_false, 'autoconvert is set to false and passed');

	// test different option parameters
	var option_targets = $('a.mailcrypte').mailCrypte({});
		ok(option_targets, 'targets have been found with no options and passed');

	// check return value
	var a = $('a.mailcrypte');
	var b = $('a.mailcrypte').mailCrypte();
	same(a, b, 'return value matches jquery object')
});

/* base.js */
test('Plugin: AutoPopUp', function () {
	// test different options
	var popup_variation = $('.popup').autoPopUp({
		width: 800,
		height: '600'
	});
		ok(popup_variation, 'different options applied and passed');

	// check return value
	var a = $('.popup');
	var b = $('.popup').autoPopUp();
	same(a, b, 'return value matches jquery object')
});

/* base.js */
test('Plugin: FieldLabel', function () {
	//$('.fieldLabel').fieldLabel({ strip: ': ', add: '...' });
	ok($('.fieldLabel').fieldLabel({label: true}), 'test label option and passed');
	ok($('.fieldLabel').fieldLabel({strip: '...'}), 'test label option and passed');
	ok($('.fieldLabel').fieldLabel({add: '...'}), 'test label option and passed');

	// check return value
	var a = $('.fieldLabel');
	var b = $('.fieldLabel').fieldLabel();
	same(a, b, 'return value matches jquery object')
});

/* base.js */
test('Plugin: ColExpander', function () {
	// test normal class assertion with rel
	var expandable = $('#expandable').colExpander();
		ok(expandable, 'colExpander is initiated without error');

	var expandable_variation = $('.popup').colExpander({
		width: 800,
		height: '600'
	});
		ok(expandable_variation, 'different options applied and passed');

	// check return value
	var a = $('#expandable');
	var b = $('#expandable').colExpander();
	same(a, b, 'return value matches jquery object')
});