# Use official Node.js image with specific version pinning for reproducibility
FROM node:18.19-slim as builder

# Set working directory
WORKDIR /app

# Install dependencies for build stage
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of your app's code
COPY . .

# Build the Next.js app
RUN npm run build

# Production stage - minimal image
FROM node:18.19-slim

WORKDIR /app

# Copy only built artifacts and node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Create non-root user for Zero Trust compliance
RUN useradd -m -u 1000 nextjs && chown -R nextjs:nextjs /app
USER nextjs

# Expose the port (Cloud Run defaults to 8080)
EXPOSE 8080

# Health check for orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["npm", "start"]
