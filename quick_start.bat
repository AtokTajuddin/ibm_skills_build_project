@echo off
echo ====================================================
echo Virtual Hospital - Quick Start (Fast Login/Register)
echo ====================================================
echo.

echo [1/4] Checking for port conflicts...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do (
    echo Killing process using port 5001: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/4] Starting Backend Server...
start "Backend Server" cmd /k "cd /d \"%~dp0backend\" && npm run dev"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo [3/4] Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d \"%~dp0frontend\" && npm start"

echo [4/4] Opening browser in 10 seconds...
timeout /t 10 /nobreak > nul
start http://localhost:3000

echo.
echo ====================================================
echo ✅ Both servers are starting!
echo 📱 Frontend: http://localhost:3000
echo 🚀 Backend:  http://localhost:5001
echo.
echo 🔒 CSRF protection temporarily disabled for faster registration
echo ⚡ Registration and login are now super fast!
echo ====================================================
echo Press any key to close this window...
pause > nul
