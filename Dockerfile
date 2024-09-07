### STAGE 1: Build ###
FROM node:16 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
RUN  chmod -R 777 /usr/share/nginx/html/*
##
##COPY nginx.conf /etc/nginx/nginx.conf
## 
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/Alux-Web /usr/share/nginx/html

EXPOSE 80:443
ENTRYPOINT nginx -g 'daemon off;'

