import { Template } from "./entities/Template";
import { __prod__ } from "./constants";
import path from "path";
import { MikroORM } from "@mikro-orm/core";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
    transactional: true,
  },
  entities: [Template],
  dbName: "twitch-chat-jeopardy",
  type: "postgresql",
  debug: !__prod__,
  log: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
