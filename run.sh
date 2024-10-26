#!/bin/bash

cd ./backend || exit 

echo "Activating Virtual Environment"
source ./venv/bin/activate

echo "Starting Flask Server"
python app.py &

cd ../frontend || exit 

echo "Starting Next.js app"
npm run dev &

echo "Startup successful"