import {QueryArgs} from "graphql-ld";
import {useContext, useDebugValue, useEffect, useState} from 'react';
import {getGraphQlLdContext} from "../context/GraphQlLdContext";
import {IQueryValueState, QueryEngine} from "../QueryEngine";
const {useWebId, useLiveUpdate} = require('@solid/react'); // tslint:disable-line:no-var-requires

const valueState: IQueryValueState = { loading: true, error: undefined, data: undefined };

/**
 * A hook for executing a GraphQL-LD query.
 * @param {QueryArgs} queryArgs Query arguments, which must contain at least a query.
 * @return {IQueryValueState} The query response.
 */
export function useQuery(queryArgs: QueryArgs): IQueryValueState {
  // Grab information from other hooks
  const context = useContext(getGraphQlLdContext());
  const webId = useWebId();
  const latestUpdate = useLiveUpdate();

  // Retrieve the latest query result
  const [{ loading, error, data }, update] = useState(valueState);
  useDebugValue(error || data);

  // Initialize the query engine
  useEffect(() => {
    const engine = new QueryEngine(context.client);
    engine.evaluate(queryArgs, (changed) => update((current) => ({ ...current, ...changed })));
    return () => engine.destroy();
  }, [ context.client, latestUpdate, webId ]);

  // Return the state components
  return { loading, error, data };
}
