@echo off
echo ====================================
echo Cakes Backend Setup Script (Windows)
echo ====================================
echo.

:: Check Python
echo [1/6] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)
echo Python found!
echo.

:: Create virtual environment
echo [2/6] Creating virtual environment...
if exist venv (
    echo Virtual environment already exists, skipping...
) else (
    python -m venv venv
    echo Virtual environment created!
)
echo.

:: Activate virtual environment
echo [3/6] Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)
echo.

:: Upgrade pip
echo [4/6] Upgrading pip...
python -m pip install --upgrade pip --quiet
echo.

:: Install dependencies
echo [5/6] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed!
echo.

:: Setup .env file
echo [6/6] Setting up environment file...
if exist .env (
    echo .env file already exists
    echo Please review and update if needed
) else (
    if exist .env.example (
        copy .env.example .env
        echo .env file created from .env.example
        echo IMPORTANT: Edit .env file with your database credentials!
    ) else (
        echo WARNING: .env.example not found
        echo Please create .env file manually
    )
)
echo.

echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Edit .env file with your database credentials
echo 2. Make sure PostgreSQL is running
echo 3. Create database: psql -U postgres -c "CREATE DATABASE cake_db;"
echo 4. Run migrations: flask db upgrade
echo 5. (Optional) Seed database: python seed.py
echo 6. Start server: python app.py
echo.
echo To activate the virtual environment later, run:
echo    venv\Scripts\activate
echo.
pause
