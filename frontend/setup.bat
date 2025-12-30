@echo off
echo ====================================
echo Cakes Frontend Setup Script (Windows)
echo ====================================
echo.

:: Check Node.js
echo [1/2] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

:: Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)
echo npm found!
echo.

:: Install dependencies
echo [2/2] Installing dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo To start the development server, run:
echo    npm run dev
echo.
echo The app will be available at http://localhost:5173
echo.
pause
