# base image
FROM node:20-slim

# set working directory
WORKDIR /app

# copy requirements and install
COPY package*.json ./
RUN npm install --omit=dev

# COPY auth-service backend code
COPY . .

# Expose app port
EXPOSE 4000

# run Auth Service
CMD ["node", "index.js"]

