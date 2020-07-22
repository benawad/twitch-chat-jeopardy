import { Server } from "socket.io";
import { RedisStore } from "connect-redis";
import cookie from "cookie";
import http from "http";
import socketio from "socket.io";
import express from "express";

export const app = express();

export const server = http.createServer(app);
export const io = socketio(server);

export const websockets = (io: Server, sessionStore: RedisStore) => {
  io.on("connection", async (socket) => {
    const sid = cookie.parse(socket.request.headers.cookie)["id"];
    let notAuthorized = true;
    if (sid) {
      notAuthorized = await new Promise((res) =>
        sessionStore.get(sid, function (error, session) {
          if (error || !session?.isAdmin) {
            res(true);
          } else {
            res(false);
          }
        })
      );
    }

    if (!notAuthorized) {
      socket.disconnect(true);
      return;
    }

    io.emit("welcome", "hello!");
  });
};
