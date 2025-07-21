#!/bin/bash

# Make sure the frontend/public directory exists
mkdir -p frontend/public

# Copy index.html from frontend to frontend/public
cp frontend/public/index.html frontend/public/

echo "Copied index.html to frontend/public successfully"
