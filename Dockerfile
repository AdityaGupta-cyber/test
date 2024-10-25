# Use the official Node.js image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Clear npm cache and remove any existing installations
RUN npm cache clean --force
RUN rm -rf node_modules package-lock.json

# Set environment variable to include optional dependencies
ENV NPM_CONFIG_PRODUCTION=false

# Install all dependencies, including optional ones
RUN npm install --include=optional

# Install sharp for Linux architecture
RUN npm install --os=linux --cpu=x64 sharp

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
