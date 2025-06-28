# API REFERENCE

## Table of Contents
- [QML controls](#qmo-controls)
- [QML functions](#qml-functions)
- [QML properties](#qml-properties)
- [Javascript functions](#javascript-functions)
- [Javascript properties](#javascript-properties)

## QML controls

## QML functions
<table>
<tr>
<td>b_getbox(type)</td>
<td>
Returns an object of type Box. This object can be used to call native functionas that are executed at the C++ core application, hence running much faster.<br>
Parameter <code>type</code> is a string which can be either "REMOTE" or nothing. If "REMOTE" is provided, then the Box object will access the hardware at the server side.<br>
Example: <code>let box = b_getbox();</code><br>
Example: <code>let box = b_getbox("REMOTE");</code><br>
</td>
</tr>
<tr>
<td>b_send(key,value)</td>
<td>
Sends data to the server side.<br>
Parameters <code>key</code> and <code>value</code> are strings.<br>
Example: <code>b_send("init");</code><br>
Example: <code>b_send("gain", "15");</code><br>
</td>
</tr>
<tr>
<td>b_sendbin(key,value)</td>
<td>
Sends binary data to the server side.<br>
Parameter <code>key</code> is a string.<br>
Parameter <code>value</code> is a binary array of type QByteArrayView. Check in the Box API section for an explanation of this data type.<br>
Example: <code>b_send("audio", data);</code><br>
</td>
</tr>
<tr>
<td>b_setvar(key,value)</td>
<td>
Sets the configuration parameter <code>key</code> to the value <code>value</code><br>
The configuration parameters are used to save values that are permanent among several runs of the module.
Parameters <code>key</code> and <code>value</code> are strings.<br>
Example: <code>b_setvar("height", "100");</code><br>
</td>
</tr>
<tr>
<td>b_getvar(key,default)</td>
<td>
Gets the configuration parameter <code>key</code>. If the parameter doesn't exist, then returns the value <code>default</code><br>
The configuration parameters are used to save values that are permanent among several runs of the module.
Parameters <code>key</code> and <code>default</code> are strings.<br>
Example: <code>let h = b_setvar("height", "100");</code><br>
</td>
</tr>
<tr>
<td>b_debug(value)</td>
<td>
Shows the value stored in <code>vaue</code> in the log file and the console if any.<br>
Parameter <code>value</code> can be of any native Javascript type.<br>
Example: <code>b_debug("height=" + h);</code><br>
</td>
</tr>
<tr>
<td>b_param(key)</td>
<td>
Retrieves the configuration parameter with name <code>key</code> from the main configuration file of the application stored in the file config.set<br>
Parameter <code>key</code> is a string.<br>
Example: <code>let theme = b_param("ui.theme");</code><br>
</td>
</tr>
<tr>
<td>b_import(name,file)</td>
<td>
Imports a Javascript module of type .mjs.<br>
Parameter <code>name</code> is a string that will be used to reference the primitives available in the imported module.<br>
Parameter <code>file</code> is a string containing the file name of the module to be imported. This file must be added to the resource collection file.<br>
Example: <code>b_import("RTLSDR", "rtlsdr.mjs");</code><br>
</td>
</tr>
<tr>
<td>b_translate(text)</td>
<td>
Returns the text in English stored in <code>text</code> translated to the current language.<br>
Parameter <code>text</code> is a string.<br>
The value in <code>text</code> will be added to the corresponding language file to be manually translated before compilation.<br>
Example: <code>text: b_translate("Name:");</code><br>
</td>
</tr>
<tr>
<td>b_theme(type,name,var)</td>
<td>
Returns the value of a parameter from the current them. This could be a color, a size, etc.<br>
Usually, this function is not needed. It is used by the QML components included in the code.<br>
Parameter <code>type</code> is a string representing the control type.<br>
Parameter <code>name</code> is a string representing the control name.<br>
Parameter <code>var</code> is a string representing the theme parameter to be retrieved.<br>
Example: <code>color: b_theme("TButton", "mybutton", "foreground-color");</code><br>
</td>
</tr>
<tr>
<td>b_conn()</td>
<td>
Returns a string with the type of connection established between the client and the server. The possible values are:
<ul>
  <li>SELF: The client and the server are on the same computer</li>
  <li>LOCAL: The client and the server are on different computers on the same local network</li>
  <li>DIRECT: The client and the server are on different local networks but the client can access the server directly</li>
  <li>CBACK: The client and the server are on different local networks but the server can contact the client directly. The client has used a call-back method to contact the server</li>
  <li>TCP: The client and the server cannot communicate directly and the traffic if relayed by the niliBOX server</li>
  <li>HTTP: The client and the server cannot communicate and there is no possible TCP connection with the niliBOX server. The traffic is encapsulated in HTTP</li>
</ol>
Example: <code>let connection = b_conn();</code><br>
</td>
</tr>
<tr>
<td>b_mouse(type)</td>
<td>
Changes the shape of the mouse cursor.<br>
The possible values for <code>type</code> are given by the Qt::CursorShape type as described <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-mousearea.html#cursorShape-prop>here</a><br>
Example: <code>b_mouse(Qt.PointingHandCursor);</code><br>
</td>
</tr>
</table>

## QML properties
<table>
<tr>
<td>b_unit</td>
<td>
Real value containing the size in pixels of a distance of approximately 1 cm in desktops at 8 mm in touch screens. This value is used as unit of measure in all sizes used in the application.<br>
This value can change when the core application is resized, as well as <code>b_space</code> and <code>b_fontsize</code>.
</td>
</tr>
<tr>
<td>b_space</td>
<td>Real value containing the size of a small separation between controls. <code>b_space = 0.1 * b_unit</code></td>
</tr>
<tr>
<td>b_width</td>
<td>Available width in pixels.</td>
</tr>
<tr>
<td>b_height</td>
<td>Available height in pixels.</td>
</tr>
<tr>
<td>b_fontsize</td>
<td>Real value containing the font size in pixels used by the rest of the application. <code>b_fontsize = 0.45 * b_unit</code></td>
</tr>
<tr>
<td>b_fontfamily</td>
<td>String value containing the name of the font used by the rest of the application.</td>
</tr>
<tr>
<td>b_appname</td>
<td>String value containing the name of the module that is running. This name is given by the user when creating a module.</td>
</tr>
<tr>
<td>b_os</td>
<td>String value containing the operating system in use. The possible values are:</td>
<ul>
  <li>windows</li>
  <li>linux</li>
  <li>macos</li>
  <li>android</li>
  <li>ios</li>
</ol>
</tr>
</table>

## Javascript functions

## Javascript properties

## Box API

