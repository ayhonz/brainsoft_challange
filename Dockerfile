FROM node:21-alpine as builder
WORKDIR /build
COPY . .
RUN corepack enable
RUN yarn install --immutable
RUN yarn build

FROM node:21-alpine 
RUN apk update && apk add --no-cache dumb-init
ENV HOME=/home/app
ENV APP_HOME=$HOME/node

COPY --chown=node:node --from=builder /build/dist $APP_HOME/dist
COPY --chown=node:node --from=builder /build/node_modules $APP_HOME/node_modules

# set user to be the least priviledged
USER node

EXPOSE 8080
WORKDIR home/app/node

# use dunb-init to nut run the app as PID 1
ENTRYPOINT ["dumb-init"]
# using node to run the app istead of yarn so that signals are sent correcrtly 
CMD ["node", "dist/server.js"]
