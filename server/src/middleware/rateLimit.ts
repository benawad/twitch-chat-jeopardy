import { MiddlewareFn } from "type-graphql";
import { getClientIp } from "request-ip";
import { MyContext } from "../types/context";
import { redis } from "../redis";
import { AlertError } from "../errors/AlertError";

const ONE_DAY = 60 * 60 * 24;

export const rateLimit: (limit?: number) => MiddlewareFn<MyContext> = (
  limit = 50,
  time = ONE_DAY
) => async ({ context: { req }, info }, next) => {
  const ip = getClientIp(req);
  const key = `rate-limit:${info.fieldName}:${ip}`;

  const current = await redis.incr(key);
  if (current > limit) {
    throw new AlertError("you're doing that too much");
  } else if (current === 1) {
    await redis.expire(key, time);
  }

  return next();
};
