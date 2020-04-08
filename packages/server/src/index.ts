import "./env";

import { WebRtcExperimentsApp } from "./application/server";
import { container } from "./dependencies";

const app = new WebRtcExperimentsApp({
  port: process.env.PORT!,
  container,
});

app.run();
