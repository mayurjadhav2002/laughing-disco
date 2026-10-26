FROM node:20-alpine AS builder

WORKDIR /app

# dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# source and build
COPY . .
RUN npm run build

# serving static files with Nginx
FROM nginx:alpine

# copying built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]