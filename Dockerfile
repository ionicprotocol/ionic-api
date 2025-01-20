# Use node alpine image as the base image
FROM node:alpine
# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install dependencies
RUN npm install  
RUN npm run build 


# Copy the env file
COPY .env .

# # Copy the env.txt file
# COPY env.txt ./

# # Create .env file and copy its content from env.txt
# RUN touch .env && \
#     cat env.txt > .env

# Copy the rest of the application files
COPY . .

# Expose port 3000 (assuming your application runs on this port)
EXPOSE 3000

# Command to run the application
CMD ["npm", "run" , "dev"]
