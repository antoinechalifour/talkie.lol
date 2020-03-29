import { PubSub } from "apollo-server-koa";
import { asClass, asValue, createContainer } from "awilix";

import { CreateSpace } from "./usecase/CreateSpace";
import { LeaveSpace } from "./usecase/LeaveSpace";
import { JoinSpace } from "./usecase/JoinSpace";
import { SendRtcOffer } from "./usecase/SendRtcOffer";
import { SendRtcAnswer } from "./usecase/SendRtcAnswer";
import { SendRtcIceCandidate } from "./usecase/SendRtcIceCandidate";
import { Login } from "./usecase/Login";
import { SpaceMemoryAdapter } from "./infrastructure/SpaceMemoryAdapter";
import { NotificationAdapter } from "./infrastructure/NotificationAdapter";
import { UserMemoryAdapter } from "./infrastructure/UserMemoryAdapter";
import { TokenJwtAdapter } from "./infrastructure/TokenJwtAdapter";

export const container = createContainer();

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
  spacePort: asClass(SpaceMemoryAdapter).singleton(),
  userPort: asClass(UserMemoryAdapter).singleton(),
  notificationPort: asClass(NotificationAdapter).singleton(),
  tokenPort: asClass(TokenJwtAdapter)
    .inject(() => ({ secret: process.env.SECRET }))
    .singleton(),

  // Utils
  pubSub: asValue(new PubSub()),
});
