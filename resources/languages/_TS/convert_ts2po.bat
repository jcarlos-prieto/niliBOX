@echo off

set QTDIR=C:\Qt\6.7.3\mingw_64

for %%f in (*.ts) do (
    echo Converting %%f to %%~nf.po
    %QTDIR%\bin\lconvert.exe -if ts -of po -o "%%~nf.po" "%%f"
)