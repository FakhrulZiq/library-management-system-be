# Use Node.js base image
FROM node:20.16.0-bullseye

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the NestJS app
RUN npm run build

# Start the app
CMD ["npm", "run", "start:prod"]
