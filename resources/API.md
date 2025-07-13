<a name="top"></a>
# API REFERENCE

## Table of Contents
- [QML controls](#qml-controls)
- [QML callable functions](#qml-callable-functions)
- [QML overridable functions](#qml-overridable-functions)
- [QML properties](#qml-properties)
- [Javascript callable functions](#javascript-callable-functions)
- [Javascript overridable functions](#javascript-overridable-functions)
- [Javascript properties](#javascript-properties)
- [Core class names](#core-class-names)
- [Core object names](#core-object-names)
- [Theme properties](#theme-properties)
- [Box API](#box-api)
  - [Audio subsystem](#audio-subsystem)
  - [Video subsystem](#video-subsystem)
  - [Serial subsystem](#serial-subsystem)
  - [USB subsystem](#usb-subsystem)
  - [DSP subsystem](#dsp-subsystem)

## QML controls
These controls extend the functionality of the standard QtQuick controls to make them adjust to the theme selected in the core application. The purpose is to provide a consistent look and feel between the core application and the modules.  
All these controls add a new property called *name* which connects with the theme definitions. For instance, if a control is given `name: "mybutton"` and the theme definition file contains `mybutton.image = myicon.png`, then *mybutton* will show the icon *myicon*.  
The appearence of these controls is modified by the theme properties also listed here. For a description of the available theme properties, check the section [Theme properties](#theme-properties).
<table>
<thead>
<tr>
<th>Control</th>
<th>Description</th>
</tr>
</thead>
<tr>
<td>TButton</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-abstractbutton.html>AbstractButton</a><br><br>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Property <i><b>tooltiptext</b></i>: String - Text for tooltip box</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right border-width radius angle foreground-color border-color text-color text-weight image</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TCheck</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-abstractbutton.html>AbstractButton</a><br><br>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right border-width radius angle foreground-color border-color text-color text-weight image</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TColumn</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-column.html>Column</a><br><br>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right spacing</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TComboBox</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-combobox.html>ComboBox</a><br><br>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right border-width radius foreground-color border-color text-color</b></i></li>
<li>Subcomponent <i><b>.arrow</b></i>: Theme properties: <i><b>angle foregrouund-color image</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TGraph</td>
<td>
This is a native control, not inheriting any standard QML control. It provides a high quality graph panel for time and frequency series signals.<br>
When we refer to a color data type, it means a String value representing a color, either in <a href=https://doc.qt.io/archives/qt-6.7/qml-color.html#svg-color-reference>SVG color</a> or in #RRGGBB hexadecimal format.<br><br>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Property <i><b>data</b></i>: QByteArrayView containing an array of 32-bit floating point values. Check <a href=./API.md#box-api>Box API</a> for an explanation of this data type</li>
<li>Property <i><b>backgroundcolor</b></i>: Color - Color of the background panel</li>
<li>Property <i><b>signalcolor</b></i>: Color - Color of the curve representing the signal</li>
<li>Property <i><b>signalfillcolor1</b></i>: Color - When the signal graph is filled, this is the color of the upper part of the filling gradient</li>
<li>Property <i><b>signalfillcolor2</b></i>: Color - When the signal graph is filled, this is the color of the lower part of the filling gradient</li>
<li>Property <i><b>signalfillcolor3</b></i>: Color - When the signal graph is of type spectrogram, the colors used is a gradient between signalfillcolor1, signalfillcolor2 and signalfillcolor3</li>
<li>Property <i><b>filled</b></i>: Boolean - If true, the area below the signal is filled with a gradient composed by signalfillcolor1 and signalfillcolor2</li>
<li>Property <i><b>logarithmic</b></i>: Boolean - If true, the signal is represented in logarithmic scale</li>
<li>Property <i><b>spectrogram</b></i>: Boolean - If true, the signal is represented as spectrogram</li>
<li>Property <i><b>average</b></i>: Boolean - If true, the values represented are the average of the last 2 values. This avoids peaks in the signal</li>
<li>Property <i><b>logmax</b></i>: Real - Value in dB of the maximum value in logarithmic scale. Default is 0</li>
<li>Property <i><b>logmin</b></i>: Real - Value in dB of the minimum value in logarithmic scale. Default is 100, representing -100 dB</li>
<li>Property <i><b>delay</b></i>: Integer - Speed of the spectrogram waterfall. The waterfall will add one line every number of signal updates given by this value</li>
<li>Property <i><b>maintain</b></i>: Integer - Value between 0 and 9 defining the speed of the signal peaks to decay. The higher this value, the slower will be the decay</li>
<li>Theme properties: <i><b>background-color signal-color signalfillcolor1 signalfillcolor2 signalfillcolor3</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TGrid</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-grid.html>Grid</a><br><br>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right spacing</b></i></i></li>
</ul>
</td>
</tr>
<tr>
<td>TGroupBox</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-groupbox.html>GroupBox</a><br><br>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right border-width radius foreground-color border-color</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TKnob</td>
<td>
This is a native control, not inheriting any standard QML control. It provides a knob.<br><br>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Property <i><b>text</b></i>: String - Text to appear inside the knob</li>
<li>Property <i><b>textsize</b></i>: Real - Font size of the text</li>
<li>Property <i><b>max</b></i>: Real - Maximum value. Default is 1</li>
<li>Property <i><b>min</b></i>: Real - Minimum value. Default is 0</li>
<li>Property <i><b>step</b></i>: Real - Value increase or decrease for minimum rotation. Default is 0.1</li>
<li>Property <i><b>anglestep</b></i>: Real - Angle in degrees to rotate for minimum rotation. Default is 20</li>
<li>Property <i><b>rounddial</b></i>: Boolean - If true, the dial sign is a circle instead of a cursor line. Default is false</li>
<li>Property <i><b>angle</b></i>: Real - Current angle in degrees</li>
<li>Property <i><b>value</b></i>: Real - Current value</li>
<li>Property <i><b>pressed</b></i>: Boolean - True if the knob is pressed</li>
<li>Property <i><b>hovered</b></i>: Boolean - True if the knob is hovered</li>
<li>Property <i><b>fast</b></i>: Boolean - If true, it provides the functionality of changes values by clicking and moving the mouse to right and left</li>
<li>Property <i><b>tooltiptext</b></i>: String - Text of the tooltip box</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right border-width foreground-color border-color text-color</b></i></li>
<li>Subcomponent <i><b>.arrow</b></i>: Theme properties: <i><b>image</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TLabel</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-label.html>Label</a><br><br>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Property <i><b>pressed</b></i>: Boolean - True if the label is pressed</li>
<li>Theme properties: <i><b>padding padding-top padding-botton padding-left padding-right border-width radius angle foreground-color border-color text-color text-weight image</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TLineEdit</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-textfield.html>TextField</a><br><br>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>padding padding-top padding-botton padding-left padding-right border-width radius foreground-color border-color text-color</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TRow</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-row.html>Row</a><br><br>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right spacing</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TSlider</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-slider.html>Slider</a><br><br>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right radius foreground-color border-color</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TVideoFrame</td>
<td>
This is a native control, not inheriting any standard QML control. It provides a panel to show live video.<br><br>
<ul>
<li>Property <i><b>data</b></i>: QByteArrayView containing an image captured by the Video subsystem. Check <a href=./API.md#box-api>Box API</a> for an explanation of this data type</li>
<li>Property <i><b>mirror</b></i>: Boolean - If true, the image is shown upside down</li>
<li>Theme properties: None</li>
</ul>
</td>
</tr>
</table>

## QML callable functions
These functions can be called from your source code, both a QML action or a Javascript function.
<table>
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
<tr>
<td>b_getbox(type)</td>
<td>
Create a new Box object to interact with the C++ Box API.<br><br>
<ul>
<li>Parameter <i><b>type</b></i>: String - It can be either "REMOTE" or nothing. If "REMOTE" is provided, then the Box object will access the hardware at the server side</li>
<li>Return value: An object of type Box</li>
</ul>
Example: <code>let box = b_getbox();</code><br>
Example: <code>let box = b_getbox("REMOTE");</code>
</td>
</tr>
<tr>
<td>b_send(key,value)</td>
<td>
The usage differs depending on wether it is used in <i>Client</i> or <i>Config</i> resource:<br>
<i>Client</i>: Send data to the server side.<br>
<i>Config</i>: Add a parameter <i>key</i> with value <i>value</i> to the module configuration file.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: Any basic Javascript type</li>
<li>Return value: None</li>
</ul>
Example: <code>b_send("init");</code><br>
Example: <code>b_send("gain", "15");</code>
</td>
</tr>
<tr>
<td>b_sendbin(key,value)</td>
<td>
Send binary data to the server side.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: Binary - The binary type is a mirror of the Qt type QByteArrayView. Check in the <a href=./API.md#box-api>Box API</a> section for an explanation of this data type.</li>
<li>Return value: None</li>
</ul>
Example: <code>b_sendbin("audio", data);</code>
</td>
</tr>
<tr>
<td>b_setvar(key,value)</td>
<td>
Set a configuration parameter. The configuration parameters are used to save values that are permanent among several runs of the module.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String - Setting name</li>
<li>Parameter <i><b>value</b></i>: Any basic Javascript data type - Setting value</li>
<li>Return value: None</li>
</ul>
Example: <code>b_setvar("height", "100");</code>
</td>
</tr>
<tr>
<td>b_getvar(key,default)</td>
<td>
Get a configuration parameter. The configuration parameters are used to save values that are permanent among several runs of the module.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String - Setting name.</li>
<li>Parameter <i><b>default</b></i>: Any basic Javascript data type - Default value if the setting doesn't exist</li>
<li>Return value: String</li>
</ul>
Example: <code>let h = b_setvar("height", "100");</code>
</td>
</tr>
<tr>
<td>b_debug(value)</td>
<td>
Send a message to the log file and the console if any.<br><br>
<ul>
<li>Parameter <i><b>value</b></i>: Any native Javascript type</li>
<li>Return value: None</li>
</ul>
Example: <code>b_debug("height=" + h);</code>
</td>
</tr>
<tr>
<td>b_param(key)</td>
<td>
Retrieve a configuration parameter from the main configuration file of the application stored in the file config.set.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String</li>
<li>Return value: String</li>
</ul>
Example: <code>let theme = b_param("ui.theme");</code>
</td>
</tr>
<tr>
<td>b_import(name,file)</td>
<td>
Import a Javascript module of type .mjs.<br><br>
<ul>
<li>Parameter <i><b>name</b></i>: String - This value will be used to reference the primitives available in the imported module</li>
<li>Parameter <i><b>file</b></i>: String - File name of the module to be imported. This file must be added to the resource collection file</li>
<li>Return value: None</li>
</ul>
Example: <code>b_import("RTLSDR", "rtlsdr.mjs");</code>
</td>
</tr>
<tr>
<td>b_translate(text)</td>
<td>
Return the translation into the current language of the text (in English) provided.<br><br>
<ul>
<li>Parameter <i><b>text</b></i>: String - This value will be added to the corresponding language file to be manually translated before compilation</li>
<li>Return value: String</li>
</ul>
Example: <code>text: b_translate("Name:");</code>
</td>
</tr>
<tr>
<td>b_theme(type,name,var)</td>
<td>
Return the value of a parameter from the current theme. This could be a color, a size, etc. Usually, this function is not needed. It is used by the QML components included in the code.<br><br>
<ul>
<li>Parameter <i><b>type</b></i>: String - Control type</li>
<li>Parameter <i><b>name</b></i>: String - Control name</li>
<li>Parameter <i><b>var</b></i>: String - Theme parameter to be retrieved</li>
<li>Return value: String</li>
</ul>
Example: <code>color: b_theme("TButton", "mybutton", "foreground-color");</code>
</td>
</tr>
<tr>
<td>b_conn()</td>
<td>
Return the type of connection established between the client and the server. The possible values are:
<ul>
<li><i>SELF</i>: The client and the server are on the same computer</li>
<li><i>LOCAL</i>: The client and the server are on different computers on the same local network</li>
<li><i>DIRECT</i>: The client and the server are on different local networks but the client can access the server directly</li>
<li><i>CBACK</i>: The client and the server are on different local networks but the server can contact the client directly. The client has used a call-back method to contact the server</li>
<li><i>TCP</i>: The client and the server cannot communicate directly and the traffic if relayed by the <i><b>niliBOX</b></i> server</li>
<li><i>HTTP</i>: The client and the server cannot communicate and there is no possible TCP connection with the <i><b>niliBOX</b></i> server. The traffic is encapsulated in HTTP</li>
</ul>
Example: <code>let connection = b_conn();</code>
</td>
</tr>
<tr>
<td>b_mouse(type)</td>
<td>
Change the shape of the mouse cursor.<br><br>
<ul>
<li>Parameter <i><b>type</b></i>:  Qt::CursorShape type - This type is described <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-mousearea.html#cursorShape-prop>here</a></li>
<li>Return value: None</li>
</ul>
Example: <code>b_mouse(Qt.PointingHandCursor);</code>
</td>
</tr>
</table>

## QML overridable functions
These functions can be implemented in the Javascript code and will be called by the core application when needed.
<table>
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
<tr>
<td>b_start(params)</td>
<td>
Called when the client starts.<br><br>
<ul>
<li>Parameter <i><b>params</b></i>: Data structure - The object params contains one property for each parameter defined in the Config resource</li>
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
Called when the client is going to finish.<br><br>
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
<td>b_receive(key,value)</td>
<td>
Receive data from the server side.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: String</li>
<li>Return value: None</li>
</ul>
Example:
<code>
function b_receive(key, value)
{
    if (key === "device")
        setDevice(value);
}
</code>
</td>
</tr>
<tr>
<td>b_receivebin(key,value)</td>
<td>
Receive binary data from the server side.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: Binary - The binary type is a mirror of the Qt type QByteArrayView. Check in the <a href=./API.md#box-api>Box API</a> section for an explanation of this data type.</li>
<li>Return value: None</li>
</ul>
Example:
<code>
function b_receivebin(key, value)
{
    if (key === "audio")
        processAudio(value);
}
</code>
</td>
</tr>
<tr>
<td>b_active()</td>
<td>
Called when the client state changes from inactive to active (Android and iOS).<br><br>
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
Called when the client state changes from active to inactive (Android and iOS).<br><br>
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
Called when a hardware device has been plugged or unplugged.<br><br>
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
<li>Parameter <i><b>type</b></i>: String - value can be either "theme" or "language"</li>
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
<thead>
<tr>
<th>Property</th>
<th>Description</th>
</tr>
</thead>
<tr>
<td>b_unit</td>
<td>
Real value containing the size in pixels of a distance of approximately 1 cm in desktops and 8 mm in touch screens. This value is used as unit of measure in all sizes used in the application.<br>
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

## Javascript callable functions
These functions can be called from your source Javascript code.
<table>
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
<tr>
<td>b_getbox(type)</td>
<td>
Create a new Box object to interact with the C++ Box API.<br><br>
<ul>
<li>Parameter <i><b>type</b></i>: String - It can be either "REMOTE" or nothing. If "REMOTE" is provided, then the Box object will access the hardware at the server side</li>
<li>Return value: An object of type Box</li>
</ul>
Example: <code>let box = b_getbox();</code><br>
Example: <code>let box = b_getbox("REMOTE");</code>
</td>
</tr>
<tr>
<td>b_send(key,value)</td>
<td>
Send data to the client side.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: Any basic Javascript type</li>
<li>Return value: None</li>
</ul>
Example: <code>b_send("init");</code><br>
Example: <code>b_send("gain", "15");</code>
</td>
</tr>
<tr>
<td>b_sendbin(key,value)</td>
<td>
Send binary data to the client side.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: Binary - The binary type is a mirror of the Qt type QByteArrayView. Check in the <a href=./API.md#box-api>Box API</a> section for an explanation of this data type.</li>
<li>Return value: None</li>
</ul>
Example: <code>b_sendbin("audio", data);</code>
</td>
</tr>
<tr>
<td>b_setvar(key,value)</td>
<td>
Set a configuration parameter. The configuration parameters are used to save values that are permanent among several runs of the module.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String - Setting name.</li>
<li>Parameter <i><b>value</b></i>: Any basic Javascript data type - Setting value</li>
<li>Return value: None</li>
</ul>
Example: <code>b_setvar("height", "100");</code>
</td>
</tr>
<tr>
<td>b_getvar(key,default)</td>
<td>
Get a configuration parameter. The configuration parameters are used to save values that are permanent among several runs of the module.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String - Setting name.</li>
<li>Parameter <i><b>default</b></i>: Any basic Javascript data type - Default value if the setting doesn't exist</li>
<li>Return value: String</li>
</ul>
Example: <code>let h = b_setvar("height", "100");</code>
</td>
</tr>
<tr>
<td>b_debug(value)</td>
<td>
Send a message to the log file and the console if any.<br><br>
<ul>
<li>Parameter <i><b>value</b></i>: Any native Javascript type</li>
<li>Return value: None</li>
</ul>
Example: <code>b_debug("height=" + h);</code>
</td>
</tr>
<tr>
<td>b_param(key)</td>
<td>
Retrieve a configuration parameter from the main configuration file of the application stored in the file config.set.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String</li>
<li>Return value: String</li>
</ul>
Example: <code>let theme = b_param("ui.theme");</code>
</td>
</tr>
<tr>
<td>b_import(name,file)</td>
<td>
Import a Javascript module of type .mjs.<br><br>
<ul>
<li>Parameter <i><b>name</b></i>: String - This value will be used to reference the primitives available in the imported module</li>
<li>Parameter <i><b>file</b></i>: String - File name of the module to be imported. This file must be added to the resource collection file</li>
<li>Return value: None</li>
</ul>
Example: <code>b_import("RTLSDR", "rtlsdr.mjs");</code><br>
</td>
</tr>
</table>

## Javascript overridable functions
These functions can be implemented in the Javascript code and will be called by the core application when needed.
<table>
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
<tr>
<td>b_start(params)</td>
<td>
Called when the client starts.<br><br>
<ul>
<li>Parameter <i><b>params</b></i>: Data structure - The object params contains one property for each parameter defined in the <i>Config</i> resource</li>
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
Called when the client is going to finish.<br><br>
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
<td>b_receive(key,value)</td>
<td>
Receive data from the client side.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: String</li>
<li>Return value: None</li>
</ul>
Example:
<code>
function b_receive(key, value)
{
    if (key === "device")
        setDevice(value);
}
</code>
</td>
</tr>
<tr>
<td>b_receivebin(key,value)</td>
<td>
Receive binary data from the client side.<br><br>
<ul>
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: Binary - The binary type is a mirror of the Qt type QByteArrayView. Check in the <a href=./API.md#box-api>Box API</a> section for an explanation of this data type.</li>
<li>Return value: None</li>
</ul>
Example:
<code>
function b_receivebin(key, value)
{
    if (key === "audio")
        processAudio(value);
}
</code>
</td>
</tr>
<tr>
<td>b_hotplug()</td>
<td>
Called when a hardware device has been plugged or unplugged.<br><br>
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
</table>

## Javascript properties
These properties are available for the Javascript code.
<table>
<thead>
<tr>
<th>Properties</th>
<th>Description</th>
</tr>
</thead>
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

## Core class names
These C++ graphical classes inherit the class QWidget and extend the standard functionality to make them adjust to the theme selected. The purpose is to provide a consistent look and feel between the core application and the modules.  
When these classes are used in the core application to create a new object, they are always given a name. These names are fixed in the application (unless it is modified). The possible object names are listed in the next section [Core object names](#core-object-names). 
The appearence of these controls is modified by the theme properties also listed here. For a description of the available theme properties, check the section [Theme properties](#theme-properties).
<table>
<thead>
<tr>
<th>Class name</th>
<th>Description</th>
</tr>
</thead>
<tr>
<td>TbButton</td>
<td>
Blinds button. A button that can contain 2 subbuttons accessible sliding the main button to the left.<br><br>
<ul>
<li>Subtype: <i><b>TbButton.blind1</b></i> (type <i>TButton</i>)</li>
<li>Subtype: <i><b>TbButton.blind2</b></i> (type <i>TButton</i>)</li>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle text-color link-color text-weight text-align text-font</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TButton</td>
<td>
Standard button.<br><br>
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle text-color link-color text-weight text-align text-font</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TcFrame</td>
<td>
Collapsable frame. A frame with a title that can be expanded or collapsed clicking on the title.<br><br>
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle</li>
<li>Subtype: <i><b>TcFrame.header</b></i> (type <i>TButton</i>)</li>
<li>Subtype: <i><b>TcFrame.header.title</b></i> (type <i>TLabel</i>)</li>
<li>Subtype: <i><b>TcFrame.header.arrow</b></i> (type <i>TPane</i>)</li>
<li>Subtype: <i><b>TcFRame.body</b></i> (type <i>TPane</i>)</li>
</ul>
</td>
</tr>
<tr>
<td>TCheck</td>
<td>
Standard check box.<br><br>
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle text-color link-color text-weight text-align text-font</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TComboBox</td>
<td>
Standard combo box.<br><br>
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle text-color link-color text-weight text-align text-font</b></i></li>
<li>Subtype: <i><b>TComboBox.arrow</b></i> (type <i>TPane</i>)</li>
</ul>
</td>
</tr>
<tr>
<td>TFrame</td>
<td>
A basic panel with a border. Equivalent to TPane except the theme customization.<br><br>
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TLabel</td>
<td>
A basic label.<br><br>
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle text-color link-color text-weight text-align text-font</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TLineEdit</td>
<td>
A basic box to enter text.<br><br>
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TList</td>
<td>
A list of selectable items.<br><br>
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TPane</td><br><br>
<td>
The most basic object. A rectangular panel with a border.<br><br>
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TPopup</td>
<td>
A full screen modal window with a box to select options.<br><br>
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle</b></i></li>
<li>Subtype: <i><b>TPopup.box</b></i> (type <i>TPane</i>)</li>
<li>Subtype: <i><b>TPopup.text</b></i> (type <i>TLabel</i>)</li>
<li>Subtype: <i><b>TPopup.buttons</b></i> (type <i>TPane</i>)</li>
<li>Subtype: <i><b>TPopup.icon.info</b></i> (type <i>TPane</i>)</li>
<li>Subtype: <i><b>TPopup.icon.ques</b></i> (type <i>TPane</i>)</li>
<li>Subtype: <i><b>TPopup.icon.warn</b></i> (type <i>TPane</i>)</li>
<li>Subtype: <i><b>TPopup.icon.crit</b></i> (type <i>TPane</i>)</li>
</ul>
</td>
</tr>
<tr>
<td>TTextEdit</td>
<td>
A multiline entry field.<br><br>
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle</b></i></li>
</ul>
</td>
</tr>
</table>

## Core object names
These are the names of the graphical objects implemented in the core application. The purpose of listing them here is to allow the customization of their appearence via themes.

<table>
<thead>
<tr>
<th>Object name</th>
<th>Type</th>
</tr>
</thead>
<tr><td colspan=2><h3>Main window</h3></td></tr>
<tr><td>main</td><td>TPane</td></tr>
<tr><td>main.logo</td><td>TPane</td></tr>
<tr><td>main.loading</td><td>TLabel</td></tr>
<tr><td>left</td><td>TPane</td></tr>
<tr><td>left.buttons</td><td>TPane</td></tr>
<tr><td>left.options</td><td>TPane</td></tr>
<tr><td>left.options.devices</td><td>TButton</td></tr>
<tr><td>left.options.settings</td><td>TButton</td></tr>
<tr><td>left.options.info</td><td>TButton</td></tr>
<tr><td>slider</td><td>TPane</td></tr>
<tr><td>slider.button</td><td>TButton</td></tr>
<tr><td>slider.arrow</td><td>TButton</td></tr>
<tr><td>slider.pin</td><td>TButton</td></tr>
<tr><td colspan=2><h3>Devices window</h3></td></tr>
<tr><td>devices.header</td><td>TPane</td></tr>
<tr><td>devices.header.refresh</td><td>TButton</td></tr>
<tr><td>devices.header.close</td><td>TButton</td></tr>
<tr><td>devices.body</td><td>TPane</td></tr>
<tr><td>devices.body</td><td>TPane</td></tr>
<tr><td>devices.iconfavorites</td><td>TPane</td></tr>
<tr><td>devices.favorites</td><td>TFrame</td></tr>
<tr><td>devices.favorites.new</td><td>TcFrame</td></tr>
<tr><td>devices.favorites.new.container</td><td>TPane</td></tr>
<tr><td>devices.favorites.new.id.label</td><td>TLabel</td></tr>
<tr><td>devices.favorites.new.id.field</td><td>TLineEdit</td></tr>
<tr><td>devices.favorites.new.buttons</td><td>TPane</td></tr>
<tr><td>devices.favorites.new.info"</td><td>TButton</td></tr>
<tr><td>devices.favorites.new.accept</td><td>TButton</td></tr>
<tr><td>devices.favorites.new.cancel</td><td>TButton</td></tr>
<tr><td>devices.favorites.buttons</td><td>TPane</td></tr>
<tr><td>devices.body</td><td>TPane</td></tr>
<tr><td>devices.iconlocal</td><td>TPane</td></tr>
<tr><td>devices.local</td><td>TFrame</td></tr>
<tr><td>devices.local.filter</td><td>TcFrame</td></tr>
<tr><td>devices.local.filter.container</td><td>TPane</td></tr>
<tr><td>devices.local.filter.driver.label</td><td>TLabel</td></tr>
<tr><td>devices.local.filter.driver.field</td><td>TComboBox</td></tr>
<tr><td>devices.local.filter.family.label</td><td>TLabel</td></tr>
<tr><td>devices.local.filter.family.field</td><td>TComboBox</td></tr>
<tr><td>devices.local.filter.text.label</td><td>TLabel</td></tr>
<tr><td>devices.local.filter.text.field</td><td>TLineEdit</td></tr>
<tr><td>devices.local.buttons</td><td>TPane</td></tr>
<tr><td>devices.iconglobal</td><td>TButton</td></tr>
<tr><td>devices.global</td><td>TFrame</td></tr>
<tr><td>devices.global.filter</td><td>TcFrame</td></tr>
<tr><td>devices.global.filter.container</td><td>TPane</td></tr>
<tr><td>devices.global.filter.driver.label</td><td>TLabel</td></tr>
<tr><td>devices.global.filter.driver.field</td><td>TComboBox</td></tr>
<tr><td>devices.global.filter.family.label</td><td>TLabel</td></tr>
<tr><td>devices.global.filter.family.field</td><td>TComboBox</td></tr>
<tr><td>devices.global.filter.text.label</td><td>TLabel</td></tr>
<tr><td>devices.global.filter.text.field</td><td>TLineEdit</td></tr>
<tr><td>devices.global.buttons</td><td>TPane</td></tr>
<tr><td colspan=2><h3>Settings window</h3></td></tr>
<tr><td>settings.header</td><td>TPane</td></tr>
<tr><td>settings.header</td><td>TPane</td></tr>
<tr><td>settings.header.sitelist</td><td>TComboBox</td></tr>
<tr><td>settings.header.refresh</td><td>TButton</td></tr>
<tr><td>settings.header.save</td><td>TButton</td></tr>
<tr><td>settings.header.close</td><td>TButton</td></tr>
<tr><td>settings.body</td><td>TPane</td></tr>
<tr><td>settings.body.interface</td><td>TcFrame</td></tr>
<tr><td>settings.body.interface.container</td><td>TPane</td></tr>
<tr><td>settings.body.interface.language.label</td><td>TLabel</td></tr>
<tr><td>settings.body.interface.language.field</td><td>TComboBox</td></tr>
<tr><td>settings.body.interface.theme.label</td><td>TLabel</td></tr>
<tr><td>settings.body.interface.theme.field</td><td>TComboBox</td></tr>
<tr><td>settings.body.site</td><td>TcFrame</td></tr>
<tr><td>settings.body.site.container</td><td>TPane</td></tr>
<tr><td>settings.body.site.id.label</td><td>TLabel</td></tr>
<tr><td>settings.body.site.id.field</td><td>TLineEdit</td></tr>
<tr><td>settings.body.site.name.label</td><td>TLabel</td></tr>
<tr><td>settings.body.site.name.field</td><td>TLineEdit</td></tr>
<tr><td>settings.body.site.desc.label</td><td>TLabel</td></tr>
<tr><td>settings.body.site.desc.field</td><td>TTextEdit</td></tr>
<tr><td>settings.body.site.town.label</td><td>TLabel</td></tr>
<tr><td>settings.body.site.town.field</td><td>TLineEdit</td></tr>
<tr><td>settings.body.site.country.label</td><td>TLabel</td></tr>
<tr><td>settings.body.site.country.field</td><td>TLineEdit</td></tr>
<tr><td>settings.body.site.email.label</td><td>TLabel</td></tr>
<tr><td>settings.body.site.email.field</td><td>TLineEdit</td></tr>
<tr><td>settings.body.site.website.label</td><td>TLabel</td></tr>
<tr><td>settings.body.site.website.field</td><td>TLineEdit</td></tr>
<tr><td>settings.body.site.remote.label</td><td>TLabel</td></tr>
<tr><td>settings.body.site.remote.field</td><td>TComboBox</td></tr>
<tr><td>settings.body.site.upnp.label</td><td>TLabel</td></tr>
<tr><td>settings.body.site.upnp.field</td><td>TCheck</td></tr>
<tr><td>settings.body.site.nat.label</td><td>TLabel</td></tr>
<tr><td>settings.body.site.nat.field</td><td>TCheck</td></tr>
<tr><td>settings.body</td><td>TPane</td></tr>
<tr><td>settings.body.site.natport.label</td><td>TLabel</td></tr>
<tr><td>settings.body.site.natport.field</td><td>TLineEdit</td></tr>
<tr><td>settings.body.devices</td><td>TcFrame</td></tr>
<tr><td>settings.body.devices.container</td><td>TPane</td></tr>
<tr><td>settings.body.devices.new</td><td>TcFrame</td></tr>
<tr><td>settings.body.devices.new.container</td><td>TPane</td></tr>
<tr><td>settings.body.devices.new.family.label</td><td>TLabel</td></tr>
<tr><td>settings.body.devices.new.family.field</td><td>TComboBox</td></tr>
<tr><td>settings.body.devices.new.driver.label</td><td>TLabel</td></tr>
<tr><td>settings.body.devices.new.driver.field</td><td>TComboBox</td></tr>
<tr><td>settings.body.devices.new.version.label</td><td>TLabel</td></tr>
<tr><td>settings.body.devices.new.version.field</td><td>TLabel</td></tr>
<tr><td>settings.body.devices.new.author.label</td><td>TLabel</td></tr>
<tr><td>settings.body.devices.new.author.field</td><td>TLabel</td></tr>
<tr><td>settings.body.devices.new.desc.label</td><td>TLabel</td></tr>
<tr><td>settings.body.devices.new.desc.field</td><td>TLabel</td></tr>
<tr><td>settings.body.devices.new.buttons</td><td>TPane</td></tr>
<tr><td>settings.body.devices.new.accept</td><td>TButton</td></tr>
<tr><td>settings.body.devices.new.cancel</td><td>TButton</td></tr>
<tr><td>settings.body.security</td><td>TcFrame</td></tr>
<tr><td>settings.body.security.container</td><td>TPane</td></tr>
<tr><td>settings.body.security.groups</td><td>TFrame</td></tr>
<tr><td>settings.body.security.groups.label</td><td>TLabel</td></tr>
<tr><td>settings.body.security.groups.header</td><td>TPane</td></tr>
<tr><td>settings.body.security.groups.name</td><td>TLineEdit</td></tr>
<tr><td>settings.body.security.groups.add</td><td>TButton</td></tr>
<tr><td>settings.body.security.groups.delete</td><td>TButton</td></tr>
<tr><td>settings.body.security.groups.list</td><td>TList</td></tr>
<tr><td>settings.body.security.members</td><td>TFrame</td></tr>
<tr><td>settings.body.security.members.label</td><td>TLabel</td></tr>
<tr><td>settings.body.security.members.header</td><td>TPane</td></tr>
<tr><td>settings.body.security.members.name</td><td>TLineEdit</td></tr>
<tr><td>settings.body.security.members.add</td><td>TButton</td></tr>
<tr><td>settings.body.security.members.delete</td><td>TButton</td></tr>
<tr><td>settings.body.security.members.list</td><td>TList</td></tr>
<tr><td colspan=2><h3>Device configuration window</h3></td></tr>
<tr><td>deviceconf.container</td><td>TPane</td></tr>
<tr><td>deviceconf.container.header</td><td>TPane</td></tr>
<tr><td>deviceconf.container.header.delete</td><td>TButton</td></tr>
<tr><td>deviceconf.container.fields</td><td>TPane</td></tr>
<tr><td>deviceconf.container.fields.deviceid.label</td><td>TLabel</td></tr>
<tr><td>deviceconf.container.fields.deviceid.field</td><td>TLineEdit</td></tr>
<tr><td>deviceconf.container.fields.drivername.label</td><td>TLabel</td></tr>
<tr><td>deviceconf.container.fields.drivername.field</td><td>TLineEdit</td></tr>
<tr><td>deviceconf.container.fields.name.label</td><td>TLabel</td></tr>
<tr><td>deviceconf.container.fields.name.field</td><td>TLineEdit</td></tr>
<tr><td>deviceconf.container.fields.desc.label</td><td>TLabel</td></tr>
<tr><td>deviceconf.container.fields.desc.field</td><td>TTextEdit</td></tr>
<tr><td>deviceconf.container.fields.mode</td><td>TPane</td></tr>
<tr><td>deviceconf.container.fields.mode.label</td><td>TLabel</td></tr>
<tr><td>deviceconf.container.fields.mode.allowed</td><td>TButton</td></tr>
<tr><td>deviceconf.container.fields.mode.field</td><td>TComboBox</td></tr>
<tr><td>deviceconf.container.conf</td><td>TPane</td></tr>
<tr><td colspan=2><h3>Information window</h3></td></tr>
<tr><td>info.header</td><td>TPane</td></tr>
<tr><td>info.header.refresh</td><td>TButton</td></tr>
<tr><td>info.header.close</td><td>TButton</td></tr>
<tr><td>info.body</td><td>TPane</td></tr>
<tr><td>info.body.about</td><td>TcFrame</td></tr>
<tr><td>info.body.about.container</td><td>TPane</td></tr>
<tr><td>info.body.about.logo</td><td>TPane</td></tr>
<tr><td>info.body.about.version</td><td>TLabel</td></tr>
<tr><td>info.body.license</td><td>TcFrame</td></tr>
<tr><td>info.body.license.container</td><td>TPane</td></tr>
<tr><td>info.body.license.text</td><td>TLabel</td></tr>
<tr><td>info.body.debug</td><td>TcFrame</td></tr>
<tr><td>info.body.debug.container</td><td>TPane</td></tr>
<tr><td>info.body.debug.buttons</td><td>TPane</td></tr>
<tr><td>info.body.debug.buttons.copy</td><td>TButton</td></tr>
<tr><td>info.body.debug.buttons.verbose</td><td>TButton</td></tr>
<tr><td>info.body.debug.files</td><td>TComboBox</td></tr>
<tr><td>info.body.debug.log</td><td>TLabel</td></tr>
</table>


## Theme properties
This is the list of theme properties that can be used in the definition of themes for the core application and the drivers. You can check what properties apply to each graphical object in the sections [QML controls](#qml-controls) and [Core class names](#core-class-names).

The different type of values are the following:
- *Number*: A number representing a size in milimeters. In mobile devices, the total size is multipled by 0.8.
- *Number or round*: In the special case of raius of a border, it can be specificed by a *Number* or the word '*round'* to specify a complete rounded border.
- *Real number*: An absolute number. Used for angles.
- *String*: Used to specify a file location.
- *Color*: A String value representing a color, either in <a href=https://doc.qt.io/archives/qt-6.7/qml-color.html#svg-color-reference>SVG color</a> or in #RRGGBB hexadecimal format.
- *Alignment*: One of these values: *LEFT RIGHT HCENTER JUSTIFY TOP BOTTOM VCENTER CENTER BASELINE*
<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tr><td>angle</td><td>Real number</td><td>Angle of rotation in degrees of an image</td></tr>
<tr><td>background-color</td><td>Color</td><td>Background color</td></tr>
<tr><td>border-color</td><td>Color</td><td>Border color</td></tr>
<tr><td>border-width</td><td>Number</td><td>Border width. Default is 0 which represent no border</td></tr>
<tr><td>foreground-color</td><td>Color</td><td>Foreground color</td></tr>
<tr><td>image</td><td>String</td><td>File name of an image, including extension</td></tr>
<tr><td>link-color</td><td>Color</td><td>Color for the hyperlinks in a text</td></tr>
<tr><td>margin</td><td>Number</td><td>Distance between the border and the external limit of the object. Applies to the 4 sides</td></tr>
<tr><td>margin-bottom</td><td>Number</td><td>Bottom margin</td></tr>
<tr><td>margin-left</td><td>Number</td><td>Left margin</td></tr>
<tr><td>margin-right</td><td>Number</td><td>Right margin</td></tr>
<tr><td>margin-top</td><td>Number</td><td>Top margin</td></tr>
<tr><td>padding</td><td>Number</td><td>Distance between the border and the contents of the object. Applies to the 4 sides</td></tr>
<tr><td>padding-botton</td><td>Number</td><td>Bottom padding</td></tr>
<tr><td>padding-left</td><td>Number</td><td>Left padding</td></tr>
<tr><td>padding-right</td><td>Number</td><td>Right padding</td></tr>
<tr><td>padding-top</td><td>Number</td><td>Top padding</td></tr>
<tr><td>radius</td><td>Number or round</td><td>Radius of the corners of the object. Applies to the 4 corners</td></tr>
<tr><td>radius-bottomleft</td><td>Number or round</td><td>Bottom-left radius</td></tr>
<tr><td>radius-bottomright</td><td>Number or round</td><td>Bottom-right radius</td></tr>
<tr><td>radius-topleft</td><td>Number or round</td><td>Top-left radius</td></tr>
<tr><td>radius-topright</td><td>Number or round</td><td>Top-right radius</td></tr>
<tr><td>signal-color</td><td>Color</td><td>Color of the line representing the signal in a Graph object</td></tr>
<tr><td>signalfillcolor1</td><td>Color</td><td>Bottom color of the gradient used to fill a signal in a Graph object</td></tr>
<tr><td>signalfillcolor2</td><td>Color</td><td>Upper color of the gradient used to fill a signal in a Graph object</td></tr>
<tr><td>signalfillcolor3</td><td>Color</td><td>Third color in the gradient used to represent a signal in spectrogram mode in a Graph object</td></tr>
<tr><td>spacing</td><td>Number</td><td>Spacing between objects in a row, column or grid</td></tr>
<tr><td>text-align</td><td>Alignment</td><td>Alignment of the text inside an object. By default, the text is centered</td></tr>
<tr><td>text-color</td><td>Color</td><td>Color of the text</td></tr>
<tr><td>text-font</td><td>Number</td><td>Factor applied to the standard font size. By default, it is 1.0</td></tr>
<tr><td>text-weight</td><td>BOLD</td><td>Weight of the text font. Only accepts the value BOLD. If not specified, then it is normal weight</td></tr>
</table>

## Box API
The ***BOX API*** is a set of functions, constants and signals that can be invoked from QML or Javascript code. This API implements the most common functionalities to handle hardware and signal processing. These functions are implemented in the C++ core application and are usually much more efficient than implementing the same functionalities directly in Javascript. The API is divided in subsystems.

All these functions, constants and signals are decribed below for each subsystem. The syntax used to describe each one is the exact definition in C++. To be used from QML and Javascript, the C++ types are converted to Javascript types. This is a list of the different types used in C++ and how they can be used from Javascript:

<table>
<thead>
<tr>
<th>C++</th>
<th>Javascript</th>
</tr>
</thead>
<tr><td>int</td><td>Integer (Number)</td></tr>
<tr><td>float</td><td>Real (Number)</td></tr>
<tr><td>bool</td><td>Boolean</td></tr>
<tr><td>QString</td><td>String</td></tr>
<tr><td>QList</td><td>List</td></tr>
<tr><td>QByteArrayView</td><td>Binary</td></tr>
</table>

The *Binary* Javascript type is an opaque type used to represent an array of bytes. This type is not a Javascript *Array buffer* but a reference to an array of bytes in the C++ context. The ***Box API*** provides functions to convert this type to an actual *Array buffer* and also to make some basic handling. The reason to use this opaque type instead of a standard *Array buffer* is to minimize the transfer of data between the C++ and Javascript contexts.

The signals are events generated from the C++ core application that must be handled by the Javascript environment. It is necessary to connect the signal to an event handler function. This is an example of how to connect a function handler to the event triggered when an input audio device has collected enough data:
```
let box;
let audiodeviceid;

function b_start(params)
{
    box = b_getbox();
    box.audioDevice_Data.connect(audioDeviceData); //<== This is where the signal is connected to an event handler

    let audiodevice = box.audioDevice_defaultInput();
    audiodeviceid = box.audioDevice_open(audiodevice, "32000,32,0");
}

function audioDeviceData(devid, data) //<== The event handler
{
    if (devid !== audiodeviceid)
        return;

    ... handle audio data ...
}

```

Some functions use parameters of special types defined in the ***Box API*** as C++ enums. The different values defined by these enums can be used from Javascript as constants provided by the Box API. For instance, to use a value from the enum for FFT window types, the enum is defined like this:
```
enum FFTWindow {
    FFTW_NONE,
    FFTW_HANN,
    FFTW_HAMMING,
    FFTW_BLACKMAN,
    FFTW_BLACKMAN_HARRIS_4,
    FFTW_BLACKMAN_HARRIS_7
};
```
Then, from Javascript, you can use any of these values with the prefix *"Box."*. For instance: *Box.FFTW_HAMMING*.

Subsystems:
- [Audio subsystem](#audio-subsystem)
- [Video subsystem](#video-subsystem)
- [Serial subsystem](#serial-subsystem)
- [USB subsystem](#usb-subsystem)
- [DSP subsystem](#dsp-subsystem)

### Audio subsystem
The *Audio* subsystem handles the audio devices.
Every audio device can be identified in 3 different ways:
- *Device name*: A string that identifies an audio device available in the system
- *Device id*: An integer identifying an audio device that has been opened and can be used for input/output operations
- *Description*: A string providing a readable name for the audio device

When an audio device is open, a parameter <i>mode</i> must be provided. The <i>mode</i> is composed by a list of values separated by commas in the format *"samplerate,samplingbits,compressedbits"*. This is the meaning of each value:
- *samplerate*: Integer - Audio rate in samples per second. The standard values are 8000, 11020, 16000, 22040, 32000, 44080 and 48000
- *samplingbits*: Integer - Number of bits per sample. It can be 8 (unsigned), 16 (signed) or 32 (float)
- *compressedbits*: Integer - The audio can be open in compressed mode. In this case, the audio will be compressed before sending it from server to client and viceversa and uncompressed at destination. The possible values are 8 and 16 bits

An audio device can be a physical device but also a virtual input audio device. The vitual input devices are created when a module has audio output capabilities. In this way, the output of a module can be used as input for anoher module.

<table><tr></tr>
<tr><td><b>void audioDevice_close(const int devid)</b></td></tr>
<tr><td>
Close an audio device.<br><br>
<ul>
<li>Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device obtained when it was opened.</li>
<li>Return value: None</li>
</td></tr>
<tr><td><b>QString audioDevice_defaultInput()</b></td></tr>
<tr><td>
Retrieve the device name of the default audio input device.<br><br>
Parameter: None<br>
Return value: String - Device name of the default input audio device
</td></tr>
<tr><td><b>QString audioDevice_defaultOutput()</b></td></tr>
<tr><td>
Retrieve the device name of the default audio output device.<br><br>
Parameter: None<br>
Return value: String - Device name of the default output audio device
</td></tr>
<tr><td><b>QString audioDevice_description(const QString &devname)</b></td></tr>
<tr><td>
Retrieve the readable description of an audio device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the audio device<br>
Return value: String - Readable description of the audio device
</td></tr>
<tr><td><b>bool audioDevice_isOpen()</b></td></tr>
<tr><td>
Return wether there is any audio device open.<br><br>
Parameter: None<br>
Return value: Boolean - True if there is any audio device open, false otherwise
</td></tr>
<tr><td><b>bool audioDevice_isOpen(const QString &devname)</b></td></tr>
<tr><td>
Return wether a specific audio device is open.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the audio device<br>
Return value: Boolean - True if the audio device is open, false otherwise
</td></tr>
<tr><td><b>QList&lt;QString&gt; audioDevice_list(const QString &mode = "ALL", bool raw = false)</b></td></tr>
<tr><td>
Return a list of device names of the available audio devices.<br><br>
Parameter: <i><b>mode</b></i>: String - Can take 3 different values:
<ul>
<li><i>"ALL"</i> (default): Returns all audio devices, input and output</li>
<li><i>"INPUT"</i> (default): Returns a list of input audio devices</li>
<li><i>"OUTPUT"</i> (default): Returns a list of output audio devices</li>
</ul>
Parameter: <i><b>raw</b></i>: Boolean - If true, it will not include the virtual audio devices<br>
Return value: List - A list of String containing the device names of the requested audio devices
</td></tr>
<tr><td><b>QString audioDevice_mode(const QString &devname)</b></td></tr>
<tr><td>
Return the audio mode used to open a specific audio device by its device name. If the device is not open, then returns an empty String.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the audio device<br>
Return value: String - Audio mode of the device. It is composed by a list of values separated by commas in the format <i>"samplerate,samplingbits,compressedbits"</i>
</td></tr>
<tr><td><b>void audioDevice_mute(const int devid, const bool mute)</b></td></tr>
<tr><td>
Mute an output audio device that is open.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device<br>
Return value: None
</td></tr>
<tr><td><b>int audioDevice_open(const QString &devname, const QString &mode, const bool direct = false)</b></td></tr>
<tr><td>
Open an audio device and returns a new audio device id.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the audio device<br>
Parameter: <i><b>mode</b></i>: String - Audio mode to be used to open. It is composed by a list of values separated by commas in the format <i>"samplerate,samplingbits,compressedbits"</i><br>
Parameter: <i><b>direct</b></i>: Boolean - If true, the audio device will be open in <i>direct</i> mode: low latency, no buffering, no virtual input device created<br>
Return value: Integer - Device id for the audio device. If the audio device could not be open, this value is -1<br>
</td></tr>
<tr><td><b>audioDevice_recordPause(const int devid, const bool pause)</b></td></tr>
<tr><td>
Pause or resumes the process to record the output audio to a file.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device<br>
Parameter: <i><b>pause</b></i>: Boolean - If true, then pauses recording. If false, resumes recording<br>
Return value: None
</td></tr>
<tr><td><b>audioDevice_recordStart(const int devid, const QString filename, const int rawsamplerate = 0)</b></td></tr>
<tr><td>
Start the process to record the output audio to a file. Opens and initializes the output file.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device<br>
Parameter: <i><b>filename</b></i>: String - Name of the output file. The extension must be provided. The format of the file is a WAV<br>
Parameter: <i><b>rawsamplerate</b></i>: Integer - If this value is zero, then the output file will be an mono audio file at the sample rate that the audio device was open. If this value is greater than zero, then the data to be written will be assumed to be a I/Q data stream written in stereo at the sample rate specified. This second format is used to gerenetae raw I/Q files from SDR receivers<br>
Return value: None
</td></tr>
<tr><td><b>audioDevice_recordStop(const int devid)</b></td></tr>
<tr><td>
Finalize the recording process. Closes the output file.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device<br>
Return value: None
</td></tr>
<tr><td><b>audioDevice_recordWrite(const int devid, QByteArrayView data)</b></td></tr>
<tr><td>
Write data to the output file.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device<br>
Parameter: <i><b>data</b></i>: Binary - Data to be written<br>
Return value: None
</td></tr>
<tr><td><b>audioDevice_reset(const int devid)</b></td></tr>
<tr><td>
Reset the audio device. Reinitializes the underlaying hardware and clear all buffers.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device<br>
Return value: None
</td></tr>
<tr><td><b>audioDevice_setBusy(const int devid, const bool busy)</b></td></tr>
<tr><td>
Set or undets the device to busy state. If state is busy, no read or write will be performed until it is unset. Used for data contention.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device<br>
Parameter: <i><b>busy</b></i>: Boolean - Specifies if the audio device must be set or unset to busy state.<br>
Return value: None
</td></tr>
<tr><td><b>audioDevice_setVolume(const int devid, const float volume)</b></td></tr>
<tr><td>
Set the hardware input or output gain for the device.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device<br>
Parameter: <i><b>volume</b></i>: Real - Value for the volume, between 0.0 and 1.0<br>
Return value: None
</td></tr>
<tr><td><b>audioDevice_write(const int devid, QByteArrayView data)</b></td></tr>
<tr><td>
Write audio to an output audio device.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device<br>
Parameter: <i><b>data</b></i>: Binary - Data in the standard format of 32-bit float values<br>
Return value: None
</td></tr>
<tr><td><b>SIGNAL - audioDevice_Data(const int devid, QByteArrayView data)</b></td></tr>
<tr><td>
Triggered when there is data available from an input audio device.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device<br>
Parameter: <i><b>data</b></i>: Binary - Data in the standard format of 32-bit float values<br>
</td></tr>
<tr><td><b>SIGNAL - audioDevice_Error(const int devid, const QString &error)</b></td></tr>
<tr><td>
Triggered when an error accurred in the audio device.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device<br>
Parameter: <i><b>error</b></i>: String - Description of the error<br>
</td></tr>
<tr><td><b>SIGNAL - audioDevice_Processing(const int devid, QByteArrayView data)</b></td></tr>
<tr><td>
Triggered when a audio data chunk has been written to the audio device.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device<br>
Parameter: <i><b>data</b></i>: Binary - Audio data in the format used to open the audio device<br>
</td></tr>
<tr><td><b>SIGNAL - audioDevice_RecordSize(const int devid, const qint64 size)</b</td></tr>
<tr><td>
Triggered while audio is recorded to update the current output file size.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the audio device<br>
Parameter: <i><b>size</b></i>: Integer - Current output audio file<br>
</td></tr>
</table>

### Video subsystem
The *Video* subsystem handles the video input devices. There is no equivalent for output video devices.
Every video device can be identified in 3 different ways:
- *Device name*: A string that identifies a video device available in the system
- *Device id*: An integer identifying a video device that has been open and can be used for input operations
- *Description*: A string providing a readable name for the video device

When an video device is open, a parameter <i>mode</i> must be provided. The <i>mode</i> is composed by a list of values separated by commas in the format *"resolution,framerate"*. This is the meaning of each value:
- *resolution*: String - Size of the video frame in the format *widthxheight*. The symbol *x* must be included
- *framerate*: Integer - Number of frames per second

<table><tr></tr>
<tr><td><b>void videoDevice_close(const int devid)</b></td></tr>
<tr><td>
Close a video device.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the video device obtained when it was opened.<br>
Return value: None
</td></tr>
<tr><td><b>QString videoDevice_default()</b></td></tr>
<tr><td>
Retrieve the device name of the default video device.<br><br>
Parameter: None<br>
Return value: String - Device name of the default video device
</td></tr>
<tr><td><b>QString videoDevice_description(const QString &devname)</b></td></tr>
<tr><td>
Retrieve the readable description of a video device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the video device<br>
Return value: String - Readable description of the video device
</td></tr>
<tr><td><b>QList&lt;int&gt; videoDevice_frameRates(const QString &devname)</b></td></tr>
<tr><td>
Retrieve a list of supported frame rates of a video device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the video device<br>
Return value: List - A list of Integer containing all the frame rates supported by the video device in frames per second
</td></tr>
<tr><td><b>bool videoDevice_isOpen()</b></td></tr>
<tr><td>
Return wether there is any video device open.<br><br>
Parameter: None<br>
Return value: Boolean - True if there is any video device open, false otherwise
</td></tr>
<tr><td><b>bool videoDevice_isOpen(const QString &devname)</b></td></tr>
<tr><td>
Return wether a specific video device is open.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the video device<br>
Return value: Boolean - True if the video device is open, false otherwise
</td></tr>
<tr><td><b>QList&lt;QString&gt; videoDevice_list()</b></td></tr>
<tr><td>
Return a list of device names of the available video devices.<br><br>
Parameter: None
Return value: List - A list of String containing the device names of the available video devices
</td></tr>
<tr><td><b>int videoDevice_open(const QString &devname, const QString &mode)</b></td></tr>
<tr><td>
Open an video device and returns a new video device id.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the video device<br>
Parameter: <i><b>mode</b></i>: String - Audio mode to be used to open. It is composed by a list of values separated by commas in the format <i>"widthxheight,framerate"</i><br>
Return value: Integer - Device id for the video device. If the video device could not be open, this value is -1<br>
</td></tr>
<tr><td><b>int videoDevice_orientation(const QString &devname)</b></td></tr>
<tr><td>
Return the current orientation of the video device. Applies to cameras only.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the video device<br>
Return value: String - Current orientation. The possible values are <i>LANDSCAPE</i> and <i>PORTRAIT</i><br>
</td></tr>
<tr><td><b>int videoDevice_position(const QString &devname)</b></td></tr>
<tr><td>
Return the position of the video device (camera) in the device (mobile devices).<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the video device<br>
Return value: String - Camera position. The possible values are <i>FRONT</i> and <i>BACK</i><br>
</td></tr>
<tr><td><b>QList&lt;QString&gt; videoDevice_resolutions(const QString &devname)</b></td></tr>
<tr><td>
Retrieve a list of supported resolutions of a video device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the video device<br>
Return value: List - A list of String containing all the resolutions supported by the video device in the format <i>widthxheight</i>
</td></tr>
<tr><td><b>void videoDevice_setQuality(const int devid, const int quality)</b></td></tr>
<tr><td>
Set the quality of the video after the device has been opened.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the video device<br>
Parameter: <i><b>quality</b></i>: Integer - Quality factor. Value between 0 (lowest quality) and 100 (highest uncompressed quality)<br>
Return value: None
</td></tr>
<tr><td><b>QByteArrayView videoDevice_takeShot(const int devid)</b></td></tr>
<tr><td>
Take a screenshot from the video input and returns it as a binary value.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the video device<br>
Return value: Binary value containing the image in JPEG format
</td></tr>
<tr><td><b>SIGNAL - videoDevice_Data(const int devid, QByteArrayView data)</b></td></tr>
<tr><td>
Triggered when there is data available from a video device.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the video device<br>
Parameter: <i><b>data</b></i>: Binary - Data in the JPEG format with the width and height specified when the video device was opened<br>
</td></tr>
<tr><td><b>SIGNAL - videoDevice_Error(const int devid, const QString &error)</b></td></tr>
<tr><td>
Triggered when an error accurred in the video device.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the video device<br>
Parameter: <i><b>error</b></i>: String - Description of the error<br>
</td></tr>
</table>

### Serial subsystem
The *Serial* subsystem handles the serial port devices.
Every serial port can be identified in 3 different ways:
- *Device name*: A string that identifies a serial port device available in the system
- *Device id*: An integer identifying a serial port that has been open and can be used for input/output operations
- *Description*: A string providing a readable name for the serial port device

When an serial port device is open, a parameter <i>mode</i> must be provided. The <i>mode</i> is composed by a list of values separated by commas in the format *"baudrate,parity,databits,stopbits,flowcontrol"*. This is the meaning of each value:
- *baudrate*: Integer - Baud rate
- *parity*: String - Any value among *N*, *E*, *O*, *S*, *M* for *None*, *Even*, *Odd*, *Space*, *Mark*
- *databits*: Integer - Any value among *8*, *7*, *6*, *5*
- *stopbits*: Real - Any value among *1*, *1.5*, *2*
- *flowcontrol*: String - Any value among *NO*, *HW*, *SW* for *None*, *Hardware*, *Software*

<table><tr></tr>
<tr><td><b>void serialPort_close(const int devid)</b></td></tr>
<tr><td>
Close a serial port device.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the serial port device obtained when it was opened.<br>
Return value: None
</td></tr>
<tr><td><b>QString serialPort_description(const QString &devname)</b></td></tr>
<tr><td>
Retrieve the readable description of a serial port device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the serial port device<br>
Return value: String - Readable description of the serial device
</td></tr>
<tr><td><b>int serialPort_DTR(const int devid, const int newDTR = -1)</b></td></tr>
<tr><td>
Retrieve and optionally sets the DTR signal for the serial port.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the serial port device<br>
Parameter: <i><b>newDTR</b></i>: Integer - New DTR (0 or 1). If this parameter is not provided, then no action is taken<br>
Return value: Integer - Current value for DTR (0 or 1). If a new DTR value is provided, the current value is read after the value is set
</td></tr>
<tr><td><b>bool serialPort_isOpen(const QString &devname)</b></td></tr>
<tr><td>
Return wether a specific serial port device is open.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the serial port device<br>
Return value: Boolean - True if the serial port device is open, false otherwise
</td></tr>
<tr><td><b>QString serialPort_manufacturer(const QString &devname)</b></td></tr>
<tr><td>
Return the manufacturer of the serial port device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the serial port device<br>
Return value: String - Name of the manufacturer of the serial port device. Blank if not available
</td></tr>
<tr><td><b>int serialPort_open(const QString &devname, const QString &mode)</b></td></tr>
<tr><td>
Open a serial port device and returns a new serial port device id.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the serial port device<br>
Parameter: <i><b>mode</b></i>: String - Port mode to be used to open. It is composed by a list of values separated by commas in the format <i>"baudrate,parity,databits,stopbits,flowcontrol"</i><br>
Return value: Integer - Device id for the serial port device. If the serial port device could not be open, this value is -1<br>
</td></tr>
<tr><td><b>int serialPort_RTS(const int devid, const int newRTS = -1)</b></td></tr>
<tr><td>
Retrieve and optionally sets the RTS signal for the serial port.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the serial port device<br>
Parameter: <i><b>newRTS</b></i>: Integer - New RTS (0 or 1). If this parameter is not provided, then no action is taken<br>
Return value: Integer - Current value for RTS (0 or 1). If a new RTS value is provided, the current value is read after the value is set
</td></tr>
<tr><td><b>QString serialPort_serialNumber(const QString &devname)</b></td></tr>
<tr><td>
Return the serial number of the serial port device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the serial port device<br>
Return value: String - Serial number of the serial port device. Blank if not available
</td></tr>
<tr><td><b>QString serialPort_systemLocation(const QString &devname)</b></td></tr>
<tr><td>
Return the system location of the serial port device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the serial port device<br>
Return value: String - System location of the serial port device. Blank if not available
</td></tr>
<tr><td><b>serialPort_write(const int devid, QByteArray data)</b></td></tr>
<tr><td>
Write data to a serial port device.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the serial port device<br>
Parameter: <i><b>data</b></i>: String - Data to be written<br>
Return value: None
</td></tr>
<tr><td><b>SIGNAL - serialPort_Data(const int devid, QByteArray data)</b></td></tr>
<tr><td>
Triggered when there is data available from a serial port device.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the serial port device<br>
Parameter: <i><b>data</b></i>: String - Data received<br>
</td></tr>
<tr><td><b>SIGNAL - serialPort_Error(const int devid)</b></td></tr>
<tr><td>
Triggered when an error accurred in the serial port device.<br><br>
Parameter: <i><b>devid</b></i>: Integer - Device id of the serial port device<br>
</td></tr>
</table>

### USB subsystem
The *USB* subsystem handles the USB devices.

This subsystem provides two type of functions:
- Functions with name starting by *USB_*: These functions provide a wrapper to the *lbusb* API. It is assumed that you are familiar with this API. For a reference to the *libusb* API, please consult it [here](https://libusb.sourceforge.io/api-1.0/libusb_api.html)
- Functions with name starting by *USBDevice_*: These functions provide a simple high level interface to the USB devices.

Every USB device can be identified in 3 different ways:
- *Device id (usbdeviceid)*: A unique identifier for the USB device based on the position in the system. This identifier may change if the USB device is plugged to a different USB port. This identifier is linked to a structure of type *libusb_device*
- *Handle id (usbhandleid)*: An integer identifying a USB device that has been open and can be used for input/output operations. This identifier is linked to a structure of type *libusb_device_handle*
- *Device name*: A string providing a readable identifier for the USB device. It has a strcuture like *VVVV:PPPP* where *VVVV* is the vendor id in hexadecimal format and *PPPP* is the product id in hexadecimal format. If there are more than one device of the same type, the device name will also contain a sufix with a unique identifier for the device like *VVVV:PPPP:N* where *N* is an integer starting by 0.

<table><tr></tr>
<tr><td><b>ENUM: USBMode</b></td></tr>
<tr><td>
USB_BulkSync<br>
USB_BulkAsync<br>
USB_Isochronous<br>
</td></tr>
<tr><td><b>ENUM: USBDescriptor</b></td></tr>
<tr><td>
USB_bLength<br>
USB_bDescriptorType<br>
USB_bcdUSB<br>
USB_bDeviceClass<br>
USB_bDeviceSubClass<br>
USB_bDeviceProtocol<br>
USB_bMaxPacketSize0<br>
USB_idVendor<br>
USB_idProduct<br>
USB_bcdDevice<br>
USB_iManufacturer<br>
USB_iProduct<br>
USB_iSerialNumber<br>
USB_bNumConfigurations
</td></tr>
<tr><td><b>int USB_attach_kernel_driver(const int usbhandleid, const int interface)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__dev.html#gadeba36e900db663c0b7cf1b164a20d02>libusb_attach_kernel_driver()</a>. Re-attach an interface's kernel driver, which was previously detached using USB_detach_kernel_driver(). This functionality is not available on Windows.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened.<br>
Parameter: <i><b>interface</b></i>: Integer - USB interface to be attached.<br>
Return value: Integer - 0 on success. Error code otherwise
</td></tr>
<tr><td><b>int USB_bulk_transfer(const int usbhandleid, const int endpoint, const QByteArray &data, const int len, const int timeout)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__syncio.html#ga2f90957ccc1285475ae96ad2ceb1f58c>libusb_bulk_transfer()</a>. Perform a USB write bulk transfer. The direction of the transfer is inferred from the direction bits of the endpoint address.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Parameter: <i><b>endpoint</b></i>: Integer - The address of a valid endpoint to communicate with<br>
Parameter: <i><b>data</b></i>: String - Buffer to send or receive data<br>
Parameter: <i><b>len</b></i>: Integer - Maximum size of the data to be transferred<br>
Parameter: <i><b>timeout</b></i>: Integer - Time in miliseconds to wait for the operation to complete. For an unlimited timeout, use 0<br>
Return value: Integer - 0 on success. Error code otherwise
</td></tr>
<tr><td><b>void USB_bulk_transfer_setBufLen(const int usbhandleid, const int buflen)</b></td></tr>
<tr><td>
Set the buffer length for an asynchronous bulk transfer managed by <i>USB_bulk_transfer_start</i> and <i>USB_bulk_transfer_stop</i>. This function can be called before or after the bulk transfer has been started<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Parameter: <i><b>buflen</b></i>: Integer - Buffer length<br>
Return value: None
</td></tr>
<tr><td><b>void USB_bulk_transfer_start(const int usbhandleid, const int endpoint, const Box::USBMode mode = USB_BulkSync, const int size = 65536)</b></td></tr>
<tr><td>
Start an asynchronous read bulk transfer. The transfer method can be <i>Synchronous</i>, <i>Asynchronous</i> or <i>Isochronous</i>.<br>
When enough data has been received, it emits the signal <i>USB_Data</i><br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Parameter: <i><b>endpoint</b></i>: Integer - The address of a valid endpoint to communicate with<br>
Parameter: <i><b>mode</b></i>: USBMode - Any of <i>Box.USB_BulkSync</i>, <i>Box.USB_BulkAsync</i> or <i>USB_Isochronous</i><br>
Parameter: <i><b>size</b></i>: Integer - Chunk size of data to be transferred<br>
Return value: None
</td></tr>
<tr><td><b>void USB_bulk_transfer_stop(const int usbhandleid)</b></td></tr>
<tr><td>
Stop an asynchronous read bulk transfer.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Return value: None
</td></tr>
<tr><td><b>int USB_claim_interface(const int usbhandleid, const int interface)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__dev.html#gaee5076addf5de77c7962138397fd5b1a>libusb_claim_interface()</a>. Claim an interface on a given device handle.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Parameter: <i><b>interface</b></i>: Integer - USB interface to be claimed<br>
Return value: Integer - 0 on success. Error code otherwise
</td></tr>
<tr><td><b>int USB_close(const int usbhandleid)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__dev.html#ga779bc4f1316bdb0ac383bddbd538620e>libusb_close()</a>. Close a USB device.<br>
If the USB device was opened passing an interface number, then the interface is released and attached to the kernel.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Return value: Integer - 0 on success. Error code otherwise
</td></tr>
<tr><td><b>QByteArray USB_control_transfer(const int usbhandleid, const int type, const int request, const int value, const int index, const QByteArray &data, const int len, const int timeout)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__syncio.html#ga2f90957ccc1285475ae96ad2ceb1f58c>libusb_control_transfer()</a>. Perform a USB read/write control transfer. The direction of the transfer is inferred from the type field of the setup packet.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Parameter: <i><b>type</b></i>: Integer - The request type field for the setup packet<br>
Parameter: <i><b>request</b></i>: Integer - The request field for the setup packet<br>
Parameter: <i><b>value</b></i>: Integer - The value field for the setup packet<br>
Parameter: <i><b>index</b></i>: Integer - The index field for the setup packet<br>
Parameter: <i><b>data</b></i>: String - Buffer to receive data<br>
Parameter: <i><b>len</b></i>: Integer - Maximum size of the data to be transferred<br>
Parameter: <i><b>timeout</b></i>: Integer - Time in miliseconds to wait for the operation to complete. For an unlimited timeout, use 0<br>
Return value: Integer - 0 on success. Error code otherwise
</td></tr>
<tr><td><b>int USB_detach_kernel_driver(const int usbhandleid, const int interface)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__dev.html#ga5e0cc1d666097e915748593effdc634a>libusb_detach_kernel_driver()</a>. Detach a kernel driver from an interface.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Parameter: <i><b>interface</b></i>: Integer - USB interface to be detached<br>
Return value: Integer - 0 on success. Error code otherwise
</td></tr>
<tr><td><b>int USB_get_device(const int usbhandleid)</b></td></tr>
<tr><td>
Returns the USB device id corresponding to the USB handle id provided.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened.<br>
Return value: Integer - USB device id. Returns -1 on error
</td></tr>
<tr><td><b>QList&lt;int&gt; USB_get_device_descriptor(const int usbdeviceid)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__desc.html#ga5e9ab08d490a7704cf3a9b0439f16f00>libusb_get_device_descriptor()</a>. Returns a list of integers containing all the fields of the USB device descriptor of the USB device provided. The order of the fields in the list is given in the description of the enum USBDescriptor.<br><br>
Parameter: <i><b>usbdeviceid</b></i>: Integer - Device id of the USB device<br>
Return value: List - List of 14 integer values
</td></tr>
<tr><td><b>QList&lt;int&gt; USB_get_device_list()</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__dev.html#gac0fe4b65914c5ed036e6cbec61cb0b97>libusb_get_device_list()</a>. Returns a list of USB device id corresponding to all the USB devices present in the system. The order is guaranteed to be always ther same.<br><br>
Return value: List - List of integers
</td></tr>
<tr><td><b>QString USB_get_string_descriptor_ascii(const int usbhandleid, const int index)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__desc.html#ga240aac96d92cb9f51e3aea79a4adbf42>libusb_get_string_descriptor_ascii()</a>. Detach a kernel driver from an interface.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Parameter: <i><b>index</b></i>: Integer - The index of the descriptor to retrieved<br>
Return value: String - Descriptor for the specified index. Blank if error or not found
</td></tr>
<tr><td><b>int USB_kernel_driver_active(const int usbhandleid, const int interface)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__dev.html#ga1cabd4660a274f715eeb82de112e0779>libusb_kernel_driver_active()</a>. Determine if a kernel driver is active on an interface. Not available on Windows.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Parameter: <i><b>interface</b></i>: Integer - Interface number<br>
Return value: Integer - 0 if no kernel driver is active, 1 if a kernel driver is active, error code otherwise
</td></tr>
<tr><td><b>int USB_open(const int usbdeviceid, const int interface = -1)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__dev.html#ga3f184a8be4488a767b2e0ae07e76d1b0>libusb_open()</a>. Open a USB device. If an interface number is provided, it also claims the interface.<br><br>
Parameter: <i><b>usbdeviceid</b></i>: Integer - Device id of the USB device<br>
Parameter: <i><b>interface</b></i>: Integer - Interface number<br>
Return value: Integer - New USB handle id or error code
</td></tr>
<tr><td><b>int USB_release_interface(const int usbhandleid, const int interface)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__dev.html#ga49b5cb0d894f6807cd1693ef29aecbfa>libusb_release_interface()</a>. Release an interface previously claimed.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Parameter: <i><b>interface</b></i>: Integer - USB interface to be released<br>
Return value: Integer - 0 on success. Error code otherwise
</td></tr>
<tr><td><b>int USB_reset_device(const int usbhandleid)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__dev.html#gafee9c4638f1713ca5faa867948878111>libusb_reset_device()</a>. Perform a USB port reset to reinitialize a device.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Return value: Integer - 0 on success. Error code otherwise
</td></tr>
<tr><td><b>USB_setBusy(const int usbhandleid, const bool busy)</b></td></tr>
<tr><td>
Set or undets the device to busy state. If state is busy, no read or write will be performed until it is unset. Used for data contention.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Parameter: <i><b>busy</b></i>: Boolean - Specifies if the USB device must be set or unset to busy state.<br>
Return value: None
</td></tr>
<tr><td><b>int USB_set_configuration(const int usbhandleid, const int configuration)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__dev.html#ga785ddea63a2b9bcb879a614ca4867bed>libusb_set_configuration()</a>. Set the active configuration for a device.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Parameter: <i><b>configuration</b></i>: Integer - The value of the configuration you wish to activate, or -1 if you wish to put the device in an unconfigured state<br>
Return value: Integer - 0 on success. Error code otherwise
<tr><td><b>int USB_set_interface_alt_setting(const int usbhandleid, const int interface, const int altsetting)</b></td></tr>
<tr><td>
Wrapper for <a href=https://libusb.sourceforge.io/api-1.0/group__libusb__dev.html#ga4858ad4f0f58fd1dc0afaead1fe6479a>libusb_set_interface_alt_setting()</a>. Release an interface previously claimed.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device obtained when it was opened<br>
Parameter: <i><b>interface</b></i>: Integer - Number of the previously-claimed interface<br>
Parameter: <i><b>altsetting</b></i>: Integer - Number of the alternate setting to activate<br>
Return value: Integer - 0 on success. Error code otherwise
</td></tr>
<tr><td><b>bool USBDevice_close(const QString &devname)</b></td></tr>
<tr><td>
Close a previously opened USB device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the USB device<br>
Return value: Boolean - True on success, false otherwise
</td></tr>
<tr><td><b>QString USBDevice_description(const QString &devname)</b></td></tr>
<tr><td>
Return the description (product) of the USB device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the USB device<br>
Return value: String - Description if found, blank if not found or on error
</td></tr>
<tr><td><b>QList&lt;QString&gt; USBDevice_list()</b></td></tr>
<tr><td>
Provide a list of the USB device names of the USB devices currently available in the system.<br><br>
Return value: List - List of String containing the USB device names found in the format <i>VVVV:PPPP[:N]</i> where <i>VVVV</i> is the vendor id, <i>PPPP</i> i the product id and <i>N</i> is a sequencal number if more than one device of the same type are found.
</td></tr>
<tr><td><b>QString USBDevice_manufacturer(const QString &devname)</b></td></tr>
<tr><td>
Returns the manufacturer (vendor) of the USB device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the USB device<br>
Return value: String - Manufacturer if found, blank if not found or on error
</td></tr>
<tr><td><b>int USBDevice_open(const QString &devname)</b></td></tr>
<tr><td>
Open a USB device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the USB device<br>
Return value: Integer - New handle id for the USB device. Returns -1 on error
</td></tr>
<tr><td><b>QString USBDevice_serialNumber(const QString &devname)</b></td></tr>
<tr><td>
Return the serial number of the USB device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the USB device<br>
Return value: String - Serial number if found, blank if not found or on error
</td></tr>
<tr><td><b>bool USBDevice_test(const QString &devname)</b></td></tr>
<tr><td>
Test if a USB device can be used. This function tries to open and close the USB device.<br><br>
Parameter: <i><b>devname</b></i>: String - Device name of the USB device<br>
Return value: Boolean - True on success, false otherwise
</td></tr>
<tr><td><b>SIGNAL - USB_Data(const int usbhandleid, QByteArrayView data)</b></td></tr>
<tr><td>
Triggered when there is data available from a USB device.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device<br>
Parameter: <i><b>data</b></i>: Binary - Data received<br>
</td></tr>
<tr><td><b>SIGNAL - USB_Error(const int usbhandleid)</b></td></tr>
<tr><td>
Triggered when an error accurred in the USB device.<br><br>
Parameter: <i><b>usbhandleid</b></i>: Integer - Handle id of the USB device<br>
</td></tr>
</table>

### DSP subsystem
The *DSP* subsystem provides functions to handle real-time data, specially audio. The real-time data is managed as *Binary* types. As explained above, a *Binary* type is a reference to a byte stream which resides in the C++ core application environment.<br><br>
All the *Binary* values handled by the *DSP* subsystem are assumed to be series of 32-bit floating point values. In some cases, the series are complex, with a real and an imaginary component interlaced in the series of values. In this case, we will call this type *Binary Complex*.<br><br>
Many of these functions require a certain *memory* between calls. For instance, to be able to apply a filter, the filter must be defined first. Also, certain operations need to know the last value processed in the previous call to avoid abrupt changes, like filtering, FFTs, resample, etc. For this reason, the DSP subsystem provides a function (*DSP_create()*) to get an object of type *DSP* which can be used in these cases.

<table><tr></tr>
<tr><td><b>ENUM: FFTWindow</b></td></tr>
<tr><td>
FFTW_NONE<br>
FFTW_HANN<br>
FFTW_HAMMING<br>
FFTW_BLACKMAN<br>
FFTW_BLACKMAN_HARRIS_4<br>
FFTW_BLACKMAN_HARRIS_7
</td></tr>
<tr><td><b>ENUM: Band</b></td></tr>
<tr><td>
BAND_AM<br>
BAND_FM<br>
BAND_WFM<br>
BAND_LSB<br>
BAND_USB<br>
BAND_DSB<br>
</td></tr>
<tr><td><b>ENUM: FilterType</b></td></tr>
<tr><td>
FT_PASSBAND<br>
FT_REJECTBAND<br>
FT_IIR<br>
FT_FIR<br>
FT_IFIR
</td></tr>
<tr><td><b>ENUM: MiricsFormat</b></td></tr>
<tr><td>
MF_252<br>
MF_336<br>
MF_384<br>
MF_504
</td></tr>
<tr><td><b>float DSP_avg(QByteArrayView input)</b></td></tr>
<tr><td>
Return the average of all values in the input series.<br><br>
Parameter: <i><b>input</b></i>: Binary - Series of real values<br>
Return value: Real - Result of the average
</td></tr>
<tr><td><b>QByteArrayView DSP_compress(QByteArrayView input, const int cbits)</b></td></tr>
<tr><td>
Compress the input 32-bit float series of values to a series of 8 or 16 bit values. The resulting series contains an additional 8 byte header to be able to decompress the series. The purpose of this function is to cmpress audio.<br><br>
Parameter: <i><b>input</b></i>: Binary - Series of real values<br>
Parameter: <i><b>cbits</b></i>: Integer - This value can be 8 or 16<br>
Return value: Binary - Compressed series. The length of the resulting series is half (for 16 bit) or a quarter (for 8 bit) of the input series plus 8 additional header bytes
</td></tr>
<tr><td><b>int DSP_create()</b></td></tr>
<tr><td>
Returns a reference to a newly created <i>DSP</i> object.<br><br>
Return value: Integer - Identifier of the new <i>DSP</i> object
</td></tr>
<tr><td><b>QByteArrayView DSP_demodulate(const int dspid, QByteArrayView input, const int fs, const Box::Band band)</b></td></tr>
<tr><td>
Demodulates a complex I/Q series of values to audio.<br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Parameter: <i><b>input</b></i>: Binary Complex - Input complex series. This series comes usually from a SDR radio receiver<br>
Parameter: <i><b>fs</b></i>: Integer - Sampling frequency of the input series<br>
Parameter: <i><b>band</b></i>: Band - One value from the *Band* enum specifying the demodulation type (AM, FM, etc.). For instance, *Box.BAND_WFM* for wide FM.<br>
Return value: Binary - Demodulated signal.
</td></tr>
<tr><td><b>void DSP_dump(QByteArrayView input, const QString &filename, const bool append = false)</b></td></tr>
<tr><td>
Dump the content of the series of real values to a file in readable format. For debug purposes.<br><br>
Parameter: <i><b>input</b></i>: Binary - Series of values<br>
Parameter: <i><b>filename</b></i>: String - File name to write the output<br>
Parameter: <i><b>append</b></i>: Boolean - Specifies wether the values are appended to the file or it is ovewritten at each call. The default is not to append<br>
Return value: None
</td></tr>
<tr><td><b>void DSP_dump_c(QByteArrayView input, const QString &filename, const bool append = false)</b></td></tr>
<tr><td>
Dump the content of the series of complex values to a file in readable format. For debug purposes.<br><br>
Parameter: <i><b>input</b></i>: Binary Complex - Series of complex values<br>
Parameter: <i><b>filename</b></i>: String - File name to write the output<br>
Parameter: <i><b>append</b></i>: Boolean - Specifies wether the values are appended to the file or it is ovewritten at each call. The default is not to append<br>
Return value: None
</td></tr>
<tr><td><b>QByteArrayView DSP_FFT(const int dspid, QByteArrayView input, const int width = -1, const Box::FFTWindow window_type = FFTW_BLACKMAN_HARRIS_4)</b></td></tr>
<tr><td>
Calculate the FFT of a series of real values. The length of the input is truncated to the nearest power of 2 value. For instance, if the series contains 1000 values, only 512 will be used. If the series contains 1030, then 1024 values will be used.<br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Parameter: <i><b>input</b></i>: Binary - Input series of real values in time domain<br>
Parameter: <i><b>width</b></i>: Integer - If specified, the resulting series of values in the frequency domain will be resampled to this width<br>
Parameter: <i><b>window_type</b></i>: FFTWindow - The FFT window to be applied to the input series. The defualt is Blackman-Harris-4. Check <a href=https://en.wikipedia.org/wiki/Window_function>here</a> for additonal information<br>
Return value: Binary - Series of values in the frequrncy domain. As the input is a series of real values, the output series in the frequency will be always symmetric and only the positive half will be included in the resulting series
</td></tr>
<tr><td><b>QByteArrayView DSP_FFT_c(const int dspid, QByteArrayView input, const int width = -1, const Box::FFTWindow window_type = FFTW_BLACKMAN_HARRIS_4)</b></td></tr>
<tr><td>
Calculate the FFT of a series of complex values. The length of the input is truncated to the double of the nearest power of 2 value. For instance, if the series contains 1000 values (500 complex samples) , only 256 will be used. If the series contains 1030 (515 complex value), then 512 values will be used.<br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Parameter: <i><b>input</b></i>: Binary - Input series of complex values in time domain<br>
Parameter: <i><b>width</b></i>: Integer - If specified, the resulting series of values in the frequency domain will be resampled to this width<br>
Parameter: <i><b>window_type</b></i>: FFTWindow - The FFT window to be applied to the input series. The defualt is Blackman-Harris-4. Check <a href=https://en.wikipedia.org/wiki/Window_function>here</a> for additonal information<br>
Return value: Binary - Series of values in the frequrncy domain. As the input is a series of complex values, the output series in the frequency domain will not be be always symmetric and the full spectrum will be provided
</td></tr>
<tr><td><b>QByteArrayView DSP_filter(const int dspid, QByteArrayView input)</b></td></tr>
<tr><td>
Filter a series of real values. Please note that the filter coeficients must be calculated before calling this function using <i>DSP_setFilterParams</i><br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Parameter: <i><b>input</b></i>: Binary - Input series of real values<br>
Return value: Binary - Filtered series of real values. The length of the resulting series is equal to the input
</td></tr>
<tr><td><b>QByteArrayView DSP_filter_c(const int dspid, QByteArrayView input)</b></td></tr>
<tr><td>
Filter a series of complex values. Please note that the filter coeficients must be calculated before calling this function using <i>DSP_setFilterParams</i><br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Parameter: <i><b>input</b></i>: Binary - Input series of complex values<br>
Return value: Binary - Filtered series of real values. The length of the resulting series is equal to the input
</td></tr>
<tr><td><b>float DSP_max(QByteArrayView input)</b></td></tr>
<tr><td>
Return the maximum value in the input series.<br><br>
Parameter: <i><b>input</b></i>: Binary - Series of real values<br>
Return value: Real - Maximum value
<tr><td><b>QByteArrayView DSP_mirics_convert(QByteArrayView input, Box::MiricsFormat format, const int rate)</b></td></tr>
<tr><td>
The Mirics chipset for SDR devices outputs the data in a special format which must be preprocessed in order to get a raw I/Q complex values series. The purpose of this function is to perform that conversion. There are 4 subformats: <i>252</i>, <i>336</i>, <i>384</i> and <i>504</i><br><br>
Parameter: <i><b>input</b></i>: Binary - Input series in Mirics format<br>
Parameter: <i><b>format</b></i>: MiricsFormat - Check the definition of this enum above<br>
Parameter: <i><b>rate</b></i>: Integer - Sample rate<br>
Return value: Binary - Series of complex I/Q values
<tr><td><b>float DSP_min(QByteArrayView input)</b></td></tr>
<tr><td>
Return the minimum value in the input series.<br><br>
Parameter: <i><b>input</b></i>: Binary - Series of real values<br>
Return value: Real - Minimum value
</td></tr>
<tr><td><b>QByteArrayView DSP_normalize(const int dspid, QByteArrayView input)</b></td></tr>
<tr><td>
Normalizes a series of real values. The process of normalization consists on removing the DC component of a signal by forcing the average value of the signal to be null.<br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Parameter: <i><b>input</b></i>: Binary - Input series of real values<br>
Return value: Binary - Normalized series of real values. The length of the resulting series is equal to the input
</td></tr>
<tr><td><b>QByteArrayView DSP_normalize_c(const int dspid, QByteArrayView input)</b></td></tr>
<tr><td>
Normalizes a series of complex values. The process of normalization consists on removing the DC component of a signal by forcing the average value of the signal to be null.<br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Parameter: <i><b>input</b></i>: Binary - Input series of complex values<br>
Return value: Binary - Normalized series of complex values. The length of the resulting series is equal to the input
</td></tr>
<tr><td><b>QByteArrayView DSP_NR(const int dspid, QByteArrayView input, const float ratio)</b></td></tr>
<tr><td>
Apply a basic algorithm to reduce white noise in an audio signal. The amount of noise reduced is given by the parameter <i>ratio</i>.<br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Parameter: <i><b>input</b></i>: Binary - Input series of real values<br>
Parameter: <i><b>ratio</b></i>: Real - Reduction ratio between 0.0 and 1.0<br>
Return value: Binary - Processed audio signal. The length of the resulting series is equal to the input
</td></tr>
<tr><td><b>void DSP_release(const int dspid)</b></td></tr>
<tr><td>
Destroy the <i>DSP</i> object given by the parameter <i>dspid</i>.<br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Return value: None
</td></tr>
<tr><td><b>QByteArrayView DSP_resample(const int dspid, QByteArrayView input, const int outputsize)</b></td></tr>
<tr><td>
Resample a real values series to make the length fit to <i>outputsize</i>.<br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Parameter: <i><b>input</b></i>: Binary - Input series of real values<br>
Parameter: <i><b>outputsize</b></i>: Integer - New size<br>
Return value: Binary - Resized real values series
</td></tr>
<tr><td><b>QByteArrayView DSP_resample_c(const int dspid, QByteArrayView input, const int outputsize)</b></td></tr>
<tr><td>
Resample a complex values series to make the length fit to <i>outputsize</i>. Note that this parameter is the number of complex pairs of values. So, the total number of values in the resulting series is double than <i>outputsize</i><br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Parameter: <i><b>input</b></i>: Binary - Input series of real values<br>
Parameter: <i><b>outputsize</b></i>: Integer - New size<br>
Return value: Binary - Resized complex values series
</td></tr>
<tr><td><b>void DSP_resetFilter(const int dspid)</b></td></tr>
<tr><td>
Reset the filter parameters in the <i>DSP</i> object. The filtering will be disabled until new parameters are calculated.<br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Return value: None
</td></tr>
<tr><td><b>QByteArrayView DSP_scale(const int dspid, QByteArrayView input, const float scale)</b></td></tr>
<tr><td>
Multiplies all values in the series by a factor given by <i>scale</i>. This function can be applied to both real and complex series.<br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Parameter: <i><b>input</b></i>: Binary - Input series of values<br>
Parameter: <i><b>scale</b></i>: Real - Multiplying factor<br>
Return value: Binary - New scaled values series
</td></tr>
<tr><td><b>void DSP_setFilterParams(const int dspid, const int fs, const int f1, const int f2, const int order, const Box::FilterType type, const Box::FilterType algorithm = FT_IIR)</b></td></tr>
<tr><td>
Set the filter parameters in the <i>DSP</i> object based on the parameters provided. The filter types are <i>pass band</i> and <i>reject band</i>. For low pass filters, set f1 = 0. For high pass filter, set f2 = fs / 2.<br><br>
Parameter: <i><b>dspid</b></i>: Integer - DSP id<br>
Parameter: <i><b>fs</b></i>: Integer - Sampling frequency<br>
Parameter: <i><b>f1</b></i>: Integer - Low cut frequency<br>
Parameter: <i><b>f2</b></i>: Integer - High cut frequency<br>
Parameter: <i><b>order</b></i>: Integer - Filter order. This value depends on the filter algorithm<br>
Parameter: <i><b>type</b></i>: FilterType - This parameter can be either <i>Box.FT_PASSBAND</i> or <i>Box.FT_REJECTBAND</i><br>
Parameter: <i><b>algorithm</b></i>: FilterType - This parameter can be one of the following:
<ul>
<li><i>Box.FT_FIR</i>: Finite impulse response filter with Hamming window</li>
<li><i>Box.FT_IFIR</i>: Interpolated finite impulse response filter with Hamming window</li>
<li><i>Box.FT_IIR</i>: Chebyshev type II infinite impulse response filter</li>
</ul>
Return value: None
</td></tr>
<tr><td><b>QByteArrayView DSP_uncompress(QByteArrayView input, const int cbits)</b></td></tr>
<tr><td>
Uncompress a previously compressed series value. The parameter <i>cbits</i> (compressed bits) must be the same used when it was compressed.<br><br>
Parameter: <i><b>input</b></i>: Binary - Compresed series of values<br>
Parameter: <i><b>cbits</b></i>: Integer - This value can be 8 or 16<br>
Return value: Binary - Uncompressed series
</td></tr>
</table>
