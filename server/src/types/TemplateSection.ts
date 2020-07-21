import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Answer {
  @Field()
  text: string;
  @Field()
  correct: boolean;

  constructor(text: string, correct: boolean) {
    this.text = text;
    this.correct = correct;
  }
}

@ObjectType()
export class Question {
  @Field()
  text: string;
  @Field()
  pointValue: string;
  @Field(() => [Answer])
  answers: Answer[];

  constructor(text: string, pointValue: string, answers: Answer[]) {
    this.text = text;
    this.pointValue = pointValue;
    this.answers = answers;
  }
}

@ObjectType()
export class TemplateSection {
  @Field()
  name: string;
  @Field(() => [Question])
  questions: Question[];

  constructor(name: string, questions: Question[]) {
    this.name = name;
    this.questions = questions;
  }
}
