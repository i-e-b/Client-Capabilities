<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="BrowserCapabilities._Default" %>
<%@ Register src="Capabilities/PluginCheck.ascx" tagname="PluginCheck" tagprefix="cap" %>
<%@ Register src="Capabilities/BrowserType.ascx" tagname="BrowserType" tagprefix="cap" %>
<%@ Register src="Capabilities/OperatingSystem.ascx" tagname="OperatingSystem" tagprefix="cap" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Test Page</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
		<h1>Environment detection templates</h1>
		
		<h2>Browsers</h2>
		<cap:BrowserType ID="BrowserType1" runat="server">
		<IE6>Looks like you're browsing with IE6, you stick-in-the-mud.
		     Web developers everywhere are cursing you this very moment.</IE6>
		<IE7plus>Looks like you're browsing with IE7. That's OK.</IE7plus>
		<FF2plus>Looks like you're browsing with Firefox 2 or greater. That's pretty nice.</FF2plus>
		<Sf2plus>Looks like you're browsing with Safari 2 or greater. That's pretty nice.</Sf2plus>
		<Gcr>Looks like you're browsing with Google Chrome. That's pretty nice.</Gcr>
		<Other>Looks like you're browsing with a browser that's not covered by the detection system this
		       web site uses. You're on your own, kook! ;-)</Other>
		</cap:BrowserType>
    
    	<h2>Operating Systems</h2>
    	<cap:OperatingSystem ID="OperatingSystem1" runat="server">
    	<WinXP>Looks like you're running on Windows XP</WinXP>
		<WinVista>Looks like you're running on Windows Vista</WinVista>
		<Win7>Looks like you're running on Windows 7</Win7>
		<MacX>Looks like you're running on Mac OS X</MacX>
		<Linux>Looks like you're running on Linux of some variety.</Linux>
		<Other>Looks like you're running on an operating system that's not covered by the detection system this
		       web site uses. You're on your own, kook! ;-)</Other>
    	</cap:OperatingSystem>
    
		<h2>Plugins</h2>
		<h3>WMP</h3>
    	<cap:PluginCheck PluginType="mediaPlayer" Version="9.0"  ID="PluginCheck0" runat="server">
    		<MeetsVersion>
    			You have Windows Media Player installed, and it's at least version 9.0.
			</MeetsVersion>
			<FailsVersion>
    			You have Windows Media Player installed, but it's either earlier than 9.0, or the version
    			couldn't be detected (this affects Windows Media Player on browsers other than IE).
			</FailsVersion>
			<NotPresent>
				You don't seem to have Windows Media Player installed.
			</NotPresent>
    	</cap:PluginCheck>
    	
		<h3>Flash</h3>
    	<cap:PluginCheck PluginType="flash" Version="10.0"  ID="PluginCheck1" runat="server">
    		<MeetsVersion>
    			You have Flash installed, and it's at least version 10.0.
			</MeetsVersion>
			<FailsVersion>
    			You have Flash installed, but it's either earlier than 10.0, or the version
    			couldn't be detected.
			</FailsVersion>
			<NotPresent>
				You don't seem to have Flash installed.
			</NotPresent>
    	</cap:PluginCheck>
    	
		<h3>Silverlight</h3>
    	<cap:PluginCheck PluginType="silverlight" Version="4.0"  ID="PluginCheck2" runat="server">
    		<MeetsVersion>
    			You have Silverlight installed, and it's at least version 4.0.
			</MeetsVersion>
			<FailsVersion>
    			You have Silverlight installed, but it's either earlier than 4.0, or the version
    			couldn't be detected.
			</FailsVersion>
			<NotPresent>
				You don't seem to have Silverlight installed.
			</NotPresent>
    	</cap:PluginCheck>
    	
		<h3>Java</h3>
    	<cap:PluginCheck PluginType="java" Version="1.5"  ID="PluginCheck3" runat="server">
    		<MeetsVersion>
    			You have Java installed, and it's at least version 1.5.
			</MeetsVersion>
			<FailsVersion>
    			You have Java installed, but it's either earlier than 1.5, or the version
    			couldn't be detected.
			</FailsVersion>
			<NotPresent>
				You don't seem to have Java installed.
			</NotPresent>
    	</cap:PluginCheck>
    	
		<h3>Quicktime</h3>
    	<cap:PluginCheck PluginType="quicktime" Version="7.0"  ID="PluginCheck4" runat="server">
    		<MeetsVersion>
    			You have Quicktime installed, and it's at least version 7.0.
			</MeetsVersion>
			<FailsVersion>
    			You have Quicktime installed, but it's either earlier than 7.0, or the version
    			couldn't be detected.
			</FailsVersion>
			<NotPresent>
				You don't seem to have Quicktime installed.
			</NotPresent>
    	</cap:PluginCheck>
    	
		<h3>PDF</h3>
    	<cap:PluginCheck PluginType="pdf" Version="1.5"  ID="PluginCheck5" runat="server">
    		<MeetsVersion>
    			You have inline PDF capability, and it's at least version 1.5.
			</MeetsVersion>
			<FailsVersion>
    			You have inline PDF capability, but it's either earlier than 1.5, or the version
    			couldn't be detected.
			</FailsVersion>
			<NotPresent>
				You don't seem to have inline PDF capability.
			</NotPresent>
    	</cap:PluginCheck>
    
    	<h2>Nesting demonstration</h2>
    	<p>To show that these can be nested for extra functionality</p>
    	<cap:OperatingSystem ID="OperatingSystem2" runat="server">
    	<WinXP>
    		XP / 
    			<cap:BrowserType ID="BTI1" runat="server">
				<IE6>IE6</IE6> <IE7plus>IE7</IE7plus> <FF2plus>FF2</FF2plus> <Sf2plus>Sf2</Sf2plus> <GCr>GCr</GCr> <Other>?</Other>
				</cap:BrowserType>
    	</WinXP>
		<WinVista>
		Vista / 
    			<cap:BrowserType ID="BTI2" runat="server">
				<IE6>IE6</IE6> <IE7plus>IE7</IE7plus> <FF2plus>FF2</FF2plus> <Sf2plus>Sf2</Sf2plus> <GCr>GCr</GCr> <Other>?</Other>
				</cap:BrowserType>
		</WinVista>
		<WinVista>
		Win7 / 
    			<cap:BrowserType ID="BTI2_5" runat="server">
				<IE6>IE6</IE6> <IE7plus>IE7</IE7plus> <FF2plus>FF2</FF2plus> <Sf2plus>Sf2</Sf2plus> <GCr>GCr</GCr> <Other>?</Other>
				</cap:BrowserType>
		</WinVista>
		<MacX>
		Mac OS X / 
    			<cap:BrowserType ID="BTI3" runat="server">
				<IE6>IE6</IE6> <IE7plus>IE7</IE7plus> <FF2plus>FF2</FF2plus> <Sf2plus>Sf2</Sf2plus> <GCr>GCr</GCr> <Other>?</Other>
				</cap:BrowserType>
		</MacX>
		<Linux>
		Linux / 
    			<cap:BrowserType ID="BTI4" runat="server">
				<IE6>IE6</IE6> <IE7plus>IE7</IE7plus> <FF2plus>FF2</FF2plus> <Sf2plus>Sf2</Sf2plus> <GCr>GCr</GCr> <Other>?</Other>
				</cap:BrowserType>
		</Linux>
		<Other>
		? / 
    			<cap:BrowserType ID="BTI5" runat="server">
				<IE6>IE6</IE6> <IE7plus>IE7</IE7plus> <FF2plus>FF2</FF2plus> <Sf2plus>Sf2</Sf2plus> <GCr>GCr</GCr> <Other>?</Other>
				</cap:BrowserType>
		</Other>
    	</cap:OperatingSystem>
    	
		<h2>Force other results:</h2>
		<div>
			Systems: <a href="?sysel=macintosh">Mac OS X</a> | <a href="?sysel=windows">Windows XP</a> | <a href="?sysel=windows%20nt%206">Windows Vista</a> | <a href="?sysel=windows%20nt%206.1">Windows 7</a><br />
			Browsers: <a href="?brsel=IE6">IE 6</a> | <a href="?brsel=IE7plus">IE 7</a> | <a href="?brsel=FF2plus">Firefox</a> | <a href="?brsel=Sf2plus">Safari</a><br />
			<a href="Default.aspx">Re-detect current system</a>
		</div>
    </form>
</body>
</html>
