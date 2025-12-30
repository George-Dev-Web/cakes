@echo off
echo ========================================
echo DATABASE RESET SCRIPT (WINDOWS)
echo ========================================
echo.
echo WARNING: This will delete ALL data in your database!
echo.
set /p confirm="Are you sure you want to continue? (yes/no): "
if /i not "%confirm%"=="yes" (
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo [1/5] Backing up current database...
set BACKUP_FILE=backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
set BACKUP_FILE=%BACKUP_FILE: =0%
pg_dump -U postgres -d cake_db > %BACKUP_FILE% 2>nul
if errorlevel 1 (
    echo No existing database to backup or backup failed
) else (
    echo Backup saved as %BACKUP_FILE%
)

echo.
echo [2/5] Dropping existing database...
psql -U postgres -c "DROP DATABASE IF EXISTS cake_db;"
if errorlevel 1 (
    echo ERROR: Failed to drop database. Make sure PostgreSQL is running.
    pause
    exit /b 1
)
echo Database dropped!

echo.
echo [3/5] Creating fresh database...
psql -U postgres -c "CREATE DATABASE cake_db;"
if errorlevel 1 (
    echo ERROR: Failed to create database
    pause
    exit /b 1
)
echo Database created!

echo.
echo [4/5] Activating virtual environment...
if not exist venv (
    echo ERROR: Virtual environment not found. Run setup.bat first!
    pause
    exit /b 1
)
call venv\Scripts\activate.bat

echo.
echo [5/5] Running migrations...
flask db upgrade
if errorlevel 1 (
    echo ERROR: Migration failed!
    echo Check the error message above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo DATABASE RESET COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Run: python seed.py (to add sample data)
echo 2. Or create your own data through the application
echo.
pause
