import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  isAdmin: Scalars['Boolean'];
  templates: Array<Template>;
};

export type Template = {
  __typename?: 'Template';
  id: Scalars['ID'];
  title: Scalars['String'];
  sections: Array<TemplateSection>;
};

export type TemplateSection = {
  __typename?: 'TemplateSection';
  name: Scalars['String'];
  questions: Array<Question>;
};

export type Question = {
  __typename?: 'Question';
  text: Scalars['String'];
  pointValue: Scalars['String'];
  answers: Array<Answer>;
};

export type Answer = {
  __typename?: 'Answer';
  text: Scalars['String'];
  correct: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  adminLogin: Scalars['Boolean'];
  removeTemplate: Scalars['Int'];
  startGame: Scalars['Boolean'];
  createTemplate: Template;
};


export type MutationAdminLoginArgs = {
  input: AuthInput;
};


export type MutationRemoveTemplateArgs = {
  templateId: Scalars['String'];
};


export type MutationStartGameArgs = {
  templateId: Scalars['String'];
};


export type MutationCreateTemplateArgs = {
  data: Scalars['String'];
};

export type AuthInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type AdminLoginMutationVariables = Exact<{
  input: AuthInput;
}>;


export type AdminLoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'adminLogin'>
);

export type CreateTemplateMutationVariables = Exact<{
  data: Scalars['String'];
}>;


export type CreateTemplateMutation = (
  { __typename?: 'Mutation' }
  & { createTemplate: (
    { __typename?: 'Template' }
    & Pick<Template, 'id' | 'title'>
    & { sections: Array<(
      { __typename?: 'TemplateSection' }
      & Pick<TemplateSection, 'name'>
      & { questions: Array<(
        { __typename?: 'Question' }
        & Pick<Question, 'text' | 'pointValue'>
        & { answers: Array<(
          { __typename?: 'Answer' }
          & Pick<Answer, 'text' | 'correct'>
        )> }
      )> }
    )> }
  ) }
);

export type RemoveTemplateMutationVariables = Exact<{
  templateId: Scalars['String'];
}>;


export type RemoveTemplateMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeTemplate'>
);

export type StartGameMutationVariables = Exact<{
  templateId: Scalars['String'];
}>;


export type StartGameMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'startGame'>
);

export type TemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type TemplatesQuery = (
  { __typename?: 'Query' }
  & { templates: Array<(
    { __typename?: 'Template' }
    & Pick<Template, 'id' | 'title'>
    & { sections: Array<(
      { __typename?: 'TemplateSection' }
      & Pick<TemplateSection, 'name'>
      & { questions: Array<(
        { __typename?: 'Question' }
        & Pick<Question, 'text' | 'pointValue'>
        & { answers: Array<(
          { __typename?: 'Answer' }
          & Pick<Answer, 'text' | 'correct'>
        )> }
      )> }
    )> }
  )> }
);


export const AdminLoginDocument = gql`
    mutation AdminLogin($input: AuthInput!) {
  adminLogin(input: $input)
}
    `;

export function useAdminLoginMutation() {
  return Urql.useMutation<AdminLoginMutation, AdminLoginMutationVariables>(AdminLoginDocument);
};
export const CreateTemplateDocument = gql`
    mutation CreateTemplate($data: String!) {
  createTemplate(data: $data) {
    id
    title
    sections {
      name
      questions {
        text
        pointValue
        answers {
          text
          correct
        }
      }
    }
  }
}
    `;

export function useCreateTemplateMutation() {
  return Urql.useMutation<CreateTemplateMutation, CreateTemplateMutationVariables>(CreateTemplateDocument);
};
export const RemoveTemplateDocument = gql`
    mutation RemoveTemplate($templateId: String!) {
  removeTemplate(templateId: $templateId)
}
    `;

export function useRemoveTemplateMutation() {
  return Urql.useMutation<RemoveTemplateMutation, RemoveTemplateMutationVariables>(RemoveTemplateDocument);
};
export const StartGameDocument = gql`
    mutation StartGame($templateId: String!) {
  startGame(templateId: $templateId)
}
    `;

export function useStartGameMutation() {
  return Urql.useMutation<StartGameMutation, StartGameMutationVariables>(StartGameDocument);
};
export const TemplatesDocument = gql`
    query Templates {
  templates {
    id
    title
    sections {
      name
      questions {
        text
        pointValue
        answers {
          text
          correct
        }
      }
    }
  }
}
    `;

export function useTemplatesQuery(options: Omit<Urql.UseQueryArgs<TemplatesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TemplatesQuery>({ query: TemplatesDocument, ...options });
};