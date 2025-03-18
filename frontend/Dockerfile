# frontend/Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Копируем наш nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
