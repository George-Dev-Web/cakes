@echo off
echo Starting Cakes Frontend Development Server...
echo.

:: Check if node_modules exists
if not exist node_modules (
    echo ERROR: node_modules not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

echo Starting Vite development server on http://localhost:5173
echo Press Ctrl+C to stop the server
echo.
npm run dev
