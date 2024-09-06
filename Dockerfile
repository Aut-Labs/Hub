FROM node:alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--openssl-legacy-provider

ARG REACT_APP_NETWORK_ENV
ARG REACT_APP_API_URL
ARG REACT_APP_NODE_ENV
ARG REACT_APP_DEFAULT_CHAIN_ID
ARG REACT_APP_GRAPH_API_URL

ENV REACT_APP_NETWORK_ENV=$REACT_APP_NETWORK_ENV
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_NODE_ENV=$REACT_APP_NODE_ENV
ENV REACT_APP_DEFAULT_CHAIN_ID=$REACT_APP_DEFAULT_CHAIN_ID
ENV REACT_APP_GRAPH_API_URL=$REACT_APP_GRAPH_API_URL

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