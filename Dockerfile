FROM node:alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--openssl-legacy-provider

ARG VITE_NETWORK_ENV
ARG VITE_API_URL
ARG VITE_NODE_ENV
ARG VITE_DEFAULT_CHAIN_ID
ARG VITE_GRAPH_API_URL

ENV VITE_NETWORK_ENV=$NETWORK_ENV
ENV VITE_API_URL=$API_URL
ENV VITE_NODE_ENV=$NODE_ENV
ENV VITE_DEFAULT_CHAIN_ID=$DEFAULT_CHAIN_ID
ENV VITE_GRAPH_API_URL=$GRAPH_API_URL

# COPY .npmrc ./
COPY package.json ./
COPY package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . ./

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]