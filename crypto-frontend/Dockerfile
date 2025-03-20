# Stage 1: Build the Angular app
FROM node:22 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . ./
RUN npm run build --configuration=production

# Stage 2: Serve the built app with Nginx
FROM nginx:latest

COPY --from=build /app/dist/crypto-frontend /usr/share/nginx/html

# Remove default Nginx config and use a custom one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
