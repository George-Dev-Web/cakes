@echo off
echo ========================================
echo DATABASE FIX SCRIPT (WINDOWS)
echo ========================================
echo.
echo This script will fix migration issues without losing data.
echo.

echo [1/7] Activating virtual environment...
if not exist venv (
    echo ERROR: Virtual environment not found. Run setup.bat first!
    pause
    exit /b 1
)
call venv\Scripts\activate.bat

echo.
echo [2/7] Installing python-dotenv (for .env support)...
pip install python-dotenv --quiet

echo.
echo [3/7] Backing up current database...
set BACKUP_FILE=backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
set BACKUP_FILE=%BACKUP_FILE: =0%
pg_dump -U postgres -d cake_db > %BACKUP_FILE% 2>nul
if errorlevel 1 (
    echo WARNING: Backup failed or database doesn't exist
) else (
    echo Backup saved as %BACKUP_FILE%
)

echo.
echo [4/7] Checking migration state...
flask db current

echo.
echo [5/7] Removing conflicting migration files...
if exist migrations\versions\db8a2f933691_initial_postgresql_setup.py (
    del migrations\versions\db8a2f933691_initial_postgresql_setup.py
    echo Removed: db8a2f933691_initial_postgresql_setup.py
)

if exist migrations\versions\e531fd834bc8_increase_password_hash_length_to_255.py (
    del migrations\versions\e531fd834bc8_increase_password_hash_length_to_255.py
    echo Removed: e531fd834bc8_increase_password_hash_length_to_255.py
)

echo.
echo [6/7] Creating fresh migration...
flask db migrate -m "Fresh migration with all models"
if errorlevel 1 (
    echo ERROR: Migration creation failed
    echo Check the error message above
    pause
    exit /b 1
)

echo.
echo [7/7] Applying migration...
flask db upgrade
if errorlevel 1 (
    echo ERROR: Migration failed
    echo.
    echo If you see "relation does not exist" errors:
    echo Run reset_database.bat instead for a clean start
    pause
    exit /b 1
)

echo.
echo ========================================
echo DATABASE FIX COMPLETE!
echo ========================================
echo.
pause
