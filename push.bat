@echo off
cd /d "%~dp0"
echo Push to GitHub...
echo.
git add content/posts/*.md
git add push.bat
git commit -m "update: sync articles"
git push origin main
echo.
echo Done!
pause