@echo off
title Start Crime Dashboard Applications

echo Starting Crime Dashboard Applications...

REM Start the Angular application
start "Angular Client" cmd /k "cd /d %~dp0client && npm start"

REM Start the Express API server
start "Express Server" cmd /k "cd /d %~dp0server && npm start"

REM Wait for a few seconds to ensure the Angular server starts
timeout /t 10

REM Open the Angular application in the default web browser
start "" "http://localhost:4200"

echo Applications started. You can close this window.