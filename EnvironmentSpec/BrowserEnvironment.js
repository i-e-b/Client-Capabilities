// Shamelessly adaped from http://mediaelementjs.com/

var envspec = envspec || {};

envspec.Specification = {
	Plugins: {},
	Native: {},
	get: function (mediaElementId) {
		envspec.NativeMedia.detect(mediaElementId);
		return $.toJSON(envspec.Specification);
	}
};

envspec.PluginDetector = {
	// cached values
	nav: window.navigator,
	ua: window.navigator.userAgent.toLowerCase(),

	// runs detectPlugin() and stores the version number
	addPlugin: function (p, pluginName, mimeType, activeX, axDetect) {
		envspec.Specification.Plugins[p] = this.detectPlugin(pluginName, mimeType, activeX, axDetect);
	},

	// get the version number from the mimetype (all but IE) or ActiveX (IE)
	detectPlugin: function (pluginName, mimeType, activeX, axDetect) {
		var version = [0, 0, 0],
			description,
			i,
			ax;

		// Firefox, Webkit, Opera
		if (typeof (this.nav.plugins) != 'undefined' && typeof this.nav.plugins[pluginName] == 'object') {
			description = this.nav.plugins[pluginName].description;
			if (description && !(typeof this.nav.mimeTypes != 'undefined' && this.nav.mimeTypes[mimeType] && !this.nav.mimeTypes[mimeType].enabledPlugin)) {
				version = description.replace(pluginName, '').replace(/^\s+/, '').replace(/\sr/gi, '.').split('.');
				for (i = 0; i < version.length; i++) {
					version[i] = parseInt(version[i].match(/\d+/), 10);
				}
			}
		// Internet Explorer / ActiveX
		} else if (typeof (window.ActiveXObject) != 'undefined') {
			try {
				ax = new ActiveXObject(activeX);
				if (ax) {
					version = axDetect(ax);
				}
			}
			catch (e) { }
		}
		return version;
	}
};

envspec.MediaFeatures = {
	init: function () {
		var 
			nav = envspec.PluginDetector.nav,
			ua = envspec.PluginDetector.ua.toLowerCase(),
			i,
			v,
			html5Elements = ['source', 'track', 'audio', 'video'];

		envspec.Specification.UserAgent = ua;

		this.isBustedAndroid = (ua.match(/android 2\.[12]/) !== null);

		// create HTML5 media elements for IE before 9, get a <video> element for fullscreen detection
		for (i = 0; i < html5Elements.length; i++) {
			v = document.createElement(html5Elements[i]);
		}

		this.supportsMediaTag = (typeof v.canPlayType !== 'undefined' || this.isBustedAndroid);

		// detect native JavaScript fullscreen (Safari only, Chrome fails)
		this.hasNativeFullScreen = (typeof v.webkitRequestFullScreen !== 'undefined');
		if (this.isChrome) {
			this.hasNativeFullScreen = false;
		}
		// OS X 10.5 can't do this even if it says it can :(
		if (this.hasNativeFullScreen && ua.match(/mac os x 10_5/i)) {
			this.hasNativeFullScreen = false;
		}
		envspec.Specification.Features = this;
	}
};
envspec.MediaFeatures.init();


// Add Flash detection
envspec.PluginDetector.addPlugin('flash', 'Shockwave Flash', 'application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash', function (ax) {
	// adapted from SWFObject
	var version = [],
		d = ax.GetVariable("$version");
	if (d) {
		d = d.split(" ")[1].split(",");
		version = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
	}
	return version;
});

// Add Silverlight detection
envspec.PluginDetector.addPlugin('silverlight', 'Silverlight Plug-In', 'application/x-silverlight-2', 'AgControl.AgControl', function (ax) {
	// Silverlight cannot report its version number to IE
	// but it does have a isVersionSupported function, so we have to loop through it to get a version number.
	// adapted from http://www.silverlightversion.com/
	var v = [0, 0, 0, 0],
		loopMatch = function (ax, v, i, n) {
			while (ax.isVersionSupported(v[0] + "." + v[1] + "." + v[2] + "." + v[3])) {
				v[i] += n;
			}
			v[i] -= n;
		};
	loopMatch(ax, v, 0, 1);
	loopMatch(ax, v, 1, 1);
	loopMatch(ax, v, 2, 10000); // the third place in the version number is usually 5 digits (4.0.xxxxx)
	loopMatch(ax, v, 2, 1000);
	loopMatch(ax, v, 2, 100);
	loopMatch(ax, v, 2, 10);
	loopMatch(ax, v, 2, 1);
	loopMatch(ax, v, 3, 1);

	return v;
});

envspec.NativeMedia = {
	// formats we expect a video tag might be able to play:
	mimeTypes: ['video/ogg', 'video/mp4', 'video/webm', 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
			    'application/x-mpegURL', 'application/vnd.apple.mpegurl',

				'audio/ogg', 'audio/mp3', 'audio/aac'],

	detect: function (mediaElementId) {
	var htmlMediaElement = (typeof (mediaElementId) == 'string') ? document.getElementById(mediaElementId) : mediaElementId;

		// special case for Android which sadly doesn't implement the canPlayType function (always returns '')
		if (envspec.MediaFeatures.isBustedAndroid) {
			htmlMediaElement.canPlayType = function (type) {
				return (type.match(/video\/(mp4|m4v)/gi) !== null) ? 'maybe' : '';
			};
		}

		// test for native playback first
		if (envspec.MediaFeatures.supportsMediaTag) {
			for (i = 0; i < this.mimeTypes.length; i++) {
				// normal check
				if (htmlMediaElement.canPlayType(this.mimeTypes[i]).replace(/no/, '') !== ''
				// special case for Mac/Safari 5.0.3 which answers '' to canPlayType('audio/mp3') but 'maybe' to canPlayType('audio/mpeg')
					|| htmlMediaElement.canPlayType(this.mimeTypes[i].replace(/mp3/, 'mpeg')).replace(/no/, '') !== '') {
					envspec.Specification.Native[this.mimeTypes[i]] = 'true';
				} else {
					envspec.Specification.Native[this.mimeTypes[i]] = 'false';
				}
			}
		}
	}
};