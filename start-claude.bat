@echo off
chcp 65001 >nul
title Claude Code Research
cd /d "%~dp0"

echo ==========================================
echo      Claude Code Research Edition
echo ==========================================
echo.

REM Check if bun is installed
where bun >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Bun is not installed or not in PATH
    echo.
    echo Please install Bun first:
    echo   powershell -c "irm bun.sh/install.ps1 ^| iex"
    echo.
    echo Or visit: https://bun.sh/
    echo.
    pause
    exit /b 1
)

echo [INFO] Starting Claude Code...
echo [INFO] Working directory: %cd%
echo.

REM Run Claude Code
bun run src/entrypoints/cli.tsx

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Claude Code exited with error code %errorlevel%
    pause
)
