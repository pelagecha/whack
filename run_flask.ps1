#!/usr/bin/env pwsh

Set-Location .\backend

Write-Host "Activating Virtual Environment"
.\venv\Scripts\Activate

Write-Host "Starting Flask Server"
python3.11 app.py