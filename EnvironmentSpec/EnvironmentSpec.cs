using System.Collections.Generic;
using System.Linq;

namespace iFrameInnerReplaceTest.Controllers {
	public class EnvironmentSpec {
		public Dictionary<string, int[]> Plugins;
		public Dictionary<string, bool> Native;
		public Dictionary<string, bool> Features;
		public string UserAgent;

		public bool HasSilverlight(int majorVersion) {
			return
				Plugins.ContainsKey(Silverlight)
				&& Plugins[Silverlight].Length > 0
				&& Plugins[Silverlight][0] >= majorVersion;
		}
		
		public bool HasFlash(int majorVersion) {
			return
				Plugins.ContainsKey(Flash)
				&& Plugins[Flash].Length > 0
				&& Plugins[Flash][0] >= majorVersion;
		}

		public bool NativeHLS() {
			return (new[]{HLS_1, HLS_2}).Any(mime => Native.ContainsKey(mime) && Native[mime]);
		}
		public bool NativeMP4 () {
			return (new[]{Mp4, H264}).Any(mime => Native.ContainsKey(mime) && Native[mime]);
		}
		public bool NativeOggVideo () {return SupportsNative(Ogg);}
		public bool NativeOggAudio() {return SupportsNative(AudioOgg);}
		public bool NativeWebM () {return SupportsNative(WebM);}
		public bool NativeMp3Audio() {return SupportsNative(Mp3);}
		public bool NativeAacAudio () {return SupportsNative(Aac);}

		public BrowserType GetBrowserType() {
			// Note: the order of these is important!
			#region Standard known desktop and mobile agents
			if (UserAgent.Contains("windows phone")) return BrowserType.Windows7Phone;
			if (UserAgent.Contains(" zunewp7")) return BrowserType.Windows7Phone; // Asus Galaxy compatibility mode
			if (UserAgent.Contains(" firefox/")) return BrowserType.Firefox;
			if (UserAgent.Contains(" chrome/")) return BrowserType.Chrome;
			if (UserAgent.Contains(" android 2.1")
				|| UserAgent.Contains(" android 2.2")) return BrowserType.OldAndroid;
			if (UserAgent.Contains(" android")) return BrowserType.Android;
			if (UserAgent.Contains("htc_")
				|| UserAgent.Contains("htc ")) return BrowserType.Android; // Lots of HTC Android devices lie!
			
			if (UserAgent.Contains("ipad")) return BrowserType.iPad;
			if (UserAgent.Contains("iphone")) return BrowserType.iPhone;

			if (UserAgent.Contains(" msie ")) return BrowserType.InternetExplorer;
			if (UserAgent.Contains(" safari/")) return BrowserType.Safari;
			if (UserAgent.Contains(" opera/")) return BrowserType.OperaDesktop;
			#endregion

			#region Web Crawlers
			if (UserAgent.Contains(" googlebot")) return BrowserType.WebCrawler;
			if (UserAgent.Contains(" msnbot")) return BrowserType.WebCrawler;
			if (UserAgent.Contains("yahoo! slurp")) return BrowserType.WebCrawler;
			if (UserAgent.Contains("ask jeeves")) return BrowserType.WebCrawler;
			if (UserAgent.Contains("livebot")) return BrowserType.WebCrawler;
			if (UserAgent.Contains("bingbot")) return BrowserType.WebCrawler;
			#endregion

			#region Unknowns
			// Mobile agents almost certainly can't install plugins, so it's good to know

			// A few general things only found on mobile devices:
			if (UserAgent.Contains("midp-")) return BrowserType.UnknownMobile; // has Mobile Java Profile
			if (UserAgent.Contains("cldc-")) return BrowserType.UnknownMobile; // has Mobile Java Configuration
			if (UserAgent.Contains("j2me/midp")) return BrowserType.UnknownMobile; // Java spec used by some Opera Mini installs
			if (UserAgent.Contains(" mobile")) return BrowserType.UnknownMobile;
			if (UserAgent.Contains("htc-8500")) return BrowserType.UnknownMobile;
			if (UserAgent.Contains("lg/u880/v1.0")) return BrowserType.UnknownMobile;
			if (UserAgent.Contains("lg-g5200")) return BrowserType.UnknownMobile;
			if (UserAgent.Contains("lg-g7000")) return BrowserType.UnknownMobile;
			if (UserAgent.Contains("lg/u81")) return BrowserType.UnknownMobile;
			if (UserAgent.Contains("palmsource")) return BrowserType.UnknownMobile;
			if (UserAgent.Contains("webos/")) return BrowserType.UnknownMobile;
			if (UserAgent.Contains("sec-sghu600")) return BrowserType.UnknownMobile;
			if (UserAgent.Contains("samsung-sgh-i900")) return BrowserType.UnknownMobile;
			if (UserAgent.Contains(" iemobile")) return BrowserType.UnknownMobile; // catches a few HP and HTC devices
			if (UserAgent.Contains("up.browser")) return BrowserType.UnknownMobile; // previously popular mobile browser
			if (UserAgent.Contains("up.link")) return BrowserType.UnknownMobile; // appears on lots of Mobile Opera phones
			#endregion
			return BrowserType.Unknown;
		}

		public bool UnderstandsMediaTags() {return HasFeature(MediaTag);}
		public bool SupportsTrueFullscreen () {return HasFeature(NativeFullScreen);}

		#region Guts
		private bool SupportsNative (string key) {
			return Native.ContainsKey(key) && Native[key];
		}
		private bool HasFeature (string key) {
			return Features.ContainsKey(key) && Features[key];
		}
		#endregion

		#region Keys in JavaScript
		// Video
		private const string WebM = "video/webm";
		private const string Mp4 = "video/mp4";
		private const string Ogg = "video/ogg";
		private const string H264 = "video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"";
		private const string HLS_1 = "application/vnd.apple.mpegurl";
		private const string HLS_2 = "application/x-mpegURL";

		// Audio
		private const string AudioOgg = "audio/ogg";
		private const string Mp3 = "audio/mp3";
		private const string Aac = "audio/aac";

		// Plugins
		private const string Silverlight = "silverlight";
		private const string Flash = "flash";

		// Features
		private const string MediaTag = "supportsMediaTag";
		private const string NativeFullScreen = "hasNativeFullScreen";
		#endregion
	}

	public enum BrowserType { // TODO: change these to be CanInstallPlugins, NoPlugins, Unknown
		// Unknown and weird
		Unknown = -2, UnknownMobile = -1, 

		// Well known stuff
		Chrome = 1, Safari, Firefox, InternetExplorer, OperaDesktop, 
		Android, iPad, iPhone, Windows7Phone,
		/// <summary>Android versions 2.1 and 2.2 had various video tag bugs.</summary>
		OldAndroid, 
		
		// Non-delivery
		WebCrawler
	}
}