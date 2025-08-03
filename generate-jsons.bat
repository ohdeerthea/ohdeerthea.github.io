@echo off
echo 📄 Generating JSON files from your images...
echo.

REM Check if PowerShell script exists
if not exist "manage-gallery.ps1" (
    echo Error: manage-gallery.ps1 not found!
    pause
    exit /b 1
)

REM Generate JSON files for all characters
powershell -ExecutionPolicy Bypass -File "manage-gallery.ps1" -Action generate

echo.
echo ✅ Done! JSON files have been created/updated in the data/ folder.
echo You can now view your gallery by opening index.html
echo.
pause
