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
</table>

## QML properties

## Javascript functions

## Javascript properties

## Box API

