import "dotenv-safe/config";
import "reflect-metadata";
import bodyParser from "body-parser";
import { createGraphqlMiddleware } from "express-gql";
import express from "express";
import { buildSchema } from "type-graphql";
import expressPlayground from "graphql-playground-middleware-express";
import { AuthResolver } from "./resolvers/AuthResolver";
import { MyContext } from "./types/context";
import connectRedis from "connect-redis";
import session from "express-session";
import cors from "cors";
import { redis } from "./redis";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import { TemplateResolver } from "./resolvers/TemplateResolver";
import { MikroORM } from "@mikro-orm/core";
import http from "http";
import socketio from "socket.io";
import { websockets } from "./websockets";

const RedisStore = connectRedis(session as any);

const sessionStore = new RedisStore({
  client: redis as any,
  prefix: "sess:",
  disableTouch: true,
});

(async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();

  const server = http.createServer(app);
  const io = socketio(server);

  websockets(io, sessionStore);

  const schema: any = await buildSchema({
    resolvers: [AuthResolver, TemplateResolver],
    validate: false,
  });

  const sessionMiddleware = session({
    store: sessionStore as any,
    name: "id",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      httpOnly: true,
      secure: __prod__,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
    },
  });

  if (process.env.NODE_ENV !== "production") {
    app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
  }

  app.use(
    cors({
      maxAge: __prod__ ? 86400 : undefined,
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.post(
    "/graphql",
    sessionMiddleware,
    bodyParser.json(),
    createGraphqlMiddleware({
      context: ({ req, res }): MyContext => ({ req, res, em: orm.em }),
      formatError: ({ error }) => error,
      schema,
    })
  );

  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`server started at http://localhost:${port}/graphql`);
  });
})();
