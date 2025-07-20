@echo off
echo ====================================================
echo Virtual Hospital Project Setup Script
echo ====================================================
echo.

rem Set working directory variables
set BACKEND_DIR=%~dp0backend
set FRONTEND_DIR=%~dp0frontend

echo Setting up environment files...

rem Create backend .env file if it doesn't exist
if not exist "%BACKEND_DIR%\.env" (
    echo Creating backend .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/virtual_hospital
        echo JWT_SECRET=your_jwt_secret_%RANDOM%%RANDOM%
        echo FRONTEND_URL=http://localhost:3000
        echo LLM_API_KEY=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
    ) > "%BACKEND_DIR%\.env"
    echo Backend .env file created successfully.
) else (
    echo Backend .env file already exists.
)

rem Create frontend .env file if it doesn't exist
if not exist "%FRONTEND_DIR%\.env" (
    echo Creating frontend .env file...
    (
        echo REACT_APP_API_URL=http://localhost:5000/api
    ) > "%FRONTEND_DIR%\.env"
    echo Frontend .env file created successfully.
) else (
    echo Frontend .env file already exists.
)

echo.
echo Installing backend dependencies...
cd /d "%BACKEND_DIR%"
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies.
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd /d "%FRONTEND_DIR%"
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies.
    exit /b 1
)

echo.
echo ====================================================
echo Setup completed successfully!
echo ====================================================
echo.
echo To start the backend server:
echo cd "%BACKEND_DIR%" ^&^& npm run dev
echo.
echo To start the frontend development server:
echo cd "%FRONTEND_DIR%" ^&^& npm start
echo.
echo NOTE: Make sure MongoDB is running on your system
echo before starting the backend server.
echo ====================================================
