@echo off
title Cakes Project Starter
color 0A
echo ========================================
echo     CAKES PROJECT - WINDOWS STARTER
echo ========================================
echo.
echo This will start both backend and frontend
echo in separate windows.
echo.
echo Make sure you have:
echo   [x] Run setup.bat in backend folder
echo   [x] Run setup.bat in frontend folder
echo   [x] PostgreSQL is running
echo   [x] Created cake_db database
echo   [x] Configured .env file
echo.
pause

:: Start backend in new window
echo Starting backend...
start "Cakes Backend" cmd /k "cd backend && venv\Scripts\activate && python app.py"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend in new window
echo Starting frontend...
start "Cakes Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Both servers starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Close those windows to stop the servers.
echo.
pause
