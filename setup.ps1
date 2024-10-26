#!/usr/bin/env pwsh

# Check if the backend virtual environment exists and make it if not
$backendVenvPath = ".\backend\venv"
if (!(Test-Path $backendVenvPath)) {
    Write-Host "Creating virtual environment in backend folder..."
    python -m venv $backendVenvPath
} else {
    Write-Host "Virtual environment already exists."
}

# Check if requirements.txt exists and install dependencies
$requirementsPath = ".\requirements.txt"
if (Test-Path $requirementsPath) {
    Write-Host "Installing backend dependencies from requirements.txt..."
    pip install -r $requirementsPath
} else {
    Write-Host "requirements.txt not found in the backend folder."
}

# Check if the frontend node_modules directory exists and install dependencies if it doesn't
$frontendPath = ".\frontend"
$nodeModulesPath = "$frontendPath\node_modules"
if (!(Test-Path $nodeModulesPath)) {
    Write-Host "Installing frontend dependencies..."
    Set-Location $frontendPath
    npm install
    Set-Location ..
} else {
    Write-Host "Frontend dependencies are already installed."
}

Write-Host "Setup Complete."