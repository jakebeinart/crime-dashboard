#!/bin/bash
# Setup script for Crime Dashboard Project

echo "Checking for Node.js and npm installation..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js from https://nodejs.org/ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm from https://nodejs.org/ and try again."
    exit 1
fi

echo "Node.js and npm are installed."

echo "Setting up Crime Dashboard Project..."

# Navigate to client directory and install dependencies
echo "Installing dependencies for the Angular client..."
cd client
if [ -f "package.json" ]; then
    echo "Running npm install in the client directory..."
    npm install
else
    echo "package.json not found in the client directory!"
    exit 1
fi
cd ..

# Navigate to server directory and install dependencies
echo "Installing dependencies for the Express server..."
cd server
if [ -f "package.json" ]; then
    echo "Running npm install in the server directory..."
    npm install
else
    echo "package.json not found in the server directory!"
    exit 1
fi
cd ..

echo "All dependencies installed successfully."
echo "You can now run the start.sh script to start the applications."