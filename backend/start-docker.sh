#!/bin/bash
# Quick start script for IT FARM Backend with Docker

echo "========================================"
echo "IT FARM Backend - Docker Quick Start"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed or not in PATH"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "WARNING: .env file not found"
    echo "Copying .env.example to .env..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Please edit .env file with your MongoDB URI and SECRET_KEY"
    echo "Press Enter after editing .env to continue..."
    read
fi

echo "Starting backend with Docker Compose..."
echo ""

docker-compose up --build

echo ""
echo "Backend stopped."
