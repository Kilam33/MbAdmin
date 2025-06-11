# Use official Node.js image as base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json if you have it)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app’s source code
COPY . .

# Build the TypeScript and Vite assets
RUN npm run build

# Expose port 4173 (Vite's default dev server port, you can change this if needed)
EXPOSE 4173

# Command to start the app (in production mode)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
