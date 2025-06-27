# DEVELOPMENT REFERENCE
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
The files of extension .set contain information about each type of resource. These file are plain text file containing lines with this structure:
```
resource.property=value
```
For example:
```
DRIVERTEST.displayname=Driver test
```
Depending on the type of resource, the properties are different. Here is the description of the properties for each type of resource:
- Driver properties:
  - author: Name of the author. Supports html code
  - description: Brief description of the driver. Supports html code
  - displayname: Name that will appear in the application
  - family: Grouping of the driver. Any value among: 'Audio', 'Automation', 'Radio', 'Test', 'Video'
  - location: Directory where the driver resource file is located
  - minimumversion: Minimum niliBOX version needed to use this driver
  - multiuser: 'true' or 'false' depending on wether a module using this driver can be used simultaneously more than once
  - version: Version number. I use the date in format YYYY.MM.DD
  - virtualdevice: 'true' or 'false' depending on wether a odule using this driver outputs audio that can be chained to another module as audio input
- Language properties:
  - displayname: Name that will appear in the application
  - location: Directory where the language resource file is located
  - version: Version number. I use the date in format YYYY.MM.DD
- Theme properties:
  - displayname: Name that will appear in the application
  - location: Directory where the language resource file is located
  - version: Version number. I use the date in format YYYY.MM.DD

