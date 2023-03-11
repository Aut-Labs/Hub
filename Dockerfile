FROM node:alpine as builder


WORKDIR /usr/app

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN apk --update --no-cache \
    add  \
    automake \
    g++ \
    make \
    bash \
    git \
    alpine-sdk  \
    nasm  \
    autoconf  \
    build-base \
    zlib \
    zlib-dev \
    libpng \
    libpng-dev\
    libwebp \
    libwebp-dev \
    libjpeg-turbo \
    libjpeg-turbo-dev \
    &&  rm -fr /var/cache/apk/*

COPY .npmrc ./
COPY ./package*.json ./

RUN npm install --global pm2
RUN npm install --force

COPY ./ ./

RUN npm run build
RUN chmod -R 777 /usr/app
# PORT 3000 is used internally by nginx (see /nginx/default.conf)
EXPOSE 3000
USER node

# Launch app with PM2
CMD [ "pm2-runtime", "start", "npm", "--", "start" ]