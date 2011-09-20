<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <script type="text/javascript" src="../../Scripts/jquery-1.5.1.min.js"></script>
    <script type="text/javascript" src="../../Scripts/Players/jQuery.json.js"></script>
    <script type="text/javascript" src="../../Scripts/Players/BrowserEnvironment.js"></script>

	<video width="1" height="1" id="player1" preload="none" style="display:none"></video>

    <script type="text/javascript">
    	$.post('/Home/GetLocation', { 'spec': envspec.Specification.get('player1') }, function (txt) {
    		document.location = txt;
    	});
	</script>
</body>
</html>
