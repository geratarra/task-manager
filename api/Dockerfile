# Stage 1: Build the API
FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build 

# Stage 2: Production
FROM node:lts-alpine AS production

WORKDIR /app

# Copy the compiled API files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/.env.production ./

# Install only production dependencies
RUN npm install --production

# Expose the API port (adjust if needed)
EXPOSE 3002

# Start the Node.js application
CMD ["node", "-r", "dotenv/config", "dist/app.js", "dotenv_config_path=/app/.env.production"]
