@echo off
echo ====================================================
echo Virtual Hospital Project Startup Script
echo ====================================================
echo.

echo Running database setup script...
node setup.js

echo.
echo Starting MongoDB (if not already running)...
net start MongoDB || echo MongoDB service not found or already running.

echo.
echo Starting backend server...
start cmd /k "cd /d f:\projek_rumah sakit_virtual\backend && npm run dev"

echo.
echo Starting frontend development server...
start cmd /k "cd /d f:\projek_rumah sakit_virtual\frontend && npm start"

echo.
echo ====================================================
echo Servers started!
echo ====================================================
echo Backend running at: http://localhost:5000
echo Frontend running at: http://localhost:3000
echo ====================================================
