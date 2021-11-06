FROM node:16-alpine as build
WORKDIR /app
COPY package.json . 
RUN npm install
COPY . .
ARG REACT_APP_EMAILJS_USER_ID
ARG REACT_APP_EMAILJS_SERVICE
ARG REACT_APP_EMAILJS_TEMPLATE_ID

ENV REACT_APP_EMAILJS_USER_ID=${REACT_APP_EMAILJS_USER_ID}
ENV REACT_APP_EMAILJS_SERVICE=${REACT_APP_EMAILJS_SERVICE}
ENV REACT_APP_EMAILJS_TEMPLATE_ID=${REACT_APP_EMAILJS_TEMPLATE_ID}

RUN npm run build

# FROM nginx
# COPY --from=build /app/build /usr/share/nginx/html

FROM caddy:2-alpine
COPY conf/Caddyfile /etc/Caddyfile
COPY --from=build /app/build /usr/share/caddy/html