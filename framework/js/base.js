/**
 * @framework	CFF - Classy Frontend Framework
 * @author		Angelo Dini
 * @copyright	http://www.divio.ch under the BSD Licence
 * @requires	Classy, jQuery
 *
 * check if classy.js exists */
 if(window['Class'] === undefined) log('classy.js is required!');

/*##################################################|*/
/* #CUSTOM APP# */
(function ($, Class) {
	/**
	 * Browser helpers
	 * @version: 0.1.1
	 */
	Cl.Browser = Class.$extend({
		initialize: function () {
			// initiate ie6 fixes
			if(!window.XMLHttpRequest) this.ie6();
			if(navigator.userAgent.match(/Mobile/i)) this.mobile();
		},
		ie6: function () {
			// add pseudo fixes
			$.fn.fix_pseudos = function(options) {
				this.filter(":first-child").addClass("first-child");
				this.filter(":last-child").addClass("last-child");
			};
		},
		mobile: function () {
			// pan to the bottom, hides the location bar
			setTimeout(function () {
				window.scrollTo(0, 1);
			}, 100);

			// attach hover events
			$('a').bind('touchstart', function () { $(this).addClass('hover'); });
			$('a').bind('touchend', function () { $(this).removeClass('hover'); });
		}
	});
	// autoinit
	Cl.Browser = new Cl.Browser();
	
	/**
	 * Base initial class
	 */
	Cl.Base = Class.$extend({
		initialize: function () {
			log('hello world');
		}
	});
	// autoinit
	Cl.Base = new Cl.Base();
// prevent conflicts
})(jQuery, Class);

/**
 * JQUERY CUSTOM PLUGINS
 * ##################################################|
 */
(function ($) {
	/**
	 * Target modifier
	 * @version: 0.3.0
	 * @param: property (target:blank)
	 * @example: <a href="#" rel="target:blank">Lorem Ipsum</a>
	 */
	$.fn.defineTarget = function (options) {
		var options = $.extend({ property: 'rel' }, options);
		return this.each(function () {
			$(this).attr('target', '_' + $(this).attr(options.property).split(':')[1]);
		});
	};
	$('a[rel*="target:"]').defineTarget();
	$('a[class*="target:"]').defineTarget({ property: 'class' });

	/**
	 * E-Mail encrypte
	 * @version: 0.3.1
	 * @param: autoConvert (converts innerhtml to match the email address)
	 * @example: <a href="#info" rel="divio.ch" class="mailcrypte">E-Mail</a>
	 */
	$.fn.mailCrypte = function (options) {
		var options = $.extend({
			autoConvert: true
		}, options);

		return this.each(function () {
			var mailto = 'mailto:' + $(this).attr('href').replace('#', '') + '@' + $(this).attr('rel');
			$(this).attr('href', mailto);
			if(options.autoConvert) $(this).html(mailto.replace('mailto:', ''));
		});
	};
	$('a.mailcrypte').mailCrypte({ autoConvert: false });

	/**
	 * Pop-Up Generator
	 * @version: 0.2.1
	 * @param: width (initial width)
	 * @param: height (initial height)
	 * @example: <a href="http://www.google.ch" class="popup">Open Pop-Up</a>
	 */
	$.fn.autoPopUp = function (options) {
		var options = $.extend({ width: 750, height: 500}, options);
		var size = { 'x': options.width, 'y': options.height };
		
		return this.each(function () {
			var url = $(this).attr('href');
			// attach event
			$(this).bind('click', function (e) {
				e.preventDefault();
				window.open(url, '_blank', 'width=' + size.x + ',height=' + size.y + ',status=yes,scrollbars=yes,resizable=yes');
			});
		});
	};
	//$('.popup').autoPopUp();

	/**
	 * Auto input fill-in
	 * @version: 0.6.0
	 * @param: label (if true than labeltext on parent else rel attribut on this)
	 * @param: strip (replacement text)
	 * @param: add (add additional information)
	 */
	$.fn.fieldLabel = function (options) {
		var options = $.extend({
			label: true,
			strip: '',
			add: ''
		}, options);

		// show functionality
		function show(el, e, label) {
			if(el.attr('value') != '') return false;
			el.attr('value', label);
		};

		// hide functionality
		function hide(el, e, label) {
			if(e.type == 'blur' && el.attr('value') == label) return false;
			el.attr('value', '');
		};

		return this.each(function () {
			// store label element and use replacement
			var label = (options.label == true) ? $(this).parent().find('label').text() : label = $(this).attr('rel');
			label = label.replace(options.strip, '');
			label += options.add;

			// initialize
			if($(this).attr('value') == '') $(this).attr('value', label);

			// attach event
			$(this).bind('click', function (e) {
				if($(this).attr('value') == label) hide($(this), e, label)
			})
			$(this).bind('blur', function (e) {
				($(this).attr('value') == label) ? hide($(this), e, label) : show($(this), e, label);
			})
		})
		
	};
	//$('.fieldLabel').fieldLabel({ strip: ': ', add: '...' });

	/**
	 * Collapser/expander
	 * @version: 0.3.1
	 * @param: show (is element initially shown)
	 * @param: fx (animation, either toggle, fade or slide)
	 * @param: event (event.hover and event.blur)
	 * @param: timeout (timeout till event triggers off)
	 * @param: triggerClass (anchor element that triggers functionality)
	 * @param: containerClass (element that will be triggered)
	 * @param: activeClass (added class when active)
	 */
	$.fn.colExpander = function (options) {
		var $that = $(this);
		var options = $.extend({
			show: false,
			fx: 'toggle',
			event: { hover: 'click', blur: 'mouseleave' },
			timeout: 250,
			triggerClass: '.trigger',
			containerClass: '.content',
			activeClass: 'active'
		}, options);

		// if clickable
		(options.show) ? $that.data('collapsed', false) : $that.data('collapsed', true);

		// initial setup
		($that.data('collapsed')) ? collapse(): expand();

		// expand container
		function expand(e) {
			if(e) e.preventDefault();
			if(options.fx == 'toggle') $that.find(options.containerClass).show();
			if(options.fx == 'slide') $that.find(options.containerClass).slideDown();
			if(options.fx == 'fade') $that.find(options.containerClass).fadeIn();
			// add active state
			$that.addClass(options.activeClass);
			// set new state
			setTimeout(function () {
				$that.data('collapsed', false)
			}, options.timeout);
		}

		// collapse container
		function collapse(e) {
			if(e && e.type == options.event.blur) {
				this.timer = setTimeout(function () {
					if(options.fx == 'toggle') $that.find(options.containerClass).hide();
					if(options.fx == 'slide') $that.find(options.containerClass).slideUp();
					if(options.fx == 'fade') $that.find(options.containerClass).fadeOut();
					// add active state
					$that.removeClass(options.activeClass);
					// set new state
					$that.data('collapsed', true)
				}, options.timeout);
			} else { clearTimeout(this.timer); }
		}

		// add hover event
		$that.find(options.triggerClass).bind(options.event.hover, function (e) {
			if($that.data('collapsed') == true) expand(e);
		});

		// add blur event
		$that.bind(options.event.blur, function (e) {
			if($that.data('collapsed') == false) collapse(e);
		});
		
		// default return value
		return this;
	};
	//$(item).colExpander({ triggerClass: '.trigger', containerClass: '.container' });
})(jQuery, Class);