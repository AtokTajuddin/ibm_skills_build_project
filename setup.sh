#!/bin/bash

# Virtual Hospital Project Setup Script
echo "===================================================="
echo "Virtual Hospital Project Setup Script"
echo "===================================================="
echo ""

# Set working directory variables
BACKEND_DIR="$(pwd)/backend"
FRONTEND_DIR="$(pwd)/frontend"

echo "Setting up environment files..."

# Create backend .env file if it doesn't exist
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo "Creating backend .env file..."
    cat > "$BACKEND_DIR/.env" << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/virtual_hospital
JWT_SECRET=your_jwt_secret_$(openssl rand -hex 12)
FRONTEND_URL=http://localhost:3000
LLM_API_KEY=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
EOL
    echo "Backend .env file created successfully."
else
    echo "Backend .env file already exists."
fi

# Create frontend .env file if it doesn't exist
if [ ! -f "$FRONTEND_DIR/.env" ]; then
    echo "Creating frontend .env file..."
    cat > "$FRONTEND_DIR/.env" << EOL
REACT_APP_API_URL=http://localhost:5000/api
EOL
    echo "Frontend .env file created successfully."
else
    echo "Frontend .env file already exists."
fi

echo ""
echo "Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies."
    exit 1
fi

echo ""
echo "Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies."
    exit 1
fi

echo ""
echo "===================================================="
echo "Setup completed successfully!"
echo "===================================================="
echo ""
echo "To start the backend server:"
echo "cd \"$BACKEND_DIR\" && npm run dev"
echo ""
echo "To start the frontend development server:"
echo "cd \"$FRONTEND_DIR\" && npm start"
echo ""
echo "NOTE: Make sure MongoDB is running on your system"
echo "before starting the backend server."
echo "===================================================="
