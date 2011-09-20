using System.Collections.Generic;
using System.Linq;

namespace iFrameInnerReplaceTest.Controllers {
	public class EnvironmentSpec {
		public Dictionary<string, int[]> Plugins;
		public Dictionary<string, bool> Native;
		public Dictionary<string, bool> Features;

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

		public bool NativeOggVideo () {
			return Native.ContainsKey(Ogg) && Native[Ogg];
		}
		public bool NativeOggAudio() {
			return Native.ContainsKey(AudioOgg) && Native[AudioOgg];
		}

		public bool NativeWebM () {
			return Native.ContainsKey(WebM) && Native[WebM];
		}

		public bool NativeMp3Audio() {
			return Native.ContainsKey(Mp3) && Native[Mp3];
		}

		public bool NativeAacAudio () {
			return Native.ContainsKey(Aac) && Native[Aac];
		}
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
		#endregion
	}
}