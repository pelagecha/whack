#!/bin/bash

# Set paths
backend_venv_path="./backend/venv"
requirements_path="./requirements.txt"
frontend_path="./frontend"

# Check and create virtual environment if it doesn’t exist
if [ ! -d "$backend_venv_path" ]; then
    echo "Creating virtual environment in backend folder..."
    python3 -m venv "$backend_venv_path"
fi

# Install Python dependencies
if [ -f "$requirements_path" ]; then
    pip install -r "$requirements_path"
else
    echo "No requirements.txt found!"
fi

# Install frontend dependencies
if [ -d "$frontend_path" ]; then
    cd "$frontend_path"
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    else
        echo "Frontend dependencies already installed."
    fi
    cd ..
fi

echo "Setup complete. Running app..."

./run.sh