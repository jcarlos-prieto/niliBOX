# niliBOX
***niliBOX*** is a software to manage external devices connected locally or remotely, specially radio receivers.  
***niliBOX*** is the evolution of [PCR AnyWhere](https://www.nilibox.com/PCRAnyWhere), a well known software to control Icom radio scanners.  
It has been enhanced with new devices, a brand new interface and support for mobiles devices.  

In this repository you can find the source code of the entire application.  
***niliBOX*** is mainly developed in C++ using the [Qt framework](https://www.qt.io/product/framework) but it also contains code in C, Java, Javascript, QML and a little in Objective C.  

## Compatibility
***niliBOX*** can be compiled for the following platforms:
- Windows (Windows 10 1809 or higher)
- Linux (in general, any distribution using glibc 2.28 or higher)
- macOS (version 12 or higher)
- Android (version 9, API 28 or higher)
- iOS (version 16 or higher)

The official distribution has been compiled using Qt 6.7.3. It can be compiled with any version from Qt 6.6.0. When using Qt 6.8.0 or higher, some issues with non standard audio modes may appear. This is the reason why I use Qt 6.7.3.

## Structure
***niliBOX*** is structured as a core application developed in C++ which handles the graphical interface and the communications together with a series of resources that are loaded in runtime. These resources are packed as Qt resource files (.rcc).

There are three type of resources:  
- Drivers: Executable resources developed in QML and Javascript which implement the different functional modules
- Languages: Files of type .qm containing the translation of the core application and drivers into different languages
- Themes: Files of proprietary format (.set) describing the appearance of the core application and modules.

This is a general description of each file and directory:
- *source:* The source code of the core application. This directory also contains the source code of the third party libraries used: libusb, Oboe and USB Serial for Android.
- *resources:* The source code of the resources (drivers, languages and themes), QML components used by the modules, resource configuration files (.set) and some additional files needed. The scripts contained in this directory are used for the precompilation of the resources and they are explained in the 'Compilation' section.
- *platforms:* Specific files for the distribution on the different platforms supported. The directories for Android and iOS also include some specific source files which are included in the main project.
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

### Linux => Linux, Linux headless and Android distributions
- Linux centOS 8 (Why? the GLIBC library present in the Linux distribution is linked to the executable. centOS 8 uses GLIBC 2.28 which is forward compatible with many Linux distributions)
- Common developer tools (gcc, cmake, etc)
- Qt Framework for Desktop and Android using the Qt Maintenance tool (plus the additional libraries mentioned above).
- For Android: OpenJDK 17. The Android SDK and NDK can be installed from Qt Creator SDKs configuration screen.
- To generate the Linux headless version, add the variable `-DNOGUI:BOOL=TRUE` in the CMake Configuration option in Qt Creator.
- To generate the Android version, make sure that you sign your package with an application signature.

### macOS => macOS and iOS distributions
- macOS Ventura 13.7
- Xcode 15.2
- Qt Framework for Desktop and iOS using the Qt Maintenance tool (plus the additional libraries mentioned above).

### Resources
This repository contains precompiled versions of all resources under these directories:
- `resources/drivers/*.rcc`
- `resources/languages/*.rcc`
- `resources/themes/*.rcc`

These files are included in the cmake compilation file.

If you have made any change to the source of any resource, then you must regenerate the resource files. For this purpose, the script zcompile is provided, both for Windows (zcompile.bat) and Linux (zcompile.sh). The resource files are cross platform, which means that a rcc file generated on one platform is valid for all platforms. Before running the script, open it in a text editor and make sure that the variables set up at the beginning of the script are pointing to the right directories.

If you have made any change in labels that must be translated to all available languages (both in the core application or any driver), then you must regenerate the language files. For this purpose, the scripts ztranslate are provided, both for Windows and Linux. As before, edit the script before running and set the variables appropriately. After running the script, you must check the corresponding translation file under resources/languages/_TS and provide the translation of the new label for each language.

In summary, the process to fully compile the application is the following:  
1. Modify the source, either core application or drivers.
2. If you have made a change in a label, run ztranslate and add the translation to the corresponding file under _TS.
3. If you have modified anything on any resource (driver, language or theme), run zcompile.
4. Open the project file (CMakeList.txt) with Qt Creator and compile the core application.

## Distribution
The executable generated by Qt Framework has dependencies with many libraries (except on Android and iOS). For this reason, it is mandatory to included the needed libraries with the executable.

This repository provides scripts to generate distribution packages for all the platforms supported. These scripts are included in the directory distrib.

After the core application is compiled and an executable has been generated, you may run one of the following scripts:  
- distrib/make-distrib-windows.bat to generate a Windows distribution from Windows
- distrib/make-distrib-linux to generate a Linux distribution from Linux
- distrib/make-distrib-linux-hl to generate a Linux headless (text mode) distribution from Linux
- distrib/make-distrib-android to generate an Android distribution from Linux
- distrib/make-distrib-macos to generate a macOS distribution from macOS
- distrib/make-distrib-ios to generate an iOS distribution from macOS

Before running any of these scripts, you must modify the variables set at the beginning to customize them to your environment. These scripts will generate a directory under distrib with the contents of the distribution. They will also generate a compressed version of the distribution under distrib/_downloads.

## Custom resources
Are you interested in developing your own drivers, languages or themes? Then please check the [REFERENCE.md](./resources/REFERENCE.md) file to get an overview of how to proceed. You may also check the source code of the current resources to get inspired.

## Notice about licenses
This software is mainly developed using the [Qt Framework](https://www.qt.io/product/framework) under the LGPL v3 license. You may check the details about this license model [here](https://www.qt.io/licensing/open-source-lgpl-obligations#lgpl).  

To fulfill the requirements of LGPL v3, a re-linking mechanism must be provided. This mechanism is described [here](https://nilibox.com/RELINK).  

This software contains embedded the following third party libraries:
- [libusb](https://github.com/libusb/libusb): A library to handle USB devices
- [Oboe](https://github.com/google/oboe): A library to handle audio on Android
- [USB Serial for Android](https://github.com/mik3y/usb-serial-for-android): A java library to handle USB Serial devices on Android.

[Privacy policy](https://nilibox.com/PRIVACY)

[Release notes](./release-notes.txt)
