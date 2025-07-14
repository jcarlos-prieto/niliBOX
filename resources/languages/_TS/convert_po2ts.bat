@echo off

set QTDIR=C:\Qt\6.7.3\mingw_64

for %%f in (*.po) do (
    echo Converting %%f to %%~nf.ts
    %QTDIR%\bin\lconvert.exe -if po -of ts -o "%%~nf.ts" "%%f"
)