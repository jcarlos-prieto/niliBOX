# niliBOX
***niliBOX*** is a software to manage external devices connected locally or remotely, specially radio receivers.  
***niliBOX*** is the evolution of [PCR AnyWhere](https://www.nilibox.com/PCRAnyWhere), a well known software to control Icom radio scanners.  
It has been enhanced with new devices, a brand new interface and support for mobiles devices.  

In this repository you can find the source code of the entire application.  
***niliBOX*** is mainly developed in C++ using the [Qt framework](https://www.qt.io/product/framework) but it also contains code in C, Java, Javascript, QML and a little in Objective C.  

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
- Drivers: Executable resources developed in QML and Javascript which implement the different functional modules
- Languages: Files of type .qm containing the translation of the core application and drivers into different languages
- Themes: Files of propietary formt (.set) describing the appearence of the core application and modules.

This is a general description of each file and directorydirectory:
- *source:* The source code of the core application. This directory also contains the source code of the third party libraries used: libusb, Oboe and USB Serial for Android.
- *resources:* The source code of the resources (drivers, languages and themes), QML components used by the modules, resource configuration files (.set) and some additional files needed. The scripts contained in this directory are used for the precompilation of the resouces and they are explained in the 'Compilation' section.
- *platforms:* Specific files for the distribution on the different platforms supported. The directories for Android and iOS also include some specific source files which are included in the man project.
- *distrib:* Scripts to create distribution packages for each operating system.
- *CMakeLists.txt:* The main project configuration file.
- *release-notes.txt:* The release notes of this version.

## Compilation
The first step to compile the application is installing the Qt Framework (version 6.7.3 recommended). You can download the Open Source version from [here](https://www.qt.io/download-qt-installer-oss).  
Always include the additional libraries 'Qt Multimedia' and 'Qt Serial Port' when installing the Qt Framework.  

Depending on the operating system, different options can be chosen. This is a description of my compilation stack:

### Windows => Windows distribution
- Windows 11
- MSYS2 for MinGW support. Available [here](https://www.msys2.org/).  
- Qt Framework for MinGW 64-bit using the Qt Maintenance tool (plus the additional libraries mentioned above).
- Build directory set up to niliBOX\build\Desktop-Release.

### Linux => Linux, Linux headless and Android distributions
- Linux centOS 8 (Why? the GLIBC library present in the Linux distribution is linked to the executable. centOS 8 uses GLIBC 2.28 which is forward compatible with many Linux distributions)
- Commom developer tools (gcc, cmake, etc)
- Qt Framework for Desktop and Android using the Qt Maintenance tool (plus the additional libraries mentioned above).
- For Android: OpenJDK 17. The Android SDK and NDK can be installed from Qt Creator SDKs configuration screen.
- To generate the Linux headless version, add the variable -DNOGUI:BOOL=TRUE in the CMake Configuration option in Qt Creator.
- To generate the Android version, make sure that you sign your package with an application signature.
- Build directories set up to niliBOX\build\Desktop-Release, niliBOX\build\Headless-Release and niliBOX\build\Android-Release respectively.

### macOS => macOS and iOS distributions
- macOS Ventura 13.7
- Xcode 15.2
- Qt Framework for Desktop and iOS using the Qt Maintenance tool (plus the additional libraries mentioned above).
- Build directories set up to niliBOX\build\Desktop-Release, niliBOX\build\iOS-Release

### Resources
This repository contains precompiled versions of all resources under resources/drivers/*.rcc, resources/languages/*.rcc and resources/themes/*.rcc. These files are included in the compilation script.  
If you have made any change to the source of any resource, then you must regenerate the resource files. For this purpose, the script zcompile is provided, both for Windows (zcompile.bat) and Linux (zcompile.sh). The resource files are cross platform, which means that a rcc file generated on one platform is valid for all platforms. Before running the script, open it in a text editor and make sure that the variables set up at the beginning of the script are pointing to the right directories.  
If you have made any change in labels that must be translated to all available languages (both in the core application or any driver), then you must regenerate the language files. For this purpose, the scripts ztranslate are provided, both for Windows and Linux. As before, edit the script before running at set the variables appropriately. After running the script, you must check the corresponding translation file under resources/languages/_TS and provide the translation of the new label for each language.

In summary, the process to fully compile the application is the following:  
1. Modify the source, either core application or drivers.
2. If you have made a change in a label, run ztranslate and add the translation to the corresponding file under _TS.
3. If you have modified anything on any resource (driver, laguage or theme), run zcompile.
4. Open the project file (CMakeList.txt) with Qt Creator and compile the core application.

## Distribution



