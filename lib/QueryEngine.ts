import {Client, QueryArgs} from "graphql-ld";
import {ExecutionResult, ExecutionResultDataDefault} from "graphql/execution/execute";

const { createTaskQueue } = require('@solid/react/lib/util'); // tslint:disable-line:no-var-requires

const evaluatorQueue = createTaskQueue();

/**
 * A GraphQL-LD query engine wrapper.
 * Inspired by https://github.com/solid/react-components/blob/master/src/ExpressionEvaluator.js
 */
export class QueryEngine {

  private readonly client: Client;

  private pending: Promise<ExecutionResult> = null;
  private cancel: boolean = false;

  constructor(client: Client) {
    this.client = client;
  }

  public destroy() {
    this.pending = null;
    this.cancel = true;
    evaluatorQueue.clear(this);
  }

  public async evaluate(queryArgs: QueryArgs, updateCallback: (newState: IQueryValueState) => void) {
    // Reset the state
    updateCallback({ loading: true, error: undefined });

    // Schedule the query evaluation
    try {
      await evaluatorQueue.schedule(() => this.evaluateScheduled(queryArgs, updateCallback));
    } catch (error) {
      updateCallback({ loading: false, error });
    }

    // Stop if results are no longer needed
    if (this.cancel) {
      return;
    }
  }

  public async evaluateScheduled(queryArgs: QueryArgs, updateCallback: (newState: IQueryValueState) => void) {
    // Evaluate the query
    const promise = this.pending = this.client.query(queryArgs);
    try {
      const { data, errors } = await promise;

      // Stop if another evaluator took over in the meantime (component update)
      if (this.pending !== promise) {
        return false;
      }

      // Handle the results
      if (errors) {
        updateCallback({ loading: false, error: errors[0] });
      } else {
        updateCallback({ loading: false, data });
      }
    } catch (error) {
      updateCallback({ loading: false, error });
    }
    return true;
  }

}

export interface IQueryValueState {
  loading?: boolean;
  error?: Error;
  data?: ExecutionResultDataDefault;
}
