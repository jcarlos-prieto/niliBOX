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

set QTDIR=C:\Qt\6.7.3\mingw_64
set SED=c:\msys64\usr\bin\sed.exe

set "DRIVERS=DIGIMODES DRIVERTEST ICOM_IC-PCR100 ICOM_IC-PCR1000 ICOM_IC-PCR1500 PLAYAUDIO RELAY REMOTEAUDIO RTL2832U-SDR SDRPLAY-RSP1A WEBCAM"
set "LANGS=es fr nl it de"

:: LOCALIZATION FOR MAIN APPLICATION
for %%d in (%LANGS%) do (
	echo .. %%d
	%QTDIR%\bin\lupdate.exe -no-obsolete -locations none -target-language %%d .. -ts languages\_TS\%%d.ts 1> nul 2>nul
)

:: LOCALIZATION FOR STANDARD DRIVERS
for %%d in (%DRIVERS%) do (
	for %%e in (%LANGS%) do (
      echo drivers\%%d\client %%e
      for %%f in (drivers\%%d\client\*.qml) do %SED% -i -e "s/b_translate/qsTr/g" %%f
      %QTDIR%\bin\lupdate.exe drivers\%%d\client -no-obsolete -locations none -target-language %%e -ts languages\_TS\%%d_client_%%e.ts 1>nul 2>nul
      for %%f in (drivers\%%d\client\*.qml) do %SED% -i -e "s/qsTr/b_translate/g" %%f

      echo drivers\%%d\config %%e
      for %%f in (drivers\%%d\config\*.qml) do %SED% -i -e "s/b_translate/qsTr/g" %%f
      %QTDIR%\bin\lupdate.exe drivers\%%d\config -no-obsolete -locations none -target-language %%e -ts languages\_TS\%%d_config_%%e.ts 1>nul 2>nul
      for %%f in (drivers\%%d\config\*.qml) do %SED% -i -e "s/qsTr/b_translate/g" %%f
	)
)

