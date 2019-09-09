import MockPromise from 'jest-mock-promise';
import {QueryEngine} from "../lib/QueryEngine";

jest.useFakeTimers();

describe('QueryEngine', () => {

  let result: MockPromise;
  let client: any;

  beforeEach(() => {
    result = new MockPromise();
    client = {
      query: jest.fn(() => result),
    };
  });

  it('evaluates a query', async () => {
    const evaluator = new QueryEngine(client);
    const callback = jest.fn();

    // Start evaluating the query
    const done = evaluator.evaluate({ query: '{ name }' }, callback);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(
      { error: undefined, data: undefined, loading: true });
    expect(client.query).toHaveBeenCalledTimes(1);
    expect(client.query).toHaveBeenLastCalledWith({ query: '{ name }' });
    jest.runAllTimers();

    // Resolve the query result
    await result.resolve({
      data: { name: 'Ruben' },
      errors: null,
    });
    await new Promise((resolve) => resolve());

    // Check if the query result has been propagated
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith({ data: { name: 'Ruben' }, loading: false });
    await done;
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('propagates errors from the client', async () => {
    const evaluator = new QueryEngine(client);
    const callback = jest.fn();

    // Start evaluating the query
    evaluator.evaluate({ query: '{ name }' }, callback);
    jest.runAllTimers();

    // Emit an error
    await result.resolve({
      errors: [ new Error('myError') ],
    });
    await new Promise((resolve) => resolve());

    // Check if the query result has been propagated
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith({ error: new Error('myError'), loading: false });
  });

  it('propagates rejections from the client', async () => {
    const evaluator = new QueryEngine(client);
    const callback = jest.fn();

    // Start evaluating the query
    evaluator.evaluate({ query: '{ name }' }, callback);
    jest.runAllTimers();

    // Emit an error
    await result.reject(new Error('myReject'));
    await new Promise((resolve) => resolve());

    // Check if the query result has been propagated
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith({ error: new Error('myReject'), loading: false });
  });

  it('stops the evaluation when destroyed', async () => {
    const evaluator = new QueryEngine(client);
    const callback = jest.fn();

    // Start evaluating the expression
    const done = evaluator.evaluate({ query: '{ name }' }, callback);
    jest.runAllTimers();

    // Resolve the query result
    await result.resolve({
      data: { name: 'Ruben' },
      errors: null,
    });
    evaluator.destroy();
    await new Promise((resolve) => resolve());

    // No answer is served
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith({ loading: true });
    await done;
    expect(callback).toHaveBeenCalledTimes(1);
  });

});
