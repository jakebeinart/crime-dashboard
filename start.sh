#!/bin/bash
# Start Crime Dashboard Applications

echo "Starting Crime Dashboard Applications..."

# Start the Angular application with analytics settings preset
echo "Starting Angular client..."
cd client
export NG_CLI_ANALYTICS=false  # Prevent analytics prompt
npm start &
cd ..

# Start the Express API server
echo "Starting Express server..."
cd server
npm start &

# Wait for servers to start
echo "Waiting for servers to start..."
sleep 10

# Open the Angular application in the default browser
echo "Opening application in browser..."
open http://localhost:4200

# Keep script running and show user how to stop
echo "Applications started. Press Ctrl+C to stop all servers."
wait