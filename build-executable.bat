@echo off
chcp 65001 >nul
title Build Claude Code Executable
cd /d "%~dp0"

echo ==========================================
echo    Building Claude Code Executable
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
    pause
    exit /b 1
)

echo [INFO] Installing dependencies...
bun install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [INFO] Building executable...
echo.

REM Build standalone executable with bun
bun build src/entrypoints/cli.tsx --compile --outfile=claude-code.exe

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed
    echo.
    echo Trying alternative build method...
    echo.
    bun build src/entrypoints/cli.tsx --outdir=dist --target=bun --sourcemap
    if %errorlevel% neq 0 (
        echo [ERROR] Alternative build also failed
        pause
        exit /b 1
    )
    echo [INFO] Build completed to dist/ folder
    echo [INFO] Run with: bun run dist/cli.js
) else (
    echo.
    echo [SUCCESS] Build completed!
    echo [INFO] Executable: claude-code.exe
    echo.
    echo You can now run Claude Code by double-clicking claude-code.exe
)

echo.
pause
