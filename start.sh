#!/bin/bash

# Virtual Hospital Project Startup Script
echo "===================================================="
echo "Virtual Hospital Project Startup Script"
echo "===================================================="
echo ""

echo "Running database setup script..."
node setup.js

echo ""
echo "Starting MongoDB (if installed and not already running)..."
if command -v mongod &> /dev/null; then
    mongod --fork --logpath /tmp/mongodb.log || echo "MongoDB already running or could not be started"
else
    echo "MongoDB not found. Make sure it's installed and in your PATH."
fi

echo ""
echo "Starting backend server..."
cd "$(pwd)/backend"
gnome-terminal -- bash -c "npm run dev; exec bash" || \
xterm -e "npm run dev; exec bash" || \
terminator -e "npm run dev; exec bash" || \
konsole -e "npm run dev; exec bash" || \
echo "Could not open terminal. Please run 'cd backend && npm run dev' manually."

echo ""
echo "Starting frontend development server..."
cd "$(pwd)/frontend"
gnome-terminal -- bash -c "npm start; exec bash" || \
xterm -e "npm start; exec bash" || \
terminator -e "npm start; exec bash" || \
konsole -e "npm start; exec bash" || \
echo "Could not open terminal. Please run 'cd frontend && npm start' manually."

echo ""
echo "===================================================="
echo "Servers should be starting now!"
echo "===================================================="
echo "Backend running at: http://localhost:5000"
echo "Frontend running at: http://localhost:3000"
echo "===================================================="
