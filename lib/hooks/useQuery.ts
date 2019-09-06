import {IDataSource} from "@comunica/bus-rdf-resolve-quad-pattern";
import {QueryArgs} from "graphql-ld";
import {useDebugValue, useEffect, useState} from 'react';
import {IQueryValueState, QueryEngine} from "../QueryEngine";
const {useWebId, useLiveUpdate} = require('@solid/react'); // tslint:disable-line:no-var-requires

const valueState: IQueryValueState = { loading: true, error: undefined, data: undefined };

/**
 * A hook for executing a GraphQL-LD query.
 * @param {IDataSource[]} sources A list of sources.
 * @param {QueryArgs} queryArgs Query arguments, which must contain at least a query.
 * @param context An optional JSON-LD context.
 * @return {IQueryValueState} The query response.
 */
export function useQuery(sources: IDataSource[], queryArgs: QueryArgs, context: any = {}): IQueryValueState {
  // Grab the user's WebID and the latest update
  const webId = useWebId();
  const latestUpdate = useLiveUpdate();

  // Retrieve the latest query result
  const [{ loading, error, data }, update] = useState(valueState);
  useDebugValue(error || data);

  // Initialize the query engine
  useEffect(() => {
    const engine = new QueryEngine(sources, context);
    engine.evaluate(queryArgs, (changed) => update((current) => ({ ...current, ...changed })));
    return () => engine.destroy();
  }, [ sources, latestUpdate, webId ]);

  // Return the state components
  return { loading, error, data };
}
