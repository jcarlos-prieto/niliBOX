# niliBOX
***niliBOX*** is a software to manage external devices connected locally or remotely, specially radio receivers  
***niliBOX*** is the evolution of [PCR AnyWhere](https://www.nilibox.com/PCRAnyWhere), a well known software to control Icom radio scanners.  
It has been enhanced with new devices, a brand new interface and support for mobiles devices.  

In this repository you can find the source code of the entire application.  
***niliBOX*** is mainly developed in C++ using the Qt framework but it also contains code in C, Java, Javascript, QML and a little in Objective C.  

## Compatibility
***niliBOX*** can be compiled for the following platforms:
- Windows (Windows 10 1809 or higher)
- Linux (In general, any distribution using glibc 2.28 or higher)
- macOS (version 12 or higher)
- Android (version 9, API 28 or higher)
- iOS (version 16 or higher)

The official distribution has been compiled using Qt 6.7.3. It can be compiled with any version from Qt 6.6.0. When using Qt 6.8.0 or higher, some issues with non standard audio modes may appear. This is the reason why I use Qt 6.7.3.

## Structure
***niliBOX*** is structured as a core application developed in C++ which handles the graphical interface and the communications together with a series of resources that are loaded in runtime. These resources are packed as Qt resource files (.rcc).  
There are three type of resources:  
- Modules: Executable resources developed in QML and Javascript which implement the different functional modules
- Languages: Files on type .qm containing the translation of the core application and odules into different languages
- Themes: Files of propietary formt (.set) describing the appearence of the core application and modules.

This is a general description of each file and directorydirectory:
- *source:* The source code of the core application
- *resources:* The source code of the resources (drivers, languages and themes), QML components used by the modules, resource configuration files (.set) and some additional files needed. The scripts contained in this directory are used for the precompilation of the resouces and they are explained in the 'Compilation' section.
- *platforms:* Specific files for the distribution on the different platforms supported. The directories for Android and iOS also include some specific source files which are included in the man project.
- *distrib:* Scripts to create distribution packages for each operating system.
- *CMakeLists.txt:* The main project configuration file.
- *release-notes.txt:* The release notes of this version.

## Compilation
