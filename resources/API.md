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
<li>Property: <i><b>name</b></i>: String</li>
<li>Property: <i><b>tooltiptext</b></i>: String - Text for tooltip box</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right border-width radius angle foreground-color border-color text-color text-weight image</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TCheck</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-abstractbutton.html>AbstractButton</a>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right border-width radius angle foreground-color border-color text-color text-weight image</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TColumn</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-column.html>Column</a>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right spacing</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TComboBox</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-combobox.html>ComboBox</a>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Subcomponent <i><b>.arrow</b></i>:  Theme properties: angle foregrouund-color image</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right border-width radius foreground-color border-color text-color</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TGraph</td>
<td>
This is a native control, not inheriting any standard QML control. It provides a high quality graph panel for time series signals.<br>
When we refer to a color data type, it means a String value representing a color, either in <a href=https://doc.qt.io/archives/qt-6.7/qml-color.html#svg-color-reference>SVG color</a> or in #RRGGBB hexadecimal format.
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Property <i><b>data</b></i>: QByteArrayView containing an array of 32-bit floatint point values. Check <a href=./API.md#box-api>Box API</a> for an explanation of this data type</li>
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
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-grid.html>Grid</a>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i<b>>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right spacing</i></i></li>
</ul>
</td>
</tr>
<tr>
<td>TGroupBox</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-groupbox.html>GroupBox</a>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right border-width radius foreground-color border-color</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TKnob</td>
<td>
This is a native control, not inheriting any standard QML control. It provides a knob.<br>
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
<li>Subcomponent <i><b>.arrow</b></i>: Theme properties: image</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right border-width foreground-color border-color text-color</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TLabel</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-label.html>Label</a>
<ul>
<li>Additional property <i><b>name</b></i>: String</li>
<li>Additional property <i><b>pressed</b></i>: Boolean - True if the label is pressed</li>
<li>Theme properties: <i><b>padding padding-top padding-botton padding-left padding-right border-width radius angle foreground-color border-color text-color text-weight image</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TLineEdit</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-textfield.html>TextField</a>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>padding padding-top padding-botton padding-left padding-right border-width radius foreground-color border-color text-color</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TRow</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-row.html>Row</a>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right padding padding-top padding-botton padding-left padding-right spacing</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TSlider</td>
<td>
Extends <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-controls-slider.html>Slider</a>
<ul>
<li>Property <i><b>name</b></i>: String</li>
<li>Theme properties: <i><b>margin margin-top margin-bottom margin-left margin-right radius foreground-color border-color</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TVideoFrame</td>
<td>
This is a native control, not inheriting any standard QML control. It provides a panel to show live video.<br>
<ul>
<li>Property <i><b>data</b></i>: QByteArrayView containing an image captured by the Video subsystem in the <a href=./API.md#box-api>Box API</a></li>
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
Creates a new Box object to interact with the C++ Box API.
<ul>
<li>Parameter <i><b>type</b></i>: String - It can be either "REMOTE" or nothing. If "REMOTE" is provided, then the Box object will access the hardware at the server side</li>
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
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: Any basic Javascript type</li>
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
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: Binary - The binary type is a mirror of the Qt type QByteArrayView. Check in the <a href=./API.md#box-api>Box API</a> section for an explanation of this data type.</li>
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
<li>Parameter <i><b>key</b></i>: String - Setting name.</li>
<li>Parameter <i><b>value</b></i>: Any basic Javascript data type - Setting value</li>
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
<li>Parameter <i><b>key</b></i>: String - Setting name.</li>
<li>Parameter <i><b>default</b></i>: Any basic Javascript data type - Default value if the setting doesn't exist</li>
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
<li>Parameter <i><b>value</b></i>: Any native Javascript type</li>
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
<li>Parameter <i><b>key</b></i>: String</li>
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
<li>Parameter <i><b>name</b></i>: String - This value will be used to reference the primitives available in the imported module</li>
<li>Parameter <i><b>file</b></i>: String - File name of the module to be imported. This file must be added to the resource collection file</li>
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
<li>Parameter <i><b>text</b></i>: String - This value will be added to the corresponding language file to be manually translated before compilation</li>
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
<li>Parameter <i><b>type</b></i>: String - Control type</li>
<li>Parameter <i><b>name</b></i>: String - Control name.</li>
<li>Parameter <i><b>var</b></i>: String - Theme parameter to be retrieved</li>
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
<li><i>SELF</i>: The client and the server are on the same computer</li>
<li><i>LOCAL</i>: The client and the server are on different computers on the same local network</li>
<li><i>DIRECT</i>: The client and the server are on different local networks but the client can access the server directly</li>
<li><i>CBACK</i>: The client and the server are on different local networks but the server can contact the client directly. The client has used a call-back method to contact the server</li>
<li><i>TCP</i>: The client and the server cannot communicate directly and the traffic if relayed by the niliBOX server</li>
<li><i>HTTP</i>: The client and the server cannot communicate and there is no possible TCP connection with the niliBOX server. The traffic is encapsulated in HTTP</li>
</ul>
Example: <code>let connection = b_conn();</code><br>
</td>
</tr>
<tr>
<td>b_mouse(type)</td>
<td>
Changes the shape of the mouse cursor.
<ul>
<li>Parameter <i><b>type</b></i>:  Qt::CursorShape type - This type is described <a href=https://doc.qt.io/archives/qt-6.7/qml-qtquick-mousearea.html#cursorShape-prop>here</a></li>
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
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: Any basic Javascript type</li>
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
Creates a new Box object to interact with the C++ Box API.
<ul>
<li>Parameter <i><b>type</b></i>: String - It can be either "REMOTE" or nothing. If "REMOTE" is provided, then the Box object will access the hardware at the server side</li>
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
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: Any basic Javascript type</li>
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
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: Binary - The binary type is a mirror of the Qt type QByteArrayView. Check in the <a href=./API.md#box-api>Box API</a> section for an explanation of this data type.</li>
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
<li>Parameter <i><b>key</b></i>: String - Setting name.</li>
<li>Parameter <i><b>value</b></i>: Any basic Javascript data type - Setting value</li>
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
<li>Parameter <i><b>key</b></i>: String - Setting name.</li>
<li>Parameter <i><b>default</b></i>: Any basic Javascript data type - Default value if the setting doesn't exist</li>
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
<li>Parameter <i><b>value</b></i>: Any native Javascript type</li>
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
<li>Parameter <i><b>key</b></i>: String</li>
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
Called when the client starts.
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
<li>Parameter <i><b>key</b></i>: String</li>
<li>Parameter <i><b>value</b></i>: Any basic Javascript type</li>
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
<li>Subtype: <i><b>TbButton.blind1</b></i> (type <i>TButton</i>)</li>
<li>Subtype: <i><b>TbButton.blind2</b></i> (type <i>TButton</i>)</li>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle text-color link-color text-weight text-align text-font</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TButton</td>
<td>
Standard button.
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle text-color link-color text-weight text-align text-font</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TcFrame</td>
<td>
Collapsable frame. A frame with a title that can be expanded or collapsed clicking on the title.
<ul>
<li>Subtype: <i><b>TcFrame.header</b></i> (type <i>TButton</i>)</li>
<li>Subtype: <i><b>TcFrame.header.title</b></i> (type <i>TLabel</i>)</li>
<li>Subtype: <i><b>TcFrame.header.arrow</b></i> (type <i>TPane</i>)</li>
<li>Subtype: <i><b>TcFRame.body</b></i> (type <i>TPane</i>)</li>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle</li>
</ul>
</td>
</tr>
<tr>
<td>TCheck</td>
<td>
Standard check box.
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle text-color link-color text-weight text-align text-font</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TComboBox</td>
<td>
Standard combo box.
<ul>
<li>Subtype: <i><b>TComboBox.arrow</b></i> (type <i>TPane</i>)</li>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle text-color link-color text-weight text-align text-font</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TFrame</td>
<td>
A basic panel with a border. Equivalent to TPane. To be removed in future versions.
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TLabel</td>
<td>
A basic label.
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle text-color link-color text-weight text-align text-font</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TLineEdit</td>
<td>
A basic box to enter text.
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TList</td>
<td>
A list of selectable items.
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TPane</td>
<td>
The most basic object. A rectangular panel with a border
<ul>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TPopup</td>
<td>
A full screen modal window with a box to select options.
<ul>
<li>Subtype: <i><b>TPopup.box</b></i> (type <i>TPane</i>)</li>
<li>Subtype: <i><b>TPopup.text</b></i> (type <i>TLabel</i>)</li>
<li>Subtype: <i><b>TPopup.buttons</b></i> (type <i>TPane</i>)</li>
<li>Subtype: <i><b>TPopup.icon.info</b></i> (type <i>TPane</i>)</li>
<li>Subtype: <i><b>TPopup.icon.ques</b></i> (type <i>TPane</i>)</li>
<li>Subtype: <i><b>TPopup.icon.warn</b></i> (type <i>TPane</i>)</li>
<li>Subtype: <i><b>TPopup.icon.crit</b></i> (type <i>TPane</i>)</li>
<li>Theme properties: <i><b>background-color foreground-color border-width border-color radius radius-topleft radius-topright radius-bottomleft radius-bottomright margin-top margin-bottom margin-left margin-right spacing image angle</b></i></li>
</ul>
</td>
</tr>
<tr>
<td>TTextEdit</td>
<td>
A multiline entry field.
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
This is the list of theme properties that can used in the definition of themes for the core application and the drivers. You can check what properties apply to each graphical object in the sections [QML controls](#qml-controls) and [Core class names](#core-class-names).

The different type of values are the following:
- *Number*: A number representing a size in milimeters. IN mobile devices, the total size is multipled by 0,8.
- *Number of round*: In the special case of raius of a border, it can be specificed by a *Number* or the word 'round' to specify a complete rounded border.
- *Real number*: An absolute number. Used for angles.
- *String*: Used to specify a file location.
- *Color*: A String value representing a color, either in <a href=https://doc.qt.io/archives/qt-6.7/qml-color.html#svg-color-reference>SVG color</a> or in #RRGGBB hexadecimal format.
- *Alignment*: One of these values: LEFT RIGHT HCENTER JUSTIFY TOP BOTTOM VCENTER CENTER BASELINE
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
<tr><td>signalfillcolor2</td><td>Color</td><td>>Upper color of the gradient used to fill a signal in a Graph object</td></tr>
<tr><td>signalfillcolor3</td><td>Color</td><td>Third color in the gradient used to represent a signal in spectrogram mode in a Graph object</td></tr>
<tr><td>spacing</td><td>Number</td><td>Spacing between objects in a row, column or grid</td></tr>
<tr><td>text-align</td><td>Alignment</td><td>Alignment of the text inside an object. By default, the text is centered</td></tr>
<tr><td>text-color</td><td>Color</td><td>Color of the text</td></tr>
<tr><td>text-font</td><td>Number</td><td>Factor applied to the standard font size. By default, it is 1</td></tr>
<tr><td>text-weight</td><td>BOLD</td><td>Weight of the text font. Only accepts the value BOLD. If not specified, then it is normal weight</td></tr>
</table>

## Box API
Integer String Boolean List
<table>
<tr><td>
<h3>Audio</h3>
The audio subsystem handles the audio devices.<br>
Every audio device can be identified in 3 different ways:
<ul>
<li><i>Unique id</i>: A string that identifies an audio device available in the system</li>
<li><i>Description</i>: A string providing a readable name for the audio device</li>
<li><i>Handler id</i>: An integer identifying an audio device that has been open and can be used for input/output operations</li>
</ul>
When an audio device is open, a parameter <i>mode</i> must be provided. The <i>mode</i> is composed by a list of values separated by commas in the format <i>"samplerate,samplingbits,compressedbits"</i>. This is the meaning of each value:
<ul>
<li><i>samplerate</i>: Integer - Audio rate in samples per second. THe standard values are 8000, 11020, 16000, 22040, 32000, 44080 and 48000</li>
<li><i>samplingbits</i>: Integer - Number of bits per sample. It can be 8 (unsigned), 16 (signed) or 32 (float)</li>
<li><i>compressedbits</i>: Integer - The audio can be open in compressed mode. In this case, the audio will be compressed before sending it from server to client and viceersa and uncompressed at destination. The possible values are 8 and 16 bits</li>
</ul>
An audio device can be a physical device but also a virtual input audio device. The vitual input devices are created when a module has audio output capabilities. In this way, the output of a module can be used as input for anoher module.<br>
</td></tr>
<tr><td>
<b>void audioDevice_close(const int deviceid)</b><br><br>
Closes an audio device.<br>
Parameter: <i><b>deviceid</b></i>: Integer - Handler id of the audio device<br>
Return value: None
</td></tr>
<tr><td>
<b>QString audioDevice_defaultInput()</b><br><br>
Retrieves the unique id of the default audio input device.<br>
Parameter: None<br>
Return value: String - Unique id of the default input audio device
</td></tr>
<tr><td>
<b>QString audioDevice_defaultOutput()</b><br><br>
Retrieves the unique id of the default audio output device.<br>
Parameter: None<br>
Return value: String - Unique id of the default output audio device
</td></tr>
<tr><td>
<b>QString audioDevice_description(const QString &id)</b><br><br>
Retrieves the readable description of an audio device.<br>
Parameter: <i><b>id</b></i>: String - Unique id of the audio device<br>
Return value: String - Readable description of the audio device
</td></tr>
<tr><td>
<b>bool audioDevice_isOpen()</b><br><br>
Returns wether there is any audio device open.<br>
Parameter: None<br>
Return value: Boolean - True if there is any audio device open, false otherwise
</td></tr>
<tr><td>
<b>bool audioDevice_isOpen(const QString &id)</b><br><br>
Returns wether a specific audio device is open.<br>
Parameter: <i><b>id</b></i>: String - Unique id of the audio device<br>
Return value: Boolean - True if the audio device is open, false otherwise
</td></tr>
<tr><td>
<b>QList<QString> audioDevice_list(const QString &mode = "ALL", bool raw = false)</b><br><br>
Returns a list of unique ids of audio devices.<br>
Parameter: <i><b>mode</b></i>: String - Can take 3 different values:
<ul>
<li><i>"ALL"</i> (default): Returns all audio devices, input and output</li>
<li><i>"INPUT"</i> (default): Returns a list of input audio devices</li>
<li><i>"OUTPUT"</i> (default): Returns a list of output audio devices</li>
</ul>
Parameter: <i><b>raw</b></i>: Boolean - If true, it will not include the virtual audio devices<br>
Return value: List - A list of String containing the unique ids of the audio devices requested
</td></tr>
<tr><td>
<b>QString audioDevice_mode(const QString &id)</b><br><br>
Returns the audio mode used to open a specific audio device by its unique id. If the device is not open, then returns an empty String.<br>
Parameter: <i><b>id</b></i>: String - Unique id of the audio device<br>
Return value: String - Audio mode of the device. It is composed by a list of values separated by commas in the format <i>"samplerate,samplingbits,compressedbits"</i>
</td></tr>
<tr><td>
<b>void audioDevice_mute(const int deviceid, const bool mute);</b><br><br>
Mutes an output audio device that is open.<br>
Parameter: <i><b>deviceid</b></i>: Integer - Device handler of the audio device<br>
Return value: None
</td></tr>
<tr><td>
<b>int audioDevice_open(const QString &id, const QString &mode, const bool direct = false)</b><br><br>
Opens an audio device and returns a device handler.<br>
Parameter: <i><b>id</b></i>: String - Unique id of the audio device<br>
Parameter: <i><b>mode</b></i>: String - Audio mode to be used to open. It is composed by a list of values separated by commas in the format <i>"samplerate,samplingbits,compressedbits"</i><br>
Parameter: <i><b>direct</b></i>: Boolean - If true, the audio device will be open in <i>direct</i> mode: low latency, no buffering, no virtual input device created<br>
Return value: Integer - Device handler of the audio device. If the audio device could not be open, this value is -1<br>
</td></tr>

</table>
