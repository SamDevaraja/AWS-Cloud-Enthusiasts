FROM node:18-alpine

WORKDIR /app

# Copy dependency configs
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application files
COPY . .

# Create exports folder inside container
RUN mkdir -p exports

EXPOSE 5000

# Start application
CMD ["npm", "start"]
