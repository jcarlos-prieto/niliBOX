# DEVELOPMENT REFERENCE

## Table of Contents
- [Resources definition](#resources-definition)
- [Custom resources](#custom-resources)
- [Structure of a driver](#structure-of-a-driver)
  - [Resource collection](#resource-collection)
  - [Client & Config](#client--config)
- [API Reference](#api-reference)
  - [QML functions](#qml-functions)
  - [QML properties](#qml-properties)
  - [Javascript functions](#javascript-functions)
  - [Javascript properties](#javascript-properties)

## Resources definition
The general structure of the source code of the resources is the following:
<pre>
resources/
├──drivers/
│  ├──DRIVER1/
│  ├──DRIVER2/
│  └──...
├──languages/
│  ├──LANGUAGE1/
│  ├──LANGUAGE2/
│  └──...
├──themes/
│  ├──THEME1/
│  ├──THEME2/
│  └──...
├──drivers.set
├──languages.set
└──themes.set
</pre>
The files of extension .set contain information about each type of resource. These files are plain text file containing lines with this structure:
```
resource.property=value
```
For example:
```
DRIVERTEST.displayname=Driver test
```
Depending on the type of resource, the properties are different. Here is the description of the properties for each type of resource:
- Driver properties:
  - `author`: Name of the author. Supports html code
  - `description`: Brief description of the driver. Supports html code
  - `displayname`: Name that will appear in the application
  - `family`: Grouping of the driver. Any value among: 'Audio', 'Automation', 'Radio', 'Test', 'Video'
  - `location`: Directory where the driver resource file is located, relative to the location of drivers.set
  - `minimumversion`: Minimum niliBOX version needed to use this driver
  - `multiuser`: 'true' or 'false' depending on wether a module using this driver can be used more than once simultaneously
  - `version`: Version number. Any value. I use the date in format YYYY.MM.DD
  - `virtualdevice`: 'true' or 'false' depending on wether a module using this driver outputs audio that can be chained to another module as audio input
- Language properties:
  - `displayname`: Name that will appear in the application
  - `location`: Directory where the language resource file is located, relative to the location of languages.set
  - `version`: Version number. Any value. I use the date in format YYYY.MM.DD
- Theme properties:
  - `displayname`: Name that will appear in the application
  - `location`: Directory where the language resource file is located, relative to the location of themes.set
  - `version`: Version number. Any value. I use the date in format YYYY.MM.DD
 
The different resources of each type are included in the same .set file. For instance, this is the contents of the file themes.set:
```
colors.displayname=Colors
colors.location=themes/colors.rcc
colors.version=2025.06.22
dark.displayname=Dark
dark.location=themes/dark.rcc
dark.version=2025.06.22
ocean.displayname=Ocean
ocean.location=themes/ocean.rcc
ocean.version=2025.06.22
steel.displayname=Steel
steel.location=themes/steel.rcc
steel.version=2025.06.22
```

## Custom resources
If you create a new resource in the same place than the resources included in the application, then you will need to compile the resources (using the ztranslate and zcompile scripts) and compile the core application each time that a change is made.

Another way to work while the resource is being developed is using the *custom* type of resources. A *custom* resource can be used by niliBOX directly from source code and it is automatically compiled at the moment of using it. The *custom* resources are placed in a different location and will be read and used by niliBOX.

The *custom* resources are placed in the home directory of niliBOX (not where the application is located). The location of the home directory depends on the operating system in this way:
- Windows: `C:\Users\username\AppData\Roaming\nilibox\niliBOX`
- Linux: `/home/username/.config/nilibox/niliBOX`
- macOS: `/home/username/.config/nilibox.com/niliBOX`

To create a location for the *custom* resources, you must create the following directory structure under the home directory (example for Windows):
<pre>
C:\Users\username\AppData\Roaming\nilibox\niliBOX\
└──custom/
   ├──drivers/
   │  ├──CUSTOMDRIVER1/
   │  ├──CUSTOMDRIVER2/
   │  └──...
   ├──languages/
   │  ├──CUSTOMLANGUAGE1/
   │  ├──CUSTOMLANGUAGE2/
   │  └──...
   ├──themes/
   │  ├──CUSTOMTHEME1/
   │  ├──CUSTOMTHEME2/
   │  └──...
   ├──drivers.set
   ├──languages.set
   └──themes.set
</pre>
The rest of rules are the same than the ones described above for standard resources except the property location. In the case of a custom resource, the location must point to the directory where the custom resource is located. For instance, in the case of a custom theme:

For standard theme:
```
colors.location=themes/colors.rcc
```
For custom theme:
```
mytheme.location=custom/themes/mytheme
```
If you create a custom resource, make sure that the resource name is unique among standard and custom resources.

## Structure of a driver
A driver is composed of 3 components:
- Client: Provides the main user interface. Communicates with the server
- Server: Provides the backend functionality and controls the external devices. Communicates with the client
- Config: User interface for the configuration of the module. Works in standalone.

Each of these components are compiled into a resource file (.rcc) and then the 3 of them are compiled again into a single resource file. To be able to compile a resource, a file of name collection.qrc must be provided describing the contents of the resource.

The directory structure of a driver (either standard or custom) is the following:
<pre>
DRIVER/
├──client/
│  ├──languages/
│  ├──themes/
│  ├──collection.qrc
│  ├──main.qml
│  └──...
├──config/
│  ├──languages/
│  ├──themes/
│  ├──collection.qrc
│  ├──main.qml
│  └──...
├──server/
│  ├──main.js
│  ├──collection.qrc
│  └──...
├──collection.qrc
└──...
</pre>
You will notice that both the client and the config resources contain subdirectories for languages and themes. These 2 subdirectories contain the specific customization of the user interafce for the driver. We will describe this in the section dedicated to languages and themes.

But by now, let's focus on the main files needed to build a driver.

### Resource collection
The files `collection.qrc` are Qt Resource Collection files. The description of its syntax can be found [here](https://doc.qt.io/archives/qt-6.7/resources.html). It contains the location of each file that must be included in the resource file when it is compiled.

A minimal example of a collection file for the server rersource is this:
```xml
<!DOCTYPE RCC>
<RCC version="1.0">
    <qresource>
        <file>main.js</file>
    </qresource>
</RCC>
```
If the resource contains additional files, then the collection file may become bigger. This is an example of the collection file for the client resource of the test driver. You can see that you just need to include the location of each file needed to run the resource relative to the location of the collection.qrc file.
```xml
<!DOCTYPE RCC>
<RCC version="1.0">
    <qresource>
        <file>main.qml</file>
        <file>SetAudioSettings.qml</file>

        <file>languages/es/trans.qm</file>
        <file>languages/fr/trans.qm</file>
        <file>languages/it/trans.qm</file>
        <file>languages/nl/trans.qm</file>
        <file>languages/de/trans.qm</file>

        <file>themes/colors/noise.png</file>
        <file>themes/colors/play.png</file>
        <file>themes/colors/set.png</file>
        <file>themes/colors/sine.png</file>
        <file>themes/colors/square.png</file>
        <file>themes/colors/stop.png</file>
        <file>themes/colors/style.set</file>
        <file>themes/colors/triangle.png</file>
      
        <file>themes/dark/noise.png</file>
        <file>themes/dark/play.png</file>
        <file>themes/dark/set.png</file>
        <file>themes/dark/sine.png</file>
        <file>themes/dark/square.png</file>
        <file>themes/dark/stop.png</file>
        <file>themes/dark/style.set</file>
        <file>themes/dark/triangle.png</file>
      
        <file>themes/ocean/noise.png</file>
        <file>themes/ocean/play.png</file>
        <file>themes/ocean/set.png</file>
        <file>themes/ocean/sine.png</file>
        <file>themes/ocean/square.png</file>
        <file>themes/ocean/stop.png</file>
        <file>themes/ocean/style.set</file>
        <file>themes/ocean/triangle.png</file>
      
        <file>themes/steel/noise.png</file>
        <file>themes/steel/play.png</file>
        <file>themes/steel/set.png</file>
        <file>themes/steel/sine.png</file>
        <file>themes/steel/square.png</file>
        <file>themes/steel/stop.png</file>
        <file>themes/steel/style.set</file>
        <file>themes/steel/triangle.png</file>
    </qresource>
</RCC>
```
Finally, the collection.qrc file located in the main directory of the driver must always have this content:
```xml
<!DOCTYPE RCC>
<RCC version="1.0">
    <qresource>
        <file>config.rcc</file>
        <file>server.rcc</file>
        <file>client.rcc</file>
    </qresource>
</RCC>
```

### Client & Config
The structure of a client and config resources are identical. They both provide the user interface of the application of the configuration screen. The main file and entry point for the resource is the file `main.qml`. This file is written in QML language and Javascript and describes the user interface and its behaviour.

You can find a QML language reference [here](https://doc.qt.io/archives/qt-6.7/qmlreference.html). The Javascript sections support ECMAScript6 standard. It is not the purpose of this file to provide a tutorial about QML or Javascript and it will be assumed that you are familiar with both languages. You may check the source code of the drivers included in *niliBOX* to get familiar with the ways of working.

In addition to `main.qml` you might need to include other QML files to create custom controls or additional resouces such as pictures, icons, etc. They must all be included in the `collection.qrc` file described above.

*niliBOX* has enriched the QML syntax with a few additional functions and properties to facilitate the development. Also, there are additional controls (user interface objects) to adapt to the themes system.

A basic example of a `main.qml` file is this:
```qml
import QtQuick
import QtQuick.Controls
import niliBOX.Controls //<== Needed to use custom themed controls like TLabel (instead of Label)


Item {
    property int x //<== your global variables

    // Start of the user interface
    TLabel {
        id: label
        font.pixelSize: 0.4 * b_unit //<== b_unit is a property provided by niliBOX
        text: b_translate("Hello world") //<== b_translate is a function provided by niliBOX
    }

    // Start of functions

    // This function is called when the file has been loaded    
    function b_start(params)
    {
        ...your Javascript code...
    }


    // This function is called when the file is going to be unloaded    
    function b_finish()
    {
        ...your Javascript code...
    }


    // This function is called when the server has sent data to the client
    function b_receive(key, value)
    {
        // Basic example
        if (key === "message")
            myfunction(value);
    }


    // This function is called when the application has changed from active to inactive or viceversa
    function b_active()
    {
        ...your Javascript code...
    }


    // This function is called when some hardware device has been plugged or unplugged
    function b_hotplug()
    {
        ...your Javascript code...
    }
    
    
    // You may add your own functions
    function myfunction(value)
    {
        b_send("message", "hello! " + value); //<== This function sends data to the server from the client
    }
}

```
For a full description of the functions and properties available beside the standard ones provided by QML, please check the [API reference](#api-reference).

## API Reference

### QML functions
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

### QML properties

### Javascript functions

### Javascript properties

### Box API
