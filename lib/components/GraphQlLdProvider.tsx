import {IDataSource} from "@comunica/bus-rdf-resolve-quad-pattern";
import {Client as GraphQlLdClient} from "graphql-ld";
import {QueryEngineComunicaSolid} from "graphql-ld-comunica-solid";
import {arrayOf, object, oneOfType, string} from "prop-types";
import React from "react";
import invariant from "ts-invariant";
import {getGraphQlLdContext} from "../context/GraphQlLdContext";

/**
 * A provider component for defining a GraphQL-LD query engine.
 * @param {GraphQlLdProviderArgs} args Options for a GraphQL-LD query engine.
 * @return {any}
 * @constructor
 */
export function GraphQlLdProvider(args: GraphQlLdProviderArgs) {
  const GraphQlLdContext = getGraphQlLdContext();
  const client = 'client' in args ? args.client : new GraphQlLdClient({
    baseIRI: args.baseIRI,
    context: [ require('@solid/context'), args.context || {} ],
    queryEngine: new QueryEngineComunicaSolid({ sources: args.sources }),
  });
  return (
    <GraphQlLdContext.Consumer>
      {(graphQlLdContext = {}) => {
        if (client && graphQlLdContext.client !== client) {
          graphQlLdContext = { ...graphQlLdContext, client };
        }

        // Error if no client has been set
        invariant(
          graphQlLdContext.client,
          'GraphQlLdProvider was not passed a client instance or sources list. ' +
          'Make sure you pass in your client via the "client" prop, or a list of sources via the "sources" prop.',
        );

        return (
          <GraphQlLdContext.Provider value={graphQlLdContext}>
            {args.children}
          </GraphQlLdContext.Provider>
        );
      }}
    </GraphQlLdContext.Consumer>
  );
}

export namespace GraphQlLdProvider {
  export const propTypes = {
    baseIri: string,
    client: object,
    context: object,
    sources: arrayOf(oneOfType([string, object])),
  };
}

export type GraphQlLdProviderArgs = {
  client: GraphQlLdClient;
  children: React.ReactNode | React.ReactNode[] | null;
} | {
  sources: IDataSource[],
  context?: any,
  baseIRI?: string;
  children: React.ReactNode | React.ReactNode[] | null;
};
