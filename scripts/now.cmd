@echo off
REM ============================================================
REM qtvue now — cmd.exe wrapper
REM Allows `now "text" mood category` from any command prompt
REM once scripts\ is on your PATH.
REM ============================================================

setlocal
set "SCRIPT_DIR=%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%now.ps1" %*
endlocal & exit /b %ERRORLEVEL%