import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {Query} from "../../lib/components/Query";
import {QueryEngine} from "../../lib/QueryEngine";

const evaluator = QueryEngine.prototype;
evaluator.evaluate = jest.fn((queryArgs: any, callback): any => {
  if (queryArgs.query === 'ERROR') {
    return callback({ error: new Error('myError'), loading: false });
  }
  if (queryArgs.query === 'LOAD') {
    return callback({ loading: true });
  }
  callback({ data: { result: 'DATA' }, loading: false });
});
jest.spyOn(evaluator, 'destroy');

describe('Query', () => {

  const responseHandler = ({ loading, error, data }: any) => {
    if (loading) {
      return <p>Loading...</p>;
    }
    if (error) {
      return <p>Error :(</p>;
    }
    return <p>Data: {JSON.stringify(data)}</p>;
  };

  beforeEach(jest.clearAllMocks);
  afterEach(cleanup);

  it('destroys the evaluator after unmounting', () => {
    const { unmount } = render(<Query query={''}>
      {responseHandler}
    </Query>);
    unmount();
    expect(evaluator.destroy).toHaveBeenCalledTimes(1);
  });

  it('should render query results', () => {
    const { getByText } = render(<Query query={'{ result }'}>
      {responseHandler}
    </Query>);

    expect(getByText('Data: {"result":"DATA"}')).toBeTruthy();
  });

  it('should render the loading state', () => {
    const { getByText } = render(<Query query={'LOAD'}>
      {responseHandler}
    </Query>);

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should render the error state', () => {
    const { getByText } = render(<Query query={'ERROR'}>
      {responseHandler}
    </Query>);

    expect(getByText('Error :(')).toBeTruthy();
  });

  it('should work without children', () => {
    expect(render(<Query query={'{ result }'}>{}</Query>)).toBeTruthy();
  });

});
