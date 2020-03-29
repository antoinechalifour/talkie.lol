import "./env";

import { TeleperoApp } from "./application/server";
import { container } from "./dependencies";

const app = new TeleperoApp({
  port: process.env.PORT!,
  container,
});

app.run();
