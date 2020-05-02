import { asClass, asValue, createContainer } from "awilix";
import { PubSub } from "apollo-server-koa";
import getPort from "get-port";

import rtcConfiguration from "../../src/application/config/rtcConfig.json";
import { TalkieApp } from "../../src/application/server";
import { Login } from "../../src/usecase/Login";
import { CreateSpace } from "../../src/usecase/CreateSpace";
import { JoinSpace } from "../../src/usecase/JoinSpace";
import { LeaveSpace } from "../../src/usecase/LeaveSpace";
import { SendRtcOffer } from "../../src/usecase/SendRtcOffer";
import { SendRtcAnswer } from "../../src/usecase/SendRtcAnswer";
import { SendRtcIceCandidate } from "../../src/usecase/SendRtcIceCandidate";
import { SpaceMemoryAdapter } from "../../src/infrastructure/SpaceMemoryAdapter";
import { UserMemoryAdapter } from "../../src/infrastructure/UserMemoryAdapter";
import { NotificationAdapter } from "../../src/infrastructure/NotificationAdapter";
import { TokenJwtAdapter } from "../../src/infrastructure/TokenJwtAdapter";

export async function createTestApp() {
  const port = (await getPort()).toString();
  const container = createContainer();

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
      .inject(() => ({ secret: "test-secret" }))
      .singleton(),

    // Utils
    pubSub: asValue(new PubSub()),
    rtcConfiguration: asValue(rtcConfiguration),
  });
  const app = new TalkieApp({
    container,
    port,
  });

  return { app, container, port };
}
