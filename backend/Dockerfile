# Use Node.js LTS version
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
