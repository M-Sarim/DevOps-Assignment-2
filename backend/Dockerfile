# Stage 1: Build
# Use Node.js 20.15 on Alpine Linux as the base image for the build stage
FROM node:20.15-alpine AS build
# Set the working directory inside the container to /src
WORKDIR /src
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install dependencies specified in the package.json
RUN npm install
# Copy all files to the working directory in the container
COPY . .
# Build the project using the npm build script
RUN npm run build

# Stage 2: Deploy
# Use Node.js 20.15 on Alpine Linux as the base image for the deployment stage
FROM node:20.15-alpine as server
# Set the working directory inside the container to /app
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install only the production dependencies, omitting the dev dependencies
RUN npm install --omit=dev
# Copy the built files from the build stage to the /app directory
COPY --from=build /src/dist /app/
# Expose port 9000 to allow HTTP traffic
EXPOSE 9000
# Start the Node.js application using app.js as the entry point
CMD ["node", "app.js"]
