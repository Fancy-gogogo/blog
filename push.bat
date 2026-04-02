@echo off
cd /d "%~dp0"
echo Push to GitHub...
echo.
git add -A
git commit -m "update: sync articles"
git push origin main
echo.
echo Done!
pause