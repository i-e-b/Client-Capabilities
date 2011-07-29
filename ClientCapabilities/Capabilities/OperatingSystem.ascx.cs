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
Designer(typeof(OperatingSystem)),
ToolboxData("<{0}:OperatingSystem runat=\"server\"> </{0}:OperatingSystem>")]
	[ParseChildren(ChildrenAsProperties = true)]
	[PersistChildren(true)]
	public partial class OperatingSystem : UserControl {
		public class NameContainer : Control, INamingContainer { }

		#region Properties
		private ITemplate MacXtmpl;
		private ITemplate WinXPtmpl;
		private ITemplate WinVistatmpl;
		private ITemplate Win7tmpl;
		private ITemplate Linuxtmpl;
		private ITemplate Othertmpl;

		/// <summary>
		/// Content visible to users with unrecognised OSs
		/// </summary>
		[TemplateContainer(typeof(OperatingSystem))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate Other {
			get { return Othertmpl; }
			set { Othertmpl = value; }
		}

		/// <summary>
		/// Content visible to Mac OS X users
		/// </summary>
		[TemplateContainer(typeof(OperatingSystem))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate MacX {
			get { return MacXtmpl; }
			set { MacXtmpl = value; }
		}

		/// <summary>
		/// Content visible to Window XP users
		/// </summary>
		[TemplateContainer(typeof(OperatingSystem))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate WinXP {
			get { return WinXPtmpl; }
			set { WinXPtmpl = value; }
		}

		/// <summary>
		/// Content visible to Window Vista users
		/// </summary>
		[TemplateContainer(typeof(OperatingSystem))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate WinVista {
			get { return WinVistatmpl; }
			set { WinVistatmpl = value; }
		}

		/// <summary>
		/// Content visible to Window 7 users
		/// </summary>
		[TemplateContainer(typeof(OperatingSystem))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate Win7 {
			get { return Win7tmpl; }
			set { Win7tmpl = value; }
		}

		/// <summary>
		/// Content visible to Linux/Unix users
		/// </summary>
		[TemplateContainer(typeof(OperatingSystem))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate Linux {
			get { return Linuxtmpl; }
			set { Linuxtmpl = value; }
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

			if (MacX != null) {
				var container1 = new NameContainer();
				MacX.InstantiateIn(container1);
				MacXTemplate.Controls.Add(container1);
			}

			if (WinXP != null) {
				var container2 = new NameContainer();
				WinXP.InstantiateIn(container2);
				WinXPTemplate.Controls.Add(container2);
			}

			if (WinVista != null) {
				var container3 = new NameContainer();
				WinVista.InstantiateIn(container3);
				WinVistaTemplate.Controls.Add(container3);
			}

			if (Win7 != null) {
				var container4 = new NameContainer();
				Win7.InstantiateIn(container4);
				Win7Template.Controls.Add(container4);
			}

			if (Linux != null) {
				var container5 = new NameContainer();
				Linux.InstantiateIn(container5);
				LinuxTemplate.Controls.Add(container5);
			}
		}

		/// <summary>
		/// Set Placeholders' visiblity based on the currently logged in user's permission
		/// to view a given destination page.
		/// </summary>
		protected void Page_Load (object sender, EventArgs e) {
			Hide(MacXTemplate);
			Hide(WinXPTemplate);
			Hide(WinVistaTemplate);
			Hide(Win7Template);
			Hide(LinuxTemplate);
			Show(OtherTemplate);

			try {
				string plat = (Request.UserAgent ?? "").ToLowerInvariant();
				if (!String.IsNullOrEmpty(Request["sysel"]))
					plat = Server.UrlDecode(Request["sysel"]).ToLowerInvariant();

				if (plat.Contains("macintosh") && MacX != null) {
					Show(MacXTemplate);
					Hide(OtherTemplate);
				}
				if (plat.Contains("linux") && Linux != null) {
					Show(LinuxTemplate);
					Hide(OtherTemplate);
				}

				if (plat.Contains("windows nt 6.1") && Win7 != null) {
					Show(Win7Template);
					Hide(OtherTemplate);
				} else if (plat.Contains("windows nt 6") && WinVista != null) {
					Show(WinVistaTemplate);
					Hide(OtherTemplate);
				} else if (plat.Contains("windows") && WinXP != null) {
					Show(WinXPTemplate);
					Hide(OtherTemplate);
				}
			} catch {
				Show(OtherTemplate);
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