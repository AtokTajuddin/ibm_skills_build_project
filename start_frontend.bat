@echo off
echo ====================================================
echo Virtual Hospital Frontend - Startup Script
echo ====================================================
echo.

cd /d "%~dp0frontend"

echo Checking for .env file...
if not exist ".env" (
    echo Creating frontend .env file...
    (
        echo REACT_APP_API_URL=http://localhost:5001/api
    ) > .env
    echo Frontend .env file created successfully.
) else (
    echo Frontend .env file already exists.
)

echo Installing frontend dependencies...
call npm install

echo.
echo Starting frontend development server...
call npm start

echo.
echo If the browser does not open automatically, 
echo please navigate to http://localhost:3000
echo.
echo ====================================================
