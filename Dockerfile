FROM node:13

RUN mkdir /app
WORKDIR /app
COPY . /app
RUN yarn
WORKDIR /app/packages/telepero-server
RUN yarn build

CMD ["node", "dist/index.js"]