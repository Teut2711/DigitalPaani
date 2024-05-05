# Use the official Node.js image as a base
FROM node:latest

# Set the working directory in the container
WORKDIR /digital-paani


# Copy the rest of the application files
COPY . .
# Install dependencies
RUN npm install

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]
