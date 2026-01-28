# base image - node as build. build referenced later in code
FROM node:20-slim AS build

# set working directory
WORKDIR /app

# copy requirements and install
COPY package*.json ./
RUN npm install

# COPY app source code
COPY . .

# build react app
RUN npm run build

# get image for web server Nginx for static files
FROM nginx:alpine

# Copy build files from previous stage to NGINX HTML file path
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config for API proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx port - default 80 for http
EXPOSE 80

# start Nginx service
CMD ["nginx", "-g", "daemon off;"]