# Talkie.LOL

[![Build Status](https://travis-ci.com/antoinechalifour/talkie.lol.svg?branch=master)](https://travis-ci.com/antoinechalifour/talkie.lol)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> Talkie is a free, open-source, secure, peer-to-peer video chat app that you can use to talk to your friends.

[Try it here!](https://www.talkie.lol)

## Quick Overview

Talkie is a side-project that I use to play with WebRTC and brand new Web APIs. Talkie uses :

| Category         | API                             | Used for...                                       |
| ---------------- | ------------------------------- | ------------------------------------------------- |
| WebRTC           | RtcPeerconnection               | Creating peer to peer connections                 |
| WebRTC           | Data Channels                   | Sending messages and images                       |
| WebRTC           | MediaDevices / enumerateDevices | Selecting audio and video sources                 |
| WebRTC           | MediaDevices/ getUserMedia      | Stream the user audio / video                     |
| WebRTC           | MediaDevices / getDisplayMedia  | Share the user screen                             |
| PictureInPicture | Video / requestPictureInPicture | Enable picture in picture for a user              |
| Clipboard        | writeText                       | Copy the space link                               |
| Clipboard        | write                           | Copy the space QR code                            |
| Clipboard        | `paste` event                   | Send images from the clipboard over data channels |
| Canvas           | captureStream                   | (Experiment) Merge all streams to a canvas        |
| Canvas           | toBlob                          | To copy a canvas to the clipboard                 |
| WebAudio         | AnalyzerNode                    | Detect sound and silence                          |
| Navigator        | Connection                      | Detect connection type                            |
| PWA              | Service Workers                 | Installing Talkie on your device!                 |

## Stack

### Signaling server

The source code can be found [here](./tree/master/packages/server).

The signaling server is a [GraphQL API](https://github.com/apollographql/apollo-server), written using :

- ✅ TypeScript
- 🚀 [Apollo server](https://github.com/apollographql/apollo-server) as a GraphQL server
- 🄺 [Koa](https://github.com/koajs/koa)
- ♻️ Dependency Injection using [Awilix](https://github.com/jeffijoe/awilix)
- 📦 Redis as a database / pubsub

### Web app

The source code can be found [here](./tree/master/packages/web).

The frontend is a [React app](https://github.com/facebook/create-react-app) using :

- ✅ TypeScript
- 🚀 [urql as a GraphQL client](https://github.com/FormidableLabs/urql)
- 💅 [styled-components for styling](https://github.com/styled-components/styled-components)
- 🎥 [framer motion for animations](https://github.com/framer/motion)

This project extensively uses new APIs such as CSS Grid or CSS custom properties.

## Development environment

### Requirements

To run this project locally, you will need

- Docker and docker-compose
- Yarn
- A version of Node supported by [create-react-app](https://create-react-app.dev/docs/getting-started#creating-an-app).

### Running locally

To start the app :

- Install dependencies using `yarn` in the project root
- Run `docker-compose up` in the project root (this will start Redis and the signaling server in watch mode using `ts-node`)
- Run `yarn start` in the `packages/web` directory (this will start the front-end)

## Deployment

```shell script
# Configure the remote machine (install Nginx and Docker)
ansible-playbook infra/playbooks/install.yml

# Configure the reverse proxy
ansible-playbook infra/playbooks/reverse_proxy.yml

# Deploy the app
ansible-playbook infra/playbooks/talkie.yml
```