/**
 * jquery.facebook.js
 * @author: Angelo Dini
 * @copyright http://www.divio.ch
 * @version: 0.1.1
 */
(function($) {
	$.fn.facebook = function(type, options) {
		// global options
		var options = $.extend({locale: 'de_DE'}, options);
		// enable multiple plugins
		return this.each(function () {
			// available social plugins
			switch(type) {
				case 'addShareButton':
					$(this).facebook.addShareButton($(this), options);
					break;
				case 'addLikeButton':
					$(this).facebook.addLikeButton($(this), options);
					break;
				case 'addRecommendations':
					$(this).facebook.addRecommendations($(this), options);
					break;
				/* does not work: case 'addComments':
					$(this).facebook.addComments($(this), options);
					break;*/
				case 'addActivityFeed':
					$(this).facebook.addActivityFeed($(this), options);
					break;
				case 'addLikeBox':
					$(this).facebook.addLikeBox($(this), options);
					break;
				case 'addLiveStream':
					$(this).facebook.addLiveStream($(this), options);
					break;
				default:
					$(this).html('The requestet social plugin could not be found.');
			}
		});
	};

	// facebook SHARE BUTTON
	// http://www.facebook.com/share/
	$.fn.facebook.addShareButton = function (el, options) {
		var options = $.extend({
			type: 'button_count',
			title: 'Share',
			share_url: el.text()
		}, options);

		var share = (options.share_url != '') ? (' share_url="' + options.share_url + '"') : ('');
		var html = '<a name="fb_share" type="' + options.type + '"' + share + ' href="http://www.facebook.com/sharer.php">' + options.title + '</a>';
			html += '<script src="http://static.ak.fbcdn.net/connect.php/js/FB.Share" type="text/javascript"></script>';
		// inject
		el.html(html);
	};

	// facebook LIKE BUTTON
	// http://developers.facebook.com/docs/reference/plugins/like
	$.fn.facebook.addLikeButton = function (el, options) {
		var options = $.extend({
			href: el.text(),
			width: 450,
			height: 80,
			layout: 'standard',
			show_faces: true,
			action: 'like',
			font: 'arial',
			colorscheme: 'light',
			ref: ''
		}, options);
		$.fn.facebook.create(el, 'like', options);
	};

	// facebook RECOMMENDATIONS
	// http://developers.facebook.com/docs/reference/plugins/recommendations
	$.fn.facebook.addRecommendations = function (el, options) {
		var options = $.extend({
			site: el.text(),
			width: 300,
			height: 300,
			header: true,
			colorscheme: 'light',
			font: 'arial',
			border_color: '%23'
		}, options);
		$.fn.facebook.create(el, 'recommendations', options);
	};

	// facebook COMMENTS - Depreciated (doesnt work)
	// http://developers.facebook.com/docs/reference/plugins/comments
	/*$.fn.facebook.addComments = function (el, options) {
		var options = $.extend({
			channel_url: el.text(),
			width: 550,
			height: 200,
			numposts: 10,
			url: 'http://developers.facebook.com/docs/reference/plugins/comments',
			xid: 'http%253A%252F%252Fdevelopers.facebook.com%252Fdocs%252Freference%252Fplugins%252Fcomments'
		}, options);
		$.fn.facebook.create(el, 'comments', options);
	};*/

	// facebook ACTIVITY FEED
	// http://developers.facebook.com/docs/reference/plugins/activity
	$.fn.facebook.addActivityFeed = function (el, options) {
		var options = $.extend({
			site: el.text(),
			width: 300,
			height: 300,
			header: true,
			colorscheme: 'light',
			font: 'arial',
			border_color: '%23',
			recommendations: false
		}, options);
		$.fn.facebook.create(el, 'activity', options);
	};

	// facebook LIKE BOX
	// http://developers.facebook.com/docs/reference/plugins/like-box
	$.fn.facebook.addLikeBox = function (el, options) {
		var options = $.extend({
			id: el.text(),
			width: 300,
			height: 300,
			connections: 10,
			stream: false,
			header: true,
			border_color: '%23'
		}, options);
		$.fn.facebook.create(el, 'likebox', options);
	};

	// facebook LIVE STREAM
	// http://developers.facebook.com/docs/reference/plugins/live-stream
	$.fn.facebook.addLiveStream = function (el, options) {
		var options = $.extend({
			app_id: el.text(),
			width: 500,
			height: 400,
			xid: '123456'
		}, options);
		$.fn.facebook.create(el, 'livefeed', options);
	};

	// helper function to create facebook element
	$.fn.facebook.create = function (el, type, options) {
		// create start url
		var url = 'http://www.facebook.com/plugins/' + type + '.php?';
		// serialize options
		$.each(options, function (key, value) {
			url += key + '=' + value + '&';
		});
		// save iframe
		var iframe = '<iframe src="' + url + '" width="' + options.width + '" height="' + options.height + '" scrolling="no" frameborder="0" allowTransparency="true" style="border:none; overflow:auto;"></iframe>';
		// add iframe
		el.html(iframe);
	};
})(jQuery);