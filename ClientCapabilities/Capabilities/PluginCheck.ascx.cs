using System;
using System.Web;
using System.Web.UI;
using System.ComponentModel;
using System.Security.Permissions;

namespace BrowserCapabilities.Capabilities {

	[AspNetHostingPermission(SecurityAction.InheritanceDemand,
		Level = AspNetHostingPermissionLevel.Minimal),
	AspNetHostingPermission(SecurityAction.Demand,
		Level = AspNetHostingPermissionLevel.Minimal),
	Designer(typeof(PluginCheck)),
	DefaultProperty("PluginType"),
	ToolboxData("<{0}:PluginCheck runat=\"server\"> </{0}:PluginCheck>")]
	[ParseChildren(true)]
	[PersistChildren(true)]
	public partial class PluginCheck : UserControl {
		public class NameContainer : Control, INamingContainer { }

		#region Template Properties
		private ITemplate meetsVersion;
		private ITemplate failsVersion;
		private ITemplate notPresent;

		/// <summary>
		/// Content visible if plugin is present and correct
		/// </summary>
		[TemplateContainer(typeof(PluginCheck))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate MeetsVersion {
			get { return meetsVersion; }
			set { meetsVersion = value; }
		}

		/// <summary>
		/// Content visible if plugin is present but too old
		/// </summary>
		[TemplateContainer(typeof(PluginCheck))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate FailsVersion {
			get { return failsVersion; }
			set { failsVersion = value; }
		}

		/// <summary>
		/// Content visible if plugin is missing
		/// </summary>
		[TemplateContainer(typeof(PluginCheck))]
		[PersistenceMode(PersistenceMode.InnerProperty)]
		public ITemplate NotPresent {
			get { return notPresent; }
			set { notPresent = value; }
		}

		#endregion

		#region Attribute Properties
		private string pluginType;
		private float version;

		/// <summary>
		/// Minimum version to match
		/// </summary>
		[CategoryAttribute("Checks"), DescriptionAttribute("Minimum version to match"), BrowsableAttribute(true)]
		public float Version {
			get { return version; }
			set { version = value; }
		}

		/// <summary>
		/// Plugin name for which to check
		/// </summary>
		[CategoryAttribute("Checks"), DescriptionAttribute("Plugin name to check"), BrowsableAttribute(true)]
		public string PluginType {
			get { return pluginType ?? ""; }
			set { pluginType = value; }
		}

		#endregion


		/// <summary>
		/// Prepares Placeholders by including each template if available.
		/// </summary>
		protected void Page_Init (object sender, EventArgs e) {
			if (MeetsVersion != null) {
				var container0 = new NameContainer();
				MeetsVersion.InstantiateIn(container0);
				MeetsVersionTemplate.Controls.Add(container0);
			}

			if (FailsVersion != null) {
				var container1 = new NameContainer();
				FailsVersion.InstantiateIn(container1);
				FailsVersionTemplate.Controls.Add(container1);
			}

			if (NotPresent != null) {
				var container2 = new NameContainer();
				NotPresent.InstantiateIn(container2);
				NotPresentTemplate.Controls.Add(container2);
			}
		}

		/// <summary>
		/// Inject test code 
		/// </summary>
		protected void Page_Load (object sender, EventArgs e) {
			string pdir = AppRelativeVirtualPath;
			pdir = pdir.Substring(0, pdir.LastIndexOf('/'));
			IncludeOnce(pdir+"/DPlugin-1.0.js"); // one per page

			string test_script = String.Format(@"

if (dPlugin.hasPlugin('{0}')) {{
	document.getElementById('{4}').style.display = 'none';
	var vers = dPlugin.getPluginVersion('{0}');
	var ver = dPlugin.compareVersions(vers, '{2}');
	if (ver < 0) {{
		document.getElementById('{1}').style.display = '';
	}} else {{
		document.getElementById('{3}').style.display = '';
	}}
}} else {{
	document.getElementById('{4}').style.display = '';
}}
",
			PluginType,
			fvt.ClientID, // fails version test
			Version,
			mvt.ClientID, // meets version test
			pnp.ClientID // plugin not present
			);

			// Add one per control instance:
			Page.ClientScript.RegisterStartupScript(GetType(), ClientID, test_script, true);
		}

		/// <summary>
		/// Include a script file once only per page.
		/// Can be called multiple times (for example in User Controls)
		/// </summary>
		private void IncludeOnce (string scriptUrl) {
			Page.ClientScript.RegisterClientScriptInclude(Page.GetType(), scriptUrl,
				Page.ResolveClientUrl(scriptUrl));
		}

	}
}