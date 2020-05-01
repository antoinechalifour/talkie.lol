FROM node:13

RUN mkdir /app
WORKDIR /app
COPY . /app
RUN yarn install --network-timeout 300000
WORKDIR /app/packages/server
RUN yarn build

CMD ["node", "dist/index.js"]