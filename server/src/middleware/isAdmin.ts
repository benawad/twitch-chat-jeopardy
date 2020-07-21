import { MiddlewareFn } from "type-graphql";
import { AlertError } from "../errors/AlertError";
import { MyContext } from "../types/context";

export const isAdmin: () => MiddlewareFn<MyContext> = () => async (
  { context: { req } },
  next
) => {
  if (!req.session?.isAdmin) {
    throw new AlertError("not authorized");
  }
  return next();
};
