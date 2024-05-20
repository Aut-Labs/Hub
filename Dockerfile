FROM node:latest as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--openssl-legacy-provider

ARG ENV_FILE
ENV ENV_FILE=${ENV_FILE}

# COPY .npmrc ./
COPY package.json ./
COPY package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . ./
COPY ${ENV_FILE} .env

RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]