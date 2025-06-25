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

setlocal enabledelayedexpansion

set QTDIR=C:\Qt\6.7.3\mingw_64
set SED=c:\msys64\usr\bin\sed.exe

set "DRIVERS=DIGIMODES DRIVERTEST ICOM_IC-PCR100 ICOM_IC-PCR1000 ICOM_IC-PCR1500 PLAYAUDIO RELAY REMOTEAUDIO RTL2832U-SDR SDRPLAY-RSP1A WEBCAM"
set "LANGS=en es fr nl it de"
set "THEMES=steel ocean colors dark"

del /s *.rcc > nul

:: COMPILE LOCALIZATION FOR MAIN APPLICATION
for %%d in (%LANGS%) do (
	echo languages\%%d\trans.qm
	%QTDIR%\bin\lrelease.exe languages\_TS\%%d.ts -qm languages\%%d\trans.qm 1>nul 2>nul
)

:: COMPILE LANGUAGE RESOURCE FILES FOR MAIN APPLICATION
for %%d in (%LANGS%) do (
	echo languages\%%d.rcc
	%QTDIR%\bin\rcc.exe --binary --compress 9 --compress-algo zlib languages\%%d\collection.qrc --output languages\%%d.rcc 1>nul 2>nul
)

:: COMPILE THEME RESOURCE FILES FOR MAIN APLICATION
for %%d in (%THEMES%) do (
	echo themes\%%d.rcc
	%QTDIR%\bin\rcc.exe --binary --compress 9 --compress-algo zlib themes\%%d\collection.qrc --output themes\%%d.rcc 1>nul 2>nul
)

for %%d in (%DRIVERS%) do (
	:: COMPILE LOCALIZATION FOR STANDARD DRIVERS
	for %%e in (%LANGS%) do (
		echo drivers\%%d\client\languages\%%e\trans.qm
		%QTDIR%\bin\lrelease.exe languages\_TS\%%d_client_%%e.ts -qm drivers\%%d\client\languages\%%e\trans.qm 1>nul 2>nul
		echo drivers\%%d\config\languages\%%e\trans.qm
		%QTDIR%\bin\lrelease.exe languages\_TS\%%d_config_%%e.ts -qm drivers\%%d\config\languages\%%e\trans.qm 1>nul 2>nul
	)

	:: COMPILE DRIVER RESOURCE FILES FOR STANDARD DRIVERS
	echo drivers\%%d\config.rcc
	echo drivers\%%d\client.rcc
	echo drivers\%%d\server.rcc
	echo drivers\%%d.rcc
	
	%QTDIR%\bin\rcc.exe --binary --compress 9 --compress-algo zlib drivers\%%d\config\collection.qrc --output drivers\%%d\config.rcc 1>nul 2>nul
	%QTDIR%\bin\rcc.exe --binary --compress 9 --compress-algo zlib drivers\%%d\client\collection.qrc --output drivers\%%d\client.rcc 1>nul 2>nul
	%QTDIR%\bin\rcc.exe --binary --compress 9 --compress-algo zlib drivers\%%d\server\collection.qrc --output drivers\%%d\server.rcc 1>nul 2>nul
	%QTDIR%\bin\rcc.exe --binary --compress 9 --compress-algo zlib drivers\%%d\collection.qrc --output drivers\%%d.rcc 1>nul 2>nul
)

for /f "tokens=1-3 delims=/" %%a in ("%DATE%") do (
    set "d=%%c.%%b.%%a"
)
for %%f in (*.set) do (
    %SED% -i -e "s/^\(.*\.version=\).*/\1%d%/" %%f
)

powershell -Command "Invoke-WebRequest -Uri 'http://www.linux-usb.org/usb.ids' -outFile 'usb.ids'"