@echo off
cd /d "%~dp0"
echo Starting Hugo server...
echo.
hugo server -D
pause