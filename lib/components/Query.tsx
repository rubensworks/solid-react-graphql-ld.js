import {IDataSource} from "@comunica/bus-rdf-resolve-quad-pattern";
import {DocumentNode} from "graphql/language";
import {arrayOf, object, oneOfType, string} from "prop-types";
import {useQuery} from '../hooks/useQuery';
import {IQueryValueState} from "../QueryEngine";

/**
 * A component for executing a GraphQL-LD query.
 * @param {IDataSource[]} sources A list of sources.
 * @param {string | DocumentNode} query A GraphQL query, either a string, or pre-parsed.
 * @param {{[p: string]: any}} variables An optional hash of query variables.
 * @param {any} queryEngineOptions Optional query engine options.
 * @param {any} context Optional JSON-LD context.
 * @return {IQueryValueState} The query response.
 * @constructor
 */
export function Query({ sources, query, children, variables = {}, queryEngineOptions = {}, context = {} }: {
  children: (IQueryValueState: any) => JSX.Element | null,
  sources: IDataSource[],
  query: string | DocumentNode,
  variables: { [key: string]: any; },
  queryEngineOptions: any,
  context: any,
}) {
  // TODO: simplify using a GraphQlLdProvider (preldefine sources and context)
  const result = useQuery(sources, { query, variables, queryEngineOptions }, context);
  return children && result ? children(result) : null;
}

export namespace Query {
  export const propTypes = {
    context: object,
    query: oneOfType([string, object]).isRequired,
    queryEngineOptions: object,
    sources: arrayOf(oneOfType([string, object])).isRequired,
    variables: object,
  };
}
