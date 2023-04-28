# Use an official Node.js runtime as a parent image
FROM node:slim

ENV NODE_ENV=production

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

COPY /server/smallsudoku.txt /app

# Install any needed packages specified in package.json
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run app.js when the container launches
CMD ["node", "server/server.js"]