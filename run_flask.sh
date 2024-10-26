#!/bin/bash

cd ./backend || exit 

echo "Activating Virtual Environment"
source ./venv/bin/activate

echo "Starting Flask Server"
python app.py &