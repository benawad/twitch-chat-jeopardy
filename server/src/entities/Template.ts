import { v4 } from "uuid";
import { ObjectType, Field, ID } from "type-graphql";
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { TemplateSection } from "../types/TemplateSection";

@ObjectType()
@Entity()
export class Template {
  @Field(() => ID)
  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Field()
  @Property({ type: "text" })
  title!: string;

  @Field(() => [TemplateSection])
  @Property({ type: "jsonb" })
  sections!: TemplateSection[];

  constructor(title: string, sections: TemplateSection[]) {
    this.title = title;
    this.sections = sections;
  }
}
