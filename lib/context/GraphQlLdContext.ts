import {Client as GraphQlLdClient} from "graphql-ld";
import React from 'react';

export interface IGraphQlLdContextValue {
  client?: GraphQlLdClient;
}

let apolloContext: React.Context<IGraphQlLdContextValue>;

export function getGraphQlLdContext() {
  if (!apolloContext) {
    apolloContext = React.createContext<IGraphQlLdContextValue>({});
  }
  return apolloContext;
}

export function resetGraphQlLdContext() {
  apolloContext = React.createContext<IGraphQlLdContextValue>({});
}
