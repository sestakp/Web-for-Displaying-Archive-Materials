# Use an official Node.js LTS (Long Term Support) image as a base image
FROM node:lts-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code to the container
COPY . .

# Build the TypeScript code

RUN npm install react-app-rewired sass

RUN npm run build

# Use a smaller image for production (e.g., nginx)
FROM nginx:alpine

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration to serve SPA
#COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built files from the builder stage to the nginx web root directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose the port that nginx will use at runtime
EXPOSE 80
EXPOSE 443

# Install Certbot and nginx plugin
#RUN apk add --no-cache certbot certbot-nginx

#RUN certbot --nginx --non-interactive --agree-tos --email xsesta07@vutbr.cz -d perun.fit.vutbr.cz


# Start nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]