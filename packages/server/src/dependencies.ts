import { asClass, asValue, createContainer } from "awilix";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

import { CreateSpace } from "./usecase/CreateSpace";
import { LeaveSpace } from "./usecase/LeaveSpace";
import { JoinSpace } from "./usecase/JoinSpace";
import { SendRtcOffer } from "./usecase/SendRtcOffer";
import { SendRtcAnswer } from "./usecase/SendRtcAnswer";
import { SendRtcIceCandidate } from "./usecase/SendRtcIceCandidate";
import { Login } from "./usecase/Login";
import { NotificationAdapter } from "./infrastructure/NotificationAdapter";
import { TokenJwtAdapter } from "./infrastructure/TokenJwtAdapter";
import { SpaceRedisAdapter } from "./infrastructure/SpaceRedisAdapter";
import { UserRedisAdapter } from "./infrastructure/UserRedisAdapter";
import rtcConfiguration from "./application/config/rtcConfig.json";

export const container = createContainer();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const REDIS_HOST = process.env.REDIS_HOST!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const REDIS_PORT = Number(process.env.REDIS_PORT!);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? undefined;
const REDIS_USERNAME = process.env.REDIS_USERNAME ?? undefined;

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  name: REDIS_USERNAME,
});
const pubSub = new RedisPubSub({
  connection: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    name: REDIS_USERNAME,
  },
});

container.register({
  // Use cases
  login: asClass(Login),
  createSpace: asClass(CreateSpace),
  joinSpace: asClass(JoinSpace),
  leaveSpace: asClass(LeaveSpace),
  sendRtcOffer: asClass(SendRtcOffer),
  sendRtcAnswer: asClass(SendRtcAnswer),
  sendRtcIceCandidate: asClass(SendRtcIceCandidate),

  // Ports
  spacePort: asClass(SpaceRedisAdapter).singleton(),
  userPort: asClass(UserRedisAdapter).singleton(),
  notificationPort: asClass(NotificationAdapter).singleton(),
  tokenPort: asClass(TokenJwtAdapter)
    .inject(() => ({ secret: process.env.SECRET }))
    .singleton(),

  // Utils
  pubSub: asValue(pubSub),
  redis: asValue(redis),
  rtcConfiguration: asValue(rtcConfiguration),
});
