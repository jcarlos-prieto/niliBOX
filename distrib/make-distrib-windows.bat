:: Copyright (C) 2025 - Juan Carlos Prieto <nilibox@nilibox.com>
::
:: This program is free software: you can redistribute it and/or modify
:: it under the terms of the GNU General Public License as published by
:: the Free Software Foundation, either version 3 of the License, or
:: (at your option) any later version.
::
:: This program is distributed in the hope that it will be useful,
:: but WITHOUT ANY WARRANTY; without even the implied warranty of
:: MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
:: GNU General Public License for more details.
::
:: You should have received a copy of the GNU General Public License
:: along with this program. If not, see <https://www.gnu.org/licenses>.

@echo off

:: Path to the Qt location
set QTDIR=C:\Qt\6.7.3\mingw_64

:: Path to the generated release
set RLDIR=D:\DEVELOPMENT\niliBOX\niliBOX\build\Desktop-Release

:: Path to zip utility
set ZIP="C:\Program Files\7-Zip\7z.exe"

if not exist %QTDIR%\ (
    echo Qt not found
    exit /b
)
if not exist %RLDIR%\ (
    echo Generated release not found
    exit /b
)

echo Generating windows distribution

rmdir /s /q windows 2> nul
mkdir windows
xcopy %RLDIR%\niliBOX.exe windows > nul 2> nul
xcopy %QTDIR%\bin\lrelease.exe windows > nul 2> nul
xcopy %QTDIR%\bin\rcc.exe windows > nul 2> nul
%QTDIR%\bin\windeployqt6.exe --qmldir ..\resources windows\niliBOX.exe > nul 2> nul

echo Generating _downloads\niliBOX-windows.zip

mkdir _downloads 2> nul
ren windows niliBOX
%ZIP% a _downloads\niliBOX-windows.zip niliBOX > nul 2> nul
ren niliBOX windows
echo.