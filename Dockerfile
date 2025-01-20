FROM node:20.17.1-alpine AS builder

LABEL AUTHOR=congvudev@gmail.com

WORKDIR /app

RUN apk --no-cache add \
    g++ make python3 git \
    && yarn global add node-gyp \
    && rm -rf /var/cache/apk/*

ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile

ADD . /app
RUN yarn build
RUN yarn --pure-lockfile --prod

FROM node:14-alpine3.12

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /app

RUN apk --no-cache add curl && rm -rf /var/cache/apk/*

COPY --from=builder /app .

CMD ["npm", "run", "docker:start"]