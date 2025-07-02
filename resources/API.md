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
Extends:</bold> <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-abstractbutton.html>AbstractButton</a>
<ul>
<li>Additional property: <code>name</code>: String</li>
<li>Additional property: <code>tooltiptext</code>: String - Text for tooltip box</li>
<li>Theme properties: margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right border-width radius angle foreground-color border-color text-color text-weight image</li>
</ul>
</td>
</tr>
<tr>
<td>TCheck</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-abstractbutton.html>AbstractButton</a>
<ul>
<li>Additional property <code>name</code>: String</li>
<li>Theme properties: margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right border-width radius angle foreground-color border-color text-color text-weight image</li>
</ul>
</td>
</tr>
<tr>
<td>TColumn</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-column.html>Column</a>
<ul>
<li>Additional property <code>name</code>: String</li>
<li>Theme properties: margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right spacing</li>
</ul>
</td>
</tr>
<tr>
<td>TComboBox</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-combobox.html>ComboBox</a>
<ul>
<li>Additional property <code>name</code>: String</li>
<li>Subcomponent .arrow:  Theme properties: angle foregrouund-color image</li>
<li>Theme properties: margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right border-width radius foreground-color border-color text-color</li>
</ul>
</td>
</tr>
<tr>
<td>TGraph</td>
<td>
This is a native control, not inheriting any standard QML control. It provides a high quality graph panel for time series signals.<br>
When we refer to a color data type, it means a String value representing a color, either in <a href=https://doc.qt.io/archives/qt-6.7/qml-color.html#svg-color-reference>SVG color</a> or in #RRGGBB hexadecimal format.
<ul>
<li>Property <code>name</code>: String</li>
<li>Property <code>data</code>: QByteArrayView containing an array of 32-bit floatint point values. Check <a href=./API.md#box-api>Box API</a> for an explanation of this data type</li>
<li>Property <code>backgroundcolor</code>: Color - Color of the background panel</li>
<li>Property <code>signalcolor</code>: Color - Color of the curve representing the signal</li>
<li>Property <code>signalfillcolor1</code>: Color - When the signal graph is filled, this is the color of the upper part of the filling gradient</li>
<li>Property <code>signalfillcolor2</code>: Color - When the signal graph is filled, this is the color of the lower part of the filling gradient</li>
<li>Property <code>signalfillcolor3</code>: Color - When the signal graph is of type spectrogram, the colors used is a gradient between signalfillcolor1, signalfillcolor2 and signalfillcolor3</li>
<li>Property <code>filled</code>: Boolean - If true, the area below the signal is filled with a gradient composed by signalfillcolor1 and signalfillcolor2</li>
<li>Property <code>logarithmic</code>: Boolean - If true, the signal is represented in logarithmic scale</li>
<li>Property <code>spectrogram</code>: Boolean - If true, the signal is represented as spectrogram</li>
<li>Property <code>average</code>: Boolean - If true, the values represented are the average of the last 2 values. This avoids peaks in the signal</li>
<li>Property <code>logmax</code>: Real - Value in dB of the maximum value in logarithmic scale. Default is 0</li>
<li>Property <code>logmin</code>: Real - Value in dB of the minimum value in logarithmic scale. Default is 100, representing -100 dB</li>
<li>Property <code>delay</code>: Integer - Speed of the spectrogram waterfall. The waterfall will add one line every number of signal updates given by this value</li>
<li>Property <code>maintain</code>: Integer - Value between 0 and 9 defining the speed of the signal peaks to decay. The higher this value, the slower will be the decay</li>
<li>Theme properties: background-color signal-color signalfillcolor1 signalfillcolor2 signalfillcolor3</li>
</ul>
</td>
</tr>
<tr>
<td>TGrid</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-grid.html>Grid</a>
<ul>
<li>Additional property <code>name</code>: String</li>
<li>Theme properties: margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right spacing</li>
</ul>
</td>
</tr>
<tr>
<td>TGroupBox</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-groupbox.html>GroupBox</a>
<ul>
<li>Additional property <code>name</code>: String</li>
<li>Theme properties: margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right border-width radius foreground-color border-color</li>
</ul>
</td>
</tr>
<tr>
<td>TKnob</td>
<td>
This is a native control, not inheriting any standard QML control. It provides a knob.<br>
<ul>
<li>Property <code>name</code>: String</li>
<li>Property <code>text</code>: String - Text to appear inside the knob</li>
<li>Property <code>textsize</code>: Real - Font size of the text</li>
<li>Property <code>max</code>: Real - Maximum value. Default is 1</li>
<li>Property <code>min</code>: Real - Minimum value. Default is 0</li>
<li>Property <code>step</code>: Real - Value increase or decrease for minimum rotation. Default is 0.1</li>
<li>Property <code>anglestep</code>: Real - Angle in degrees to rotate for minimum rotation. Default is 20</li>
<li>Property <code>rounddial</code>: Boolean - If true, the dial sign is a circle instead of a cursor line. Default is false</li>
<li>Property <code>angle</code>: Real - Current angle in degrees</li>
<li>Property <code>value</code>: Real - Current value</li>
<li>Property <code>pressed</code>: Boolean - True if the knob is pressed</li>
<li>Property <code>hovered</code>: Boolean - True if the knob is hovered</li>
<li>Property <code>fast</code>: Boolean - If true, it provides the functionality of changes values by clicking and moving the mouse to right and left</li>
<li>Property <code>tooltiptext</code>: String - Text of the tooltip box</li>
<li>Subcomponent .arrow: Theme properties: image</li>
<li>Theme properties: margin margin-top margin-bottom margin-left margin-right border-width foreground-color border-color text-color</li>
</ul>
</td>
</tr>
<tr>
<td>TLabel</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-label.html>Label</a>
<ul>
<li>Additional property <code>name</code>: String</li>
<li>Additional property <code>pressed</code>: Boolean - True if the label is pressed</li>
<li>Theme properties: padding padding-top padding-botton padding-left padding-right border-width radius angle foreground-color border-color text-color text-weight image</li>
</ul>
</td>
</tr>
<tr>
<td>TLineEdit</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-textfield.html>TextField</a>
<ul>
<li>Additional property <code>name</code>: String</li>
<li>Theme properties: padding padding-top padding-botton padding-left padding-right border-width radius foreground-color border-color text-color</li>
</ul>
</td>
</tr>
<tr>
<td>TRow</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-row.html>Row</a>
<ul>
<li>Additional property <code>name</code>: String</li>
<li>Theme properties: margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right spacing</li>
</ul>
</td>
</tr>
<tr>
<td>TSlider</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-slider.html>Slider</a>
<ul>
<li>Additional property <code>name</code>: String</li>
<li>Theme properties: margin margin-top margin-bottom margin-left margin-right radius foreground-color border-color</li>
</ul>
</td>
</tr>
<tr>
<td>TVideoFrame</td>
<td>
This is a native control, not inheriting any standard QML control. It provides a panel to show live video.<br>
<ul>
<li>Property <code>data</code>: QByteArrayView containing an image captured by the Video subsystem in the <a href=./API.md#box-api>Box API</a></li>
<li>Property <code>mirror</code>: Boolean - If true, the image is shown upside down</li>
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
<thead>
<tr>
<th>Function</th>
<th>Description</th>
</tr>
</thead>
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
<td>b_receive(key,value)</td>
<td>
Receives data from the server side.<br>
<ul>
<li>Parameter <code>key</code>: String</li>
<li>Parameter <code>value</code>: Any basic Javascript type</li>
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
Receives binary data from the server side.
<ul>
<li>Parameter <code>key</code>: String</li>
<li>Parameter <code>value</code>: Binary - The binary type is a mirror of the Qt type QByteArrayView. Check in the <a href=./API.md#box-api>Box API</a> section for an explanation of this data type.</li>
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
Sends data to the client side.
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
Sends binary data to the client side.
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
<td>b_receive(key,value)</td>
<td>
Receives data from the client side.<br>
<ul>
<li>Parameter <code>key</code>: String</li>
<li>Parameter <code>value</code>: Any basic Javascript type</li>
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
Receives binary data from the client side.
<ul>
<li>Parameter <code>key</code>: String</li>
<li>Parameter <code>value</code>: Binary - The binary type is a mirror of the Qt type QByteArrayView. Check in the <a href=./API.md#box-api>Box API</a> section for an explanation of this data type.</li>
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
When these classes are used in the core application to create a new object, they are always given a name. These names are fixed in the application (unless it is modified). The possible object name are listed in the next section [Core object names](#core-object-names). 
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
Blinds button. A button that can contain 2 subbuttons accessible sliding the main button to the left.
<ul>
<li>Subtype: TbButton.blind1 (type TButton)</li>
<li>Subtype: TbButton.blind2 (type TButton)</li>
<li>Theme properties:</li>
</ul>
</td>
</tr>
<tr>
<td>TButton</td>
<td>
Standard button.
<ul>
<li>Theme properties:</li>
</ul>
</td>
</tr>
<tr>
<td>TcFrame</td>
<td>
Collapsable frame. A frame with a title that can be expanded or collapsed clicking on the title.
<ul>
<li>Subtype: TcFrame.header (type TButton)</li>
<li>Subtype: TcFrame.header.title (type TLabel)</li>
<li>Subtype: TcFrame.header.arrow (type TPane)</li>
<li>Subtype: TcFRame.body (type TPane)</li>
<li>Theme properties: background-color border-color foreground-color border-width radius radius-topleft radius-topright radius-bottomright radois-bottomleft margin margin-left margin-top margin-right margn-bottom padding padding-left padding-top padding-right padding-bottom spacing image angle cursor</li>
</ul>
</td>
</tr>
<tr>
<td>TCheck</td>
<td>
Standard check box.
<ul>
<li>Theme properties:</li>
</ul>
</td>
</tr>
<tr>
<td>TComboBox</td>
<td>
Standard combo box.
<ul>
<li>Subtype: TComboBox.arrow (type TPane)</li>
<li>Theme properties:</li>
</ul>
</td>
</tr>
<tr>
<td>TFrame</td>
<td>
A basic panel with a border.
<ul>
<li>Theme properties: background-color border-color foreground-color border-width radius radius-topleft radius-topright radius-bottomright radois-bottomleft margin margin-left margin-top margin-right margn-bottom padding padding-left padding-top padding-right padding-bottom spacing image angle cursor</li>
</ul>
</td>
</tr>
<tr>
<td>TLabel</td>
<td>
A basic label.
<ul>
<li>Theme properties:</li>
</ul>
</td>
</tr>
<tr>
<td>TLineEdit</td>
<td>
A basic box to enter text.
<ul>
<li>Theme properties:</li>
</ul>
</td>
</tr>
<tr>
<td>TList</td>
<td>
A list of selectable items.
<ul>
<li>Theme properties:</li>
</ul>
</td>
</tr>
<tr>
<td>TPane</td>
<td>
The most basic object. A rectangular panel.
<ul>
<li>Theme properties: background-color border-color foreground-color border-width radius radius-topleft radius-topright radius-bottomright radois-bottomleft margin margin-left margin-top margin-right margn-bottom padding padding-left padding-top padding-right padding-bottom spacing image angle cursor</li>
</ul>
</td>
</tr>
<tr>
<td>TPopup</td>
<td>
A full screen modal window with a box to select options.
<ul>
<li>Subtype: TPopup.box (type TPane)</li>
<li>Subtype: TPopup.text (type TLabel)</li>
<li>Subtype: TPopup.buttons (type TPane)</li>
<li>Subtype: TPopup.icon.info (type TPane)</li>
<li>Subtype: TPopup.icon.ques (type TPane)</li>
<li>Subtype: TPopup.icon.warn (type TPane)</li>
<li>Subtype: TPopup.icon.crit (type TPane)</li>
<li>Theme properties:</li>
</ul>
</td>
</tr>
<tr>
<td>TTextEdit</td>
<td>
A multiline entry field.
<ul>
<li>Theme properties:</li>
</ul>
</td>
</tr>
</table>

## Core object names
This are the names of the graphical objects implemented in the core application. The purpose of listinh them here is to allow the customization of their appearence via themes.
<table>
<thead>
<tr>
<th>Object name</th>
<th>Type</th>
</tr>
</thead>
</table>

## Theme properties
When we refer to a color data type, it means a String value representing a color, either in <a href=https://doc.qt.io/archives/qt-6.7/qml-color.html#svg-color-reference>SVG color</a> or in #RRGGBB hexadecimal format.

## Box API

