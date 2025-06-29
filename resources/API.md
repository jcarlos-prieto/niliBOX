# API REFERENCE

## Table of Contents
- [QML controls](#qml-controls)
- [QML callable functions](#qml-callable-functions)
- [QML overridable functions](#qml-overridable-functions)
- [QML properties](#qml-properties)
- [Javascript functions](#javascript-functions)
- [Javascript properties](#javascript-properties)
- [Box API](#box-api)

## QML controls
These controls extend the functionality of the standard QtQuick controls to make them adjust to the theme selected in the core application. The purpose is to provide a consistent look and feel between the core application and the modules.<br>
All these controls add a new property called `name` which connects with the theme definitions. For instance, if a control is given `name: mybutton` and the theme definition file contains `mybutton.image = myicon.png`, then mybutton will show the icon myicon.<br>
The appearence of these controls is modified by theme attributes which are listed here for each control.
<table>
<tr>
<td>TButton</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-abstractbutton.html>AbstractButton</a>
<ul>
<li>Additional property <code>name</code>: String</li>
<li>Additional property <code>tooltiptext</code>: String - Text for tooltip box</li>
<li>Theme attributes: margin margin-top margin-bottom margin-left margin-right padding padding-top padding-bottom padding-left padding-right border-width radius angle foreground-color border-color text-color text-weight image</li>
</ul>
</td>
</tr>
<tr>
<td>TCheck</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-abstractbutton.html>AbstractButton</a>
<ul>
<li>Additional property <code>name</code>: String</li>
<li>Theme attributes: margin margin-top margin-bottom margin-left margin-right padding padding-top padding-bottom padding-left padding-right border-width radius angle foreground-color border-color text-color text-weight image</li>
</ul>
</td>
</tr>
<tr>
<td>TColumn</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-column.html>Column</a>
<ul>
<li>Additional property <code>name</code>: String</li>
<li>Theme attributes: margin margin-top margin-bottom margin-left margin-right padding padding-top padding-bottom padding-left padding-right border-width spacing</li>
</ul>
</td>
</tr>
<tr>
<td>TComboBox</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-combobox.html>ComboBox</a>
<ul>
<li>Additional property <code>name</code>: String</li>
<li>Theme attributes: margin margin-top margin-bottom margin-left margin-right padding padding-top padding-bottom padding-left padding-right border-width radius foreground-color border-color text-color text-weight image</li>
<li>Subcomponent .arrow attributes: angle foregrouund-color image</li>
</ul>
</td>
</tr>
<tr>
<td>TGraph</td>
<td>
This is a native control, not inheriting any standard QML control. It provides a high quality graph panel for time series signals.
<ul>
<li>Property <code>name</code>: String</li>
<li>Property <code>data</code>: </li>
<li>Theme attributes: background-color signalcolor signalfillcolor1 signalfillcolor2 signalfillcolor3</li>
</ul>
</td>
</tr>
</table>

## QML callable functions
These functions can be called from your source code, both a QML action or a Javascript function.
<table>
<tr>
<td>b_getbox(type)</td>
<td>
Creates a new Box object to interact with the C++ Box API.
<ul>
<li>Parameter <code>type</code>: String - It can be either "REMOTE" or nothing. If "REMOTE" is provided, then the Box object will access the hardware at the server side</li>
<li>Return value: An object of type Box</li>
</ul>
Example: <code>let box = b_getbox();</code><br>
Example: <code>let box = b_getbox("REMOTE");</code><br>
</td>
</tr>
<tr>
<td>b_send(key,value)</td>
<td>
Client: Sends data to the server side.<br>
Config: Adds the module configuration file a parameter <code>key</code> with value <code>value</code>
<ul>
<li>Parameter <code>key</code>: String</li>
<li>Parameter <code>value</code>: Any basic Javascript type</li>
<li>Return value: None</li>
</ul>
Example: <code>b_send("init");</code><br>
Example: <code>b_send("gain", "15");</code><br>
</td>
</tr>
<tr>
<td>b_sendbin(key,value)</td>
<td>
Sends binary data to the server side.
<ul>
<li>Parameter <code>key</code>: String</li>
<li>Parameter <code>value</code>: Binary - The binary type is a mirror of the Qt type QByteArrayView. Check in the <a href=./API.md#box-api>Box API</a> section for an explanation of this data type.</li>
<li>Return value: None</li>
</ul>
Example: <code>b_send("audio", data);</code><br>
</td>
</tr>
<tr>
<td>b_setvar(key,value)</td>
<td>
Sets a configuration parameter. The configuration parameters are used to save values that are permanent among several runs of the module.
<ul>
<li>Parameter <code>key</code>: String - Setting name.</li>
<li>Parameter <code>value</code>: Any basic Javascript data type - Setting value</li>
<li>Return value: None</li>
</ul>
Example: <code>b_setvar("height", "100");</code><br>
</td>
</tr>
<tr>
<td>b_getvar(key,default)</td>
<td>
Gets a configuration parameter. The configuration parameters are used to save values that are permanent among several runs of the module.
<ul>
<li>Parameter <code>key</code>: String - Setting name.</li>
<li>Parameter <code>default</code>: Any basic Javascript data type - Default value if the setting doesn't exist</li>
<li>Return value: String</li>
</ul>
Example: <code>let h = b_setvar("height", "100");</code><br>
</td>
</tr>
<tr>
<td>b_debug(value)</td>
<td>
Adds a message to the log file and the console if any.
<ul>
<li>Parameter <code>value</code>: Any native Javascript type</li>
<li>Return value: None</li>
</ul>
Example: <code>b_debug("height=" + h);</code><br>
</td>
</tr>
<tr>
<td>b_param(key)</td>
<td>
Retrieves a configuration parameter from the main configuration file of the application stored in the file config.set.
<ul>
<li>Parameter <code>key</code>: String</li>
<li>Return value: String</li>
</ul>
Example: <code>let theme = b_param("ui.theme");</code><br>
</td>
</tr>
<tr>
<td>b_import(name,file)</td>
<td>
Imports a Javascript module of type .mjs.
<ul>
<li>Parameter <code>name</code>: String - This value will be used to reference the primitives available in the imported module</li>
<li>Parameter <code>file</code>: String - File name of the module to be imported. This file must be added to the resource collection file</li>
<li>Return value: None</li>
</ul>
Example: <code>b_import("RTLSDR", "rtlsdr.mjs");</code><br>
</td>
</tr>
<tr>
<td>b_translate(text)</td>
<td>
Returns the translation into the current language of the text (in English) provided.
<ul>
<li>Parameter <code>text</code>: String - This value will be added to the corresponding language file to be manually translated before compilation</li>
<li>Return value: String</li>
</ul>
Example: <code>text: b_translate("Name:");</code><br>
</td>
</tr>
<tr>
<td>b_theme(type,name,var)</td>
<td>
Returns the value of a parameter from the current theme. This could be a color, a size, etc. Usually, this function is not needed. It is used by the QML components included in the code.
<ul>
<li>Parameter <code>type</code>: String - Control type</li>
<li>Parameter <code>name</code>: String - Control name.</li>
<li>Parameter <code>var</code>: String - Theme parameter to be retrieved</li>
<li>Return value: String</li>
</ul>
Example: <code>color: b_theme("TButton", "mybutton", "foreground-color");</code><br>
</td>
</tr>
<tr>
<td>b_conn()</td>
<td>
Returns the type of connection established between the client and the server. The possible values are:
<ul>
<li>SELF: The client and the server are on the same computer</li>
<li>LOCAL: The client and the server are on different computers on the same local network</li>
<li>DIRECT: The client and the server are on different local networks but the client can access the server directly</li>
<li>CBACK: The client and the server are on different local networks but the server can contact the client directly. The client has used a call-back method to contact the server</li>
<li>TCP: The client and the server cannot communicate directly and the traffic if relayed by the niliBOX server</li>
<li>HTTP: The client and the server cannot communicate and there is no possible TCP connection with the niliBOX server. The traffic is encapsulated in HTTP</li>
</ul>
Example: <code>let connection = b_conn();</code><br>
</td>
</tr>
<tr>
<td>b_mouse(type)</td>
<td>
Changes the shape of the mouse cursor.
<ul>
<li>Parameter <code>type</code>:  Qt::CursorShape type - This type is described <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-mousearea.html#cursorShape-prop>here</a></li>
<li>Return value: None</li>
</ul>
Example: <code>b_mouse(Qt.PointingHandCursor);</code><br>
</td>
</tr>
</table>

## QML overridable functions
These functions can be implemented in the Javascript code and will be called by the core application when needed.
<table>
<tr>
<td>b_start(params)</td>
<td>
Called when the client starts.
<ul>
<li>Parameter <code>params</code>: Data structure - The object params contains one property for each parameter defined in the Config resource</li>
<li>Return value: None</li>
</ul>
Example:
<code>
let factor = 0;
function b_start(params)
{
    factor = params.factor;
}
</code>
</td>
</tr>
<tr>
<td>b_finish()</td>
<td>
Called when the client is going to finish.
<ul>
<li>Parameters: None</li>
<li>Return value: None</li>
</ul>
Example:
<code>
function b_finish()
{
    closeAudio();
}
</code>
</td>
</tr>
<tr>
<td>b_active()</td>
<td>
Called when the client state changes from inactive to active (Android and iOS).
<ul>
<li>Parameters: None</li>
<li>Return value: None</li>
</ul>
Example:
<code>
function b_active()
{
    myAction();
}
</code>
</td>
</tr>
<tr>
<td>b_inactive()</td>
<td>
Called when the client state changes from active to inactive (Android and iOS).
<ul>
<li>Parameters: None</li>
<li>Return value: None</li>
</ul>
Example:
<code>
function b_inactive()
{
    myAction();
}
</code>
</td>
</tr>
<tr>
<td>b_hotplug()</td>
<td>
Called when a hardware device has been plugged or unplugged.
<ul>
<li>Parameters: None</li>
<li>Return value: None</li>
</ul>
Example:
<code>
function b_hotplug()
{
    myAction();
}
</code>
</td>
</tr>
<tr>
<td>b_change(type)</td>
<td>
Called when the theme or the language has changed.
<ul>
<li>Parameter <code>type</code>: String - value can be either "theme" or "language"</li>
<li>Return value: None</li>
</ul>
Example:
<code>
function b_change(type)
{
    if (type === "theme")
        handleTheme();
    else if (type === "language")
       handleLang();
}
</code>
</td>
</tr>
</table>

## QML properties
These properties are available both for QML and Javascript code.
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
<td>
String value containing the operating system in use. The possible values are:
<ul>
  <li>windows</li>
  <li>linux</li>
  <li>macos</li>
  <li>android</li>
  <li>ios</li>
</ul>
</td>
</tr>
</table>

## Javascript functions

## Javascript properties

## Box API

