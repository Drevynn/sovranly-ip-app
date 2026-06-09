
# Use official Node.js image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app's code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port (Cloud Run defaults to 8080)
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
