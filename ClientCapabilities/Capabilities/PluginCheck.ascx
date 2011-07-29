<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="PluginCheck.ascx.cs" Inherits="BrowserCapabilities.Capabilities.PluginCheck" %>
<span id="mvt" runat="server" style="display:none;"><asp:PlaceHolder ID="MeetsVersionTemplate" runat="server"></asp:PlaceHolder></span>
<span id="fvt" runat="server" style="display:none;"><asp:PlaceHolder ID="FailsVersionTemplate" runat="server"></asp:PlaceHolder></span>
<span id="pnp" runat="server" style=""><asp:PlaceHolder ID="NotPresentTemplate" runat="server"></asp:PlaceHolder></span>