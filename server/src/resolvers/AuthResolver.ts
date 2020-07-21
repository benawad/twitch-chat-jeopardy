import {
  Arg,
  Ctx,
  Mutation,
  Resolver,
  Query,
  InputType,
  Field,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "../types/context";
import { rateLimit } from "../middleware/rateLimit";

@InputType()
export class AuthInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class AuthResolver {
  @Query(() => Boolean)
  isAdmin(@Ctx() ctx: MyContext) {
    return !!ctx.req.session!.isAdmin;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(rateLimit(2))
  async adminLogin(
    @Arg("input") { username, password }: AuthInput,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return false;
    }

    ctx.req.session!.isAdmin = true;

    return true;
  }
}
