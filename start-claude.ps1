#!/usr/bin/env pwsh
#Requires -Version 5.1

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "Claude Code Research"

Set-Location $PSScriptRoot

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "      Claude Code Research Edition" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if bun is installed
$bunPath = Get-Command bun -ErrorAction SilentlyContinue
if (-not $bunPath) {
    Write-Host "[ERROR] Bun is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Bun first:"
    Write-Host "  powershell -c `"irm bun.sh/install.ps1 | iex`"" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or visit: https://bun.sh/"
    Write-Host ""
    Write-Host "Press any key to continue..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "[INFO] Bun found at: $($bunPath.Source)" -ForegroundColor Green
Write-Host "[INFO] Working directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""
Write-Host "[INFO] Starting Claude Code..." -ForegroundColor Cyan
Write-Host ""

try {
    bun run src/entrypoints/cli.tsx

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "[ERROR] Claude Code exited with error code $LASTEXITCODE" -ForegroundColor Red
        Write-Host "Press any key to continue..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
} catch {
    Write-Host ""
    Write-Host "[ERROR] An error occurred: $_" -ForegroundColor Red
    Write-Host "Press any key to continue..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
