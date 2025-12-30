@echo off
echo Starting Cakes Backend Server...
echo.

:: Check if virtual environment exists
if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

:: Activate virtual environment
call venv\Scripts\activate.bat

:: Check if .env exists
if not exist .env (
    echo WARNING: .env file not found!
    echo Please create .env file from .env.example
    pause
    exit /b 1
)

:: Start Flask app
echo Starting Flask application on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
python app.py

:: Deactivate on exit
deactivate
