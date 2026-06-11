# Step 1: Use an official lightweight Node.js base image
FROM node:20-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package files first to optimize Docker layer caching
COPY package*.json ./

# Step 4: Install the project dependencies (like swagger-tools and js-yaml)
RUN npm install --only=production

# Step 5: Copy the rest of your application code (including index.js, controllers, api/)
COPY . .

# Step 6: Expose port 8080 so traffic can reach your app inside the container
EXPOSE 8080

# Step 7: Define the command to start your application
CMD [ "node", "index.js" ]

