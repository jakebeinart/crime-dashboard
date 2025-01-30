@echo off
title Setup Crime Dashboard Project

echo Checking for Node.js and npm installation...

REM Check if Node.js is installed
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/ and try again.
    exit /b 1
)

REM Check if npm is installed
npm -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo npm is not installed. Please install npm from https://nodejs.org/ and try again.
    exit /b 1
)

echo Node.js and npm are installed.

echo Setting up Crime Dashboard Project...

REM Navigate to the client directory and install dependencies
echo Installing dependencies for the Angular client...
cd client
if exist package.json (
    echo Running npm install in the client directory...
    npm install
) else (
    echo package.json not found in the client directory!
    exit /b 1
)
cd ..

REM Navigate to the server directory and install dependencies
echo Installing dependencies for the Express server...
cd server
if exist package.json (
    echo Running npm install in the server directory...
    npm install
) else (
    echo package.json not found in the server directory!
    exit /b 1
)
cd ..

echo All dependencies installed successfully.
echo You can now run the start-apps.bat script to start the applications.
pause