# DEVELOPMENT REFERENCE

## Table of Contents
- [Resources definition](#resources-definition)
- [Custom resources](#custom-resources)
- [Structure of a driver](#structure-of-a-driver)
  - [Resource collection](#resource-collection)
  - [Client](#client)
  - [Config](#config)
  - [Server](#server)

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

The server and client resources may run on different computers. The core *nliBOX* application facilitates the communication between both of them. It is recommended that the client side only handles the user interface and events while the server runs the communication with the external devices and the heavy and time consuming operations.

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

### Client
The client provides the user interface of the application and the configuration screen. The main file and entry point for the resource is the file `main.qml`. This file is written in QML language and Javascript and describes the user interface and its behaviour.

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


    // This function is called when the application state has changed from inactive to active
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
For a full description of the controls, functions and properties available on top of the standard ones provided by QML, please check the [API](./API.md#qml-controls) reference file.

### Config
The structure and functionality of the Config resource is almost identical to the Client. The only difference is that the Config does not communicate with a Server. The main purpose of a Config resource is to set up the configuration parameters that will be used later on by the Client.

The way how the Config can set up the configuration parameters and the Client get access to those is by using some of the functions explained at the API reference file, specifically, the [QML overridable functions](./API.md#qml-overridable-functions). Let's look at an example:

Imagine that your driver has a configuration parameter called *volume* that is established by Config and needs to be known by Client later.
1. At the Config, use the function `b_send("volume", volume);`. This will add a parameter *volume* to the module configuration file assigning the value of the variable *volume* to it.
2. At the Client, the system will call the function `b_start(params)`. The parameter *params* is a structure containing all the settings established at the Config. The way to retrieve the value for *volume* is like this:
   ```
   let volume = 0;
   b_start(params)
   {
       volume = params.volume;
   }
   ```
3. Now you can use *volume* at the Client side. Please note that changing the value of *volume* at the Client will not change the configuration parameter established at Config.

### Server
The server resource provides the communication with the hardware. It runs on a separate thread, optimizing in this way the performance. The main file and entry point for the resource is the file `main.js`. This file is written in pure Javascript and implements the core logics of the driver, including the communications with the hardware. Typically, the server resource relies heavily on the low level, high performance API provided by the Box [API](./API.md#box-api).

In addition to `main.js` you might need to include other files. They must all be included in the `collection.qrc` file described above.

*niliBOX* has enriched the Javascript syntax with a few additional functions and properties to facilitate the development.

A basic example of a `main.js` file is this:
```js
let myvar = 0; //<== your global variables

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


// This function is called when the client has sent data to the client
function b_receive(key, value)
{
    // Basic example
    if (key === "message")
        myfunction(value);
}


// This function is called when the application state has changed from inactive to active
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
    b_send("message", "hello! " + value); //<== This function sends data to the client from the server
}
```
For a full description of the functions and properties available on top of the standard ones provided by Javascript, please check the [API](./API.md#javascript-functions) reference file.

## Structure of a language
The language translation files are created by the script ztranslate (in its Windows or Linux versions) located in the resources directory. This script analyzes the entire code of the core application and all drivers looking for text that must be translated. The way how a text is identified as translatable is this:
- In C++ files, the text will be considered for translation if it is enclosed in the function `tr()`. For instance: `mylabel.setText(tr("Name:"));`.
- In QML files, the text will be considered for translation is it is enclosed in the function `b_translate()`. For instance: `text: b_translate("Name:")`.

The directory structure of a language is different for the core application and for a driver. If a new language is created, these directory structures must be created for the core and for all drivers.

Structure of the *languages* folder under the *resources* directory:
<pre>
languages/
├──_TS/
│  ├──...
│  ├──...
│  └──...
├──de/
│  ├──collection.qrc
│  ├──flag.png
│  └──trans.qm
├──en/
│  ├──collection.qrc
│  └──flag.png
├──es/
│  ├──collection.qrc
│  ├──flag.png
│  └──trans.qm
├──fr/
│  ├──collection.qrc
│  ├──flag.png
│  └──trans.qm
├──it/
│  ├──collection.qrc
│  ├──flag.png
│  └──trans.qm
└──nl/
   ├──collection.qrc
   ├──flag.png
   └──trans.qm
</pre>

The _TS directory contains one file of type .ts for each piece of code that needs to be translated. Specifically, it contains two type of files:
- One file per language for the core application. For instance `es.ts` for the translation of the core application into Spanish
- One file per driver resource and language. For instance `DIGIMODES_client_de.ts` for the translation of the client resource of the driver DIGIMODES into German.

The .ts files are created by the script ztranslate except for the English language which is considered the source language. These files must be opened and translated manually. The .ts files contain a proprietary xml structure. It is needed to go through all the sections of type *message* and provide a translation for each message. Here is an example:
```xml
    <message>
        <source>Audio settings</source>
        <translation>Configuración de audio</translation>
    </message>
```

The same happens for the language definition for the drivers. In this case, the language directory is inside the driver directory, both for the client and config resources. Here is an extract on these directories for one driver:
<pre>
DRIVER/
├──client/
│  ├──languages/
│  │  ├──de/
│  │  │  └──trans.qm
│  │  ├──es/
│  │  │  └──trans.qm
│  │  ├──fr/
│  │  │  └──trans.qm
│  │  ├──it/
│  │  │  └──trans.qm
│  │  └──nl/
│  │     └──trans.qm
│  └──...
├──config/
│  ├──languages/
│  │  ├──de/
│  │  │  └──trans.qm
│  │  ├──es/
│  │  │  └──trans.qm
│  │  ├──fr/
│  │  │  └──trans.qm
│  │  ├──it/
│  │  │  └──trans.qm
│  │  └──nl/
│  │     └──trans.qm
└──...
</pre>

The files `trans.qm` are generated for each language by the script zcompile before the resources files are created. This means that you don't need to provide the .qm files but they need to be included in the collection.qrc file.

Let's go back to the contents of a language directory under resources/languages. It contains 3 files:
- collection.qrc. Always with this contents:
  ```xml
  <!DOCTYPE RCC>
  <RCC version="1.0">
    <qresource>
        <file>trans.qm</file>
        <file>flag.png</file>
    </qresource>
  </RCC>
  ```
- flag.png. Flag of the country related to this language. The size must be 68x40.
- trans.qm. As said earlier, this file is automatically generated by the script zcompile.

In the case of a language directory for a driver resource (client or config), the language directory only contains the file trans.qm which is also automatically generated by the zcompile script.
