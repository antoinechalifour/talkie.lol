# WebRTC Experiments

- 👨‍💻 A [demo](http://webrtc-experiments.netlify.com/) is available on Netlify
- 💻 The [signaling server](https://webrtc-experiments.herokuapp.com/graphql) is hosted on Heroku (this project is on a free plan so it might take quite some time to wake the servers).

## Description

This app is a side-project for experimenting with WebRTC. I am planning on integrating as many features as possible, such as :

- audio sharing
- video sharing
- screen sharing
- filters on videos
- volume controls
- ... and so on

The backlog can be found [here](https://github.com/antoinechalifour/webrtc-experiments/projects/1).

## Stack

The signaling server is a [GraphQL API](https://github.com/apollographql/apollo-server) using :

- mutations for sending RTC offers, answers, and ice candidates
- subscriptions to forward RTC offers, answers and ice candidates to recipients

A [Redis server](https://github.com/luin/ioredis) is used as a pubsub. This enables scaling the signaling server (publishing events in memory makes the signaling server stateful).

The frontend is a [React app](https://github.com/facebook/create-react-app) using [urql as a GraphQL client](https://github.com/FormidableLabs/urql).

## Development environment

You will need :

- Docker and docker-compose
- Yarn
- A version of Node supported by [create-react-app](https://create-react-app.dev/docs/getting-started#creating-an-app).

To start the app :

- Install dependencies using `yarn` in the project root
- Run `docker-compose up` in the project root (this will start Redis and the signaling server in watch mode using `ts-node`)
- Run `yarn start` in the `packages/web` directory (this will start the front-end)
