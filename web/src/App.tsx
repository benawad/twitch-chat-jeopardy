import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {
  ThemeProvider,
  CSSReset,
  useToast,
  useToastOptions,
} from "@chakra-ui/core";
import { AdminLogin } from "./routes/AdminLogin";
import { createClient, Provider, fetchExchange } from "urql";
import { pipe, tap } from "wonka";
import { ViewTemplates } from "./routes/ViewTemplates";
import { AddTemplate } from "./routes/AddTemplate";
import { cacheExchange } from "@urql/exchange-graphcache";
import { TemplatesDocument, TemplatesQuery } from "./generated/graphql";
import { Game } from "./routes/Game";

let callToast: (props: useToastOptions) => void = () => {};

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    ({ forward }) => (ops$) =>
      pipe(
        forward(ops$),
        tap(({ error }) => {
          if (error) {
            error.graphQLErrors.forEach((ge) => {
              if (ge.extensions?.code === "1") {
                callToast({
                  status: ge.extensions?.exception.variant,
                  title: ge.message,
                });
              }
            });
          }
        })
      ),
    cacheExchange({
      keys: {
        Answer: () => null,
        Question: () => null,
        TemplateSection: () => null,
      },
      updates: {
        Mutation: {
          createTemplate: (result, args, cache, info) => {
            cache.updateQuery({ query: TemplatesDocument }, (data: any) => {
              data?.templates?.push(result.createTemplate);
              return data;
            });
          },
          removeTemplate: (result, args, cache, info) => {
            cache.invalidate({
              __typename: "Template",
              id: args.templateId as string,
            });
          },
        },
      },
    }),
    fetchExchange,
  ],
});

export function App() {
  const toast = useToast();
  callToast = toast;
  return (
    <Provider value={client}>
      <ThemeProvider>
        <CSSReset />
        <BrowserRouter>
          <Switch>
            <Route exact path="/admin-login">
              <AdminLogin />
            </Route>
            <Route exact path={["/", "/templates"]}>
              <ViewTemplates />
            </Route>
            <Route exact path="/templates/add">
              <AddTemplate />
            </Route>
            <Route exact path="/game/:templateId">
              <Game />
            </Route>
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
