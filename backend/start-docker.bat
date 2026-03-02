@echo off
REM Quick start script for IT FARM Backend with Docker

echo ========================================
echo IT FARM Backend - Docker Quick Start
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo WARNING: .env file not found
    echo Copying .env.example to .env...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env file with your MongoDB URI and SECRET_KEY
    echo Press any key after editing .env to continue...
    pause >nul
)

echo Starting backend with Docker Compose...
echo.

docker-compose up --build

echo.
echo Backend stopped.
pause
