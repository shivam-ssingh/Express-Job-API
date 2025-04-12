# Use an official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Command to run the app
CMD ["node", "src/app.js"]
