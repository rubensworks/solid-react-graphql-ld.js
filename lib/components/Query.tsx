import {DocumentNode} from "graphql/language";
import {object, oneOfType, string} from "prop-types";
import {useQuery} from '../hooks/useQuery';

/**
 * A component for executing a GraphQL-LD query.
 * @param {string | DocumentNode} query A GraphQL query, either a string, or pre-parsed.
 * @param {{[p: string]: any}} variables An optional hash of query variables.
 * @param {any} queryEngineOptions Optional query engine options.
 * @return {any}
 * @constructor
 */
export function Query({ query, children, variables = {}, queryEngineOptions = {} }: {
  children: (IQueryValueState: any) => JSX.Element | null,
  query: string | DocumentNode,
  variables: { [key: string]: any; },
  queryEngineOptions: any,
}) {
  const result = useQuery({ query, variables, queryEngineOptions });
  return children && result ? children(result) : null;
}

export namespace Query {
  export const propTypes = {
    query: oneOfType([string, object]).isRequired,
    queryEngineOptions: object,
    variables: object,
  };
}
