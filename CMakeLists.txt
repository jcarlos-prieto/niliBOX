# Copyright (C) 2025 - Juan Carlos Prieto <nilibox@nilibox.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses>.

cmake_minimum_required(VERSION 3.16)

string(TIMESTAMP YEAR "%Y")
string(TIMESTAMP MONTH "%m")
string(TIMESTAMP DAY "%d")

project(
    niliBOX
    VERSION 1.2.0
    DESCRIPTION ${YEAR}.${MONTH}.${DAY}
)

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)

if(CMAKE_SYSTEM_NAME STREQUAL "Darwin")
    set(CMAKE_OSX_ARCHITECTURES "x86_64;arm64")
    set(CMAKE_OSX_DEPLOYMENT_TARGET "12.0")
endif()

find_package(QT NAMES Qt6 REQUIRED COMPONENTS Core QUIET)
find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Multimedia Network Concurrent Qml QUIET)
find_package(Qt${QT_VERSION_MAJOR} OPTIONAL_COMPONENTS Gui Quick Widgets QuickWidgets Svg QUIET)

include(GNUInstallDirs)
include_directories(source)

file(GLOB NILIBOX_BASE
    source/main.cpp
    source/common/*.cpp source/common/*.h
    source/server/*.cpp source/server/*.h
)

qt_add_executable(${PROJECT_NAME} WIN32 MACOSX_BUNDLE ${NILIBOX_BASE})

set_source_files_properties(source/common/box.cpp PROPERTIES COMPILE_FLAGS -O1)

if(NOT CMAKE_SYSTEM_NAME STREQUAL "iOS")

    include_directories(AFTER source/libusb)

    target_sources(${PROJECT_NAME} PUBLIC
        source/libusb/config.h
        source/libusb/libusb.h
        source/libusb/libusbi.h
        source/libusb/version.h
        source/libusb/version_nano.h
        source/libusb/core.c
        source/libusb/descriptor.c
        source/libusb/hotplug.c
        source/libusb/io.c
        source/libusb/strerror.c
        source/libusb/sync.c
    )

    if(CMAKE_SYSTEM_NAME STREQUAL "Windows")

        target_compile_definitions(${PROJECT_NAME} PRIVATE   PLATFORM_WINDOWS)
        target_sources(${PROJECT_NAME} PUBLIC
            source/libusb/os/events_windows.h
            source/libusb/os/events_windows.c
            source/libusb/os/threads_windows.h
            source/libusb/os/threads_windows.c
            source/libusb/os/windows_common.h
            source/libusb/os/windows_common.c
            source/libusb/os/windows_usbdk.h
            source/libusb/os/windows_usbdk.c
            source/libusb/os/windows_winusb.h
            source/libusb/os/windows_winusb.c
        )

    else()

        target_compile_definitions(${PROJECT_NAME} PRIVATE   PLATFORM_POSIX)

        target_sources(${PROJECT_NAME} PUBLIC
            source/libusb/os/events_posix.h
            source/libusb/os/events_posix.c
            source/libusb/os/threads_posix.h
            source/libusb/os/threads_posix.c
        )

        if(CMAKE_SYSTEM_NAME STREQUAL "Linux")
            add_definitions(-D_GNU_SOURCE)
            add_definitions(-DHAVE_CLOCK_GETTIME)
            target_sources(${PROJECT_NAME} PUBLIC
                source/libusb/os/linux_usbfs.h
                source/libusb/os/linux_usbfs.c
                source/libusb/os/linux_netlink.c
            )
        endif()

        if(CMAKE_SYSTEM_NAME STREQUAL "Darwin")
            add_definitions(-DTARGET_OS_X)
            target_link_libraries(${PROJECT_NAME} PRIVATE "-framework Security")
            target_sources(${PROJECT_NAME} PUBLIC
                source/libusb/os/darwin_usb.h
                source/libusb/os/darwin_usb.c
            )
        endif()

        if(CMAKE_SYSTEM_NAME STREQUAL "Android")
            add_definitions(-DHAVE_CLOCK_GETTIME)
            target_sources(${PROJECT_NAME} PUBLIC
                platforms/android/alib.h
                platforms/android/alib.c
                source/libusb/os/linux_usbfs.h
                source/libusb/os/linux_usbfs.c
                source/libusb/os/linux_netlink.c
            )
        endif()

    endif()
endif()

target_link_libraries(${PROJECT_NAME} PRIVATE
    Qt::Core
    Qt::Multimedia
    Qt::Network
    Qt::Concurrent
    Qt::Qml
)

if(NOGUI)

    target_compile_definitions(${PROJECT_NAME} PRIVATE NOGUI)

else()

    file(GLOB NILIBOX_GUI
        source/client/*.cpp source/client/*.h
        source/components/*.cpp source/components/*.h
        source/ui/*.cpp source/ui/*.h
    )

    target_sources(${PROJECT_NAME} PUBLIC ${NILIBOX_GUI})

    target_include_directories(${PROJECT_NAME} PRIVATE source/components)

    file(GLOB_RECURSE COMPONENTS_FILES RELATIVE ${CMAKE_CURRENT_SOURCE_DIR}
        resources/components/*.qml
    )

    if(QT_VERSION VERSION_GREATER_EQUAL 6.8.0)
        qt_policy(SET QTP0004 NEW)
    endif()

    qt_add_qml_module(${PROJECT_NAME}
        URI niliBOX.Controls
        VERSION 1.0
        RESOURCE_PREFIX /
        QML_FILES
            ${COMPONENTS_FILES}
    )

    set_source_files_properties(source/components/graph.cpp PROPERTIES COMPILE_FLAGS -O1)

    target_link_libraries(${PROJECT_NAME} PRIVATE
        Qt::Gui
        Qt::Quick
        Qt::Widgets
        Qt::QuickWidgets
        Qt::Svg
    )

endif()

file(GLOB_RECURSE RESOURCE_FILES RELATIVE ${CMAKE_CURRENT_SOURCE_DIR}
    resources/*.set
    resources/*.rcc
    resources/icon.png
    resources/license.txt
    resources/usb.ids
)

qt_add_resources(${PROJECT_NAME} resources FILES ${RESOURCE_FILES})

target_compile_definitions(${PROJECT_NAME} PRIVATE
    APP_VERSION="${PROJECT_VERSION}"
    APP_BUILD="${PROJECT_DESCRIPTION}"
)

if(CMAKE_SYSTEM_NAME STREQUAL "Windows")

    target_compile_definitions(${PROJECT_NAME} PRIVATE
        OS_WINDOWS
        SERIAL
        USB
    )

    find_package(Qt${QT_VERSION_MAJOR} OPTIONAL_COMPONENTS SerialPort)

    target_sources(${PROJECT_NAME} PRIVATE
        "${CMAKE_CURRENT_SOURCE_DIR}/platforms/windows/niliBOX.rc"
    )

    target_link_libraries(${PROJECT_NAME} PRIVATE
        Qt::SerialPort
        ws2_32
        setupAPI
    )

endif()

if(CMAKE_SYSTEM_NAME STREQUAL "Linux")

    target_compile_definitions(${PROJECT_NAME} PRIVATE
        OS_LINUX
        SERIAL
        USB
    )

    find_package(Qt${QT_VERSION_MAJOR} OPTIONAL_COMPONENTS SerialPort)

    target_link_libraries(${PROJECT_NAME} PRIVATE
        Qt::SerialPort
    )

    set_target_properties(${PROJECT_NAME} PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/output
    )
endif()

if(CMAKE_SYSTEM_NAME STREQUAL "Darwin")

    target_compile_definitions(${PROJECT_NAME} PRIVATE
        OS_MAC
        SERIAL
        USB
    )

    find_package(Qt${QT_VERSION_MAJOR} OPTIONAL_COMPONENTS SerialPort)

    target_link_libraries(${PROJECT_NAME} PRIVATE
        Qt::SerialPort
    )

    set(f "${CMAKE_CURRENT_SOURCE_DIR}/platforms/macos/niliBOX.entitlements")
    set_source_files_properties(${f} PROPERTIES MACOSX_PACKAGE_LOCATION "")
    target_sources(${PROJECT_NAME} PRIVATE ${f})

    set(f "${CMAKE_CURRENT_SOURCE_DIR}/platforms/macos/icon.icns")
    set_source_files_properties(${f} PROPERTIES MACOSX_PACKAGE_LOCATION "Resources")
    target_sources(${PROJECT_NAME} PRIVATE ${f})

    set_target_properties(${PROJECT_NAME} PROPERTIES
        MACOSX_BUNDLE TRUE
        MACOSX_BUNDLE_INFO_PLIST "${CMAKE_CURRENT_SOURCE_DIR}/platforms/macos/Info.plist"
    )

endif()

if(CMAKE_SYSTEM_NAME STREQUAL "Android")

    target_compile_definitions(${PROJECT_NAME} PRIVATE
        OS_ANDROID
        USB
    )

    set(QT_ANDROID_ABIS "arm64-v8a;armeabi-v7a")

    qt_policy(SET QTP0002 NEW)

    set_target_properties(${PROJECT_NAME} PROPERTIES
        QT_ANDROID_PACKAGE_SOURCE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/platforms/android/package"
        QT_ANDROID_VERSION_CODE ${YEAR}${MONTH}${DAY}
        QT_ANDROID_VERSION_NAME ${CMAKE_PROJECT_VERSION}
    )

    target_link_libraries(${PROJECT_NAME} PRIVATE
        "${CMAKE_CURRENT_SOURCE_DIR}/platforms/android/package/libs/${ANDROID_ABI}/libcrypto_3.so"
        "${CMAKE_CURRENT_SOURCE_DIR}/platforms/android/package/libs/${ANDROID_ABI}/libssl_3.so"
    )

    include_directories(source/liboboe/src source/liboboe/include)
    include_directories(platforms/android)

    file(GLOB_RECURSE OBOE_CPP source/liboboe/src/*cpp)
    target_sources(${PROJECT_NAME} PUBLIC ${OBOE_CPP})

    find_package(Java REQUIRED)
    include(UseJava)
    set(CMAKE_JAVA_INCLUDE_PATH ${ANDROID_SDK_ROOT}/platforms/android-34/android.jar)

    file(GLOB_RECURSE LIBUSBSERIAL_JAVA source/libusbserial/*.java)

    add_jar(libusbserial
        ${LIBUSBSERIAL_JAVA}
        INCLUDE_JARS "source/libusbserial/annotation-1.3.0.jar"
        OUTPUT_DIR "${CMAKE_CURRENT_BINARY_DIR}/android-build/libs"
    )

    add_jar(alib
        platforms/android/alib.java
        INCLUDE_JARS "${CMAKE_CURRENT_BINARY_DIR}/android-build/libs/libusbserial.jar"
        OUTPUT_DIR "${CMAKE_CURRENT_BINARY_DIR}/android-build/libs"
    )

endif()

if(CMAKE_SYSTEM_NAME STREQUAL "iOS")

    target_compile_definitions(${PROJECT_NAME} PRIVATE
        OS_IOS
    )

    target_sources(${PROJECT_NAME} PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/platforms/ios/iosid.mm
    )

    set_source_files_properties(${CMAKE_CURRENT_SOURCE_DIR}/platforms/ios/iosid.mm PROPERTIES
        COMPILE_FLAGS "-fobjc-arc"
    )

    set (f "${CMAKE_CURRENT_SOURCE_DIR}/platforms/ios/Assets.xcassets")
    target_sources(${PROJECT_NAME} PRIVATE ${f})
    set_source_files_properties(${f} PROPERTIES MACOSX_PACKAGE_LOCATION Resources)

    set(f "${CMAKE_CURRENT_SOURCE_DIR}/resources/icon.png")
    target_sources(${PROJECT_NAME} PRIVATE ${f})
    set_source_files_properties(${f} PROPERTIES MACOSX_PACKAGE_LOCATION "")

    set_target_properties(${PROJECT_NAME} PROPERTIES
        MACOSX_BUNDLE TRUE
        CXX_VISIBILITY_PRESET hidden
        XCODE_ATTRIBUTE_TARGETED_DEVICE_FAMILY "1,2"
        XCODE_ATTRIBUTE_PRODUCT_BUNDLE_IDENTIFIER "com.nilibox.${PROJECT_NAME}"
        XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_APPICON_NAME AppIcon
        QT_IOS_LAUNCH_SCREEN "${CMAKE_CURRENT_SOURCE_DIR}/platforms/ios/Launch.storyboard"
        MACOSX_BUNDLE_INFO_PLIST "${CMAKE_CURRENT_SOURCE_DIR}/platforms/ios/Info.plist"
        MACOSX_BUNDLE_GUI_IDENTIFIER com.nilibox.${PROJECT_NAME}
    )

endif()
