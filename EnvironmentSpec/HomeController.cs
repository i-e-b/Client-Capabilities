using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace iFrameInnerReplaceTest.Controllers {
	public class HomeController : Controller {
		public ActionResult Index () {
			return View();
		}

		[HttpPost]
		public ActionResult GetLocation (string spec) {
			HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);
			
			var js = new JavaScriptSerializer();
			var environmentSpec = js.Deserialize<EnvironmentSpec>(spec);

			// Some sample logic
			var redirect = GuessTypes(environmentSpec);

			return new JavaScriptResult{Script = "/Home/Redirected?type=" + redirect};
		}

		private string GuessTypes(EnvironmentSpec environment) {
			string guesses = environment.GetBrowserType().ToString();
			if (environment.HasSilverlight(3)) guesses += " Silverlight 3+ [Smooth, MP4, WMV];";
			if (environment.HasFlash(10)) guesses += " Flash 10+ [FLV, F4V, MP4];";

			guesses += " HTML5 [";
			if (environment.NativeMP4()) guesses += "MP4; ";
			if (environment.NativeAacAudio()) guesses += "AAC; ";
			if (environment.NativeHLS()) guesses += "HLS; ";
			if (environment.NativeMp3Audio()) guesses += "MP3; ";
			if (environment.NativeOggAudio()) guesses += "Ogg Audio; ";
			if (environment.NativeOggVideo()) guesses += "Ogg Video; ";
			if (environment.NativeWebM()) guesses += "WebM; ";
			guesses += "];";

			return guesses.Replace(" ","_");
		}

		public ActionResult Director () {
			return View();
		}
		public ActionResult Redirected () {
			return View();
		}
	}
}
