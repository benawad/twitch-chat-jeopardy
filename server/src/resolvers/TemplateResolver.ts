import {
  Arg,
  Ctx,
  Mutation,
  Resolver,
  Query,
  InputType,
  Field,
  UseMiddleware,
  Int,
} from "type-graphql";
import { MyContext } from "../types/context";
import { Template } from "../entities/Template";
import { isAdmin } from "../middleware/isAdmin";
import { TemplateSection, Question, Answer } from "../types/TemplateSection";
import { startGameWithTemplate, currentTemplate } from "../game-logic";

@InputType()
export class AuthInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class TemplateResolver {
  @Query(() => [Template])
  @UseMiddleware(isAdmin())
  templates(@Ctx() ctx: MyContext) {
    return ctx.em.find(Template, {});
  }

  @Mutation(() => Int)
  @UseMiddleware(isAdmin())
  removeTemplate(
    @Arg("templateId") templateId: string,
    @Ctx() ctx: MyContext
  ): Promise<number> {
    return ctx.em.nativeDelete(Template, { id: templateId });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAdmin())
  async startGame(
    @Arg("templateId") templateId: string,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    if (currentTemplate) {
      return false;
    }

    const template = await ctx.em.findOne(Template, { id: templateId });
    if (template) {
      startGameWithTemplate(template);
      return true;
    }

    return false;
  }

  @Mutation(() => Template)
  @UseMiddleware(isAdmin())
  async createTemplate(
    @Arg("data") data: string,
    @Ctx() ctx: MyContext
  ): Promise<Template> {
    const x = JSON.parse(data);
    const template = new Template(
      x.title,
      x.sections.map(
        (section: TemplateSection) =>
          new TemplateSection(
            section.name,
            section.questions.map(
              (q: Question) =>
                new Question(
                  q.text,
                  q.pointValue,
                  q.answers.map((a) => new Answer(a.text, a.correct))
                )
            )
          )
      )
    );
    await ctx.em.persistAndFlush(template);

    return template;
  }
}
