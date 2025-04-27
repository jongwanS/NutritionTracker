#!/bin/bash

# Build the application
echo "Starting build process..."

# Step 1: Build the frontend with Vite
echo "Building frontend with Vite..."
vite build

# Step 2: Build the backend with esbuild
echo "Building backend with esbuild..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Step 3: Prepare for Vercel deployment
echo "Preparing files for Vercel deployment..."

# Copy API handlers for serverless functions
mkdir -p dist/api
cp -r api/* dist/api/

# Copy static assets to dist folder
if [ -d "public" ]; then
  echo "Copying public assets..."
  cp -r public/* dist/
fi

# Create a fallback file for routes that don't match
cp public/redirect.html dist/404.html

# Make sure all static assets are correctly placed
echo "Ensuring static assets are in place..."

# Make sure the main index.html is in the root directory
if [ -f "dist/index.html" ]; then
  echo "index.html already exists in dist folder"
else
  echo "ERROR: index.html not found in dist folder!"
  exit 1
fi

echo "Build completed successfully!"
echo "Files ready for Vercel deployment in the 'dist' directory"