using System;
using System.ComponentModel;
using System.Security.Permissions;
using System.Web;
using System.Web.UI;

namespace BrowserCapabilities.Capabilities {

	[AspNetHostingPermission(SecurityAction.InheritanceDemand,
		Level = AspNetHostingPermissionLevel.Minimal),
	AspNetHostingPermission(SecurityAction.Demand,
		Level = AspNetHostingPermissionLevel.Minimal),
	Designer(typeof(BrowserType)),
	ToolboxData("<{0}:BrowserType runat=\"server\"> </{0}:BrowserType>")]
	[ParseChildren(true)]
	[PersistChildren(true)]
	public partial class BrowserType : UserControl {
		public class NameContainer : Control, INamingContainer { }

		#region Template Properties
		private ITemplate IE6tmpl;
		private ITemplate IE7plustmpl;
		private ITemplate IE9plustmpl;
		private ITemplate FF2plustmpl;
		private ITemplate Othertmpl;
		private ITemplate Sf2plustmpl;
		private ITemplate GChrmtmpl;

		/// <summary>
		/// Content visible to users with unrecognised browers
		/// </summary>
		[TemplateContainer(typeof(BrowserType))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate Other {
			get { return Othertmpl; }
			set { Othertmpl = value; }
		}

		/// <summary>
		/// Content visible to Safari 2+ users
		/// </summary>
		[TemplateContainer(typeof(BrowserType))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate Sf2plus {
			get { return Sf2plustmpl; }
			set { Sf2plustmpl = value; }
		}

		/// <summary>
		/// Content visible to IE 6 users
		/// </summary>
		[TemplateContainer(typeof(BrowserType))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate IE6 {
			get { return IE6tmpl; }
			set { IE6tmpl = value; }
		}

		/// <summary>
		/// Content visible to IE 7+ users
		/// </summary>
		[TemplateContainer(typeof(BrowserType))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate IE7plus {
			get { return IE7plustmpl; }
			set { IE7plustmpl = value; }
		}

		/// <summary>
		/// Content visible to IE 9+ users
		/// </summary>
		[TemplateContainer(typeof(BrowserType))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate IE9plus {
			get { return IE9plustmpl; }
			set { IE9plustmpl = value; }
		}

		/// <summary>
		/// Content visible to Firefox 2+ users
		/// </summary>
		[TemplateContainer(typeof(BrowserType))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate FF2plus {
			get { return FF2plustmpl; }
			set { FF2plustmpl = value; }
		}
		/// <summary>
		/// Content visible to Google Chrome users
		/// </summary>
		[TemplateContainer(typeof(BrowserType))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate GCr {
			get { return GChrmtmpl; }
			set { GChrmtmpl = value; }
		}
		#endregion

		/// <summary>
		/// Prepares Placeholders by including each template if available.
		/// </summary>
		protected void Page_Init (object sender, EventArgs e) {
			if (Other != null) {
				var container0 = new NameContainer();
				Other.InstantiateIn(container0);
				OtherTemplate.Controls.Add(container0);
			}

			if (IE6 != null) {
				var container1 = new NameContainer();
				IE6.InstantiateIn(container1);
				IE6Template.Controls.Add(container1);
			}

			if (IE7plus != null) {
				var container2 = new NameContainer();
				IE7plus.InstantiateIn(container2);
				IE7plusTemplate.Controls.Add(container2);
			}

			if (IE9plus != null) {
				var container21 = new NameContainer();
				IE9plus.InstantiateIn(container21);
				IE9plusTemplate.Controls.Add(container21);
			}

			if (FF2plus != null) {
				var container3 = new NameContainer();
				FF2plus.InstantiateIn(container3);
				FF2plusTemplate.Controls.Add(container3);
			}

			if (Sf2plus != null) {
				var container4 = new NameContainer();
				Sf2plus.InstantiateIn(container4);
				Sf2plusTemplate.Controls.Add(container4);
			}

			if (GCr != null) {
				var container5 = new NameContainer();
				GCr.InstantiateIn(container5);
				GCrTemplate.Controls.Add(container5);
			}
		}

		/// <summary>
		/// Set Placeholders' visiblity based on the currently logged in user's permission
		/// to view a given destination page.
		/// </summary>
		protected void Page_Load (object sender, EventArgs e) {
			Hide(IE6Template);
			Hide(IE7plusTemplate);
			Hide(IE9plusTemplate);
			Hide(FF2plusTemplate);
			Hide(Sf2plusTemplate);
			Hide(GCrTemplate);
			Show(OtherTemplate);

			try {
				if (!String.IsNullOrEmpty(Request["brsel"])) {
					// Detect forced browser
					DetectForced(Server.UrlDecode(Request["brsel"]).ToLowerInvariant());
				} else {
					// Detect real browser
					DetectNatural();
				}
			} catch {
				Show(OtherTemplate);
			}
		}

		private void DetectForced (string brws) {
			if (brws.Contains("ie6")) {
				Show(IE6Template);
				Hide(OtherTemplate);
			} else if (brws.Contains("ie7plus")) {
				Show(IE7plusTemplate);
				Hide(OtherTemplate);
			} else if (brws.Contains("ie9plus")) {
				Show(IE9plusTemplate);
				Hide(OtherTemplate);
			} else if (brws.Contains("ff2plus")) {
				Show(FF2plusTemplate);
				Hide(OtherTemplate);
			} else if (brws.Contains("sf2plus")) {
				Show(Sf2plusTemplate);
				Hide(OtherTemplate);
			} else if (brws.Contains("GCr")) {
				Show(GCrTemplate);
				Hide(OtherTemplate);
			}
		}

		private void DetectNatural () {
			var ua = (Request.UserAgent ?? "");
			string brws = Request.Browser.Browser.ToLowerInvariant();
			string uas = (Request.UserAgent??"").ToLowerInvariant();
			int vers = Request.Browser.MajorVersion;
			double ver2;
			// deal with Safari versions:
			string svs;
			if (ua.LastIndexOf("Version/") > 0) {
				svs = ua.Substring(ua.LastIndexOf("Version/") + 8, 3);
			} else {
				svs = ua.Substring(ua.LastIndexOf("/") + 1);
			}
			if (double.TryParse(svs, out ver2)) {
				if (ver2 > 100.0) ver2 /= 100.0;
			}

			if (brws.Contains("ie") && vers == 6 && IE6 != null) {
				Show(IE6Template);
				Hide(OtherTemplate);
			} else if (brws.Contains("ie") && vers >= 9 && IE9plus != null) {
				Show(IE9plusTemplate);
				Hide(OtherTemplate);
			} else if (brws.Contains("ie") && vers < 9 && IE7plus != null) {
				Show(IE7plusTemplate);
				Hide(OtherTemplate);
			}  else if (brws.Contains("firefox") && vers >= 2 && FF2plus != null) {
				Show(FF2plusTemplate);
				Hide(OtherTemplate);
			} else if (brws.Contains("safari")) {
				if (uas.Contains("chrome") && GCr != null) {
					Show(GCrTemplate);
					Hide(OtherTemplate);
				} else if (ver2 >= 2.0 && Sf2plus != null) {
					Show(Sf2plusTemplate);
					Hide(OtherTemplate);
				}
			}
		}

		private void Hide (Control holder) {
			if (holder == null) return;
			holder.Visible = false;
		}
		private void Show (Control holder) {
			if (holder == null) return;
			holder.Visible = true;
		}

	}
}