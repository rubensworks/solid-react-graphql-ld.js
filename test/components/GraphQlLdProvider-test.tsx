import { cleanup, render } from '@testing-library/react';
import {Client as GraphQLLdClient} from "graphql-ld";
import React, { useContext } from 'react';
import {GraphQlLdProvider} from "../../lib/components/GraphQlLdProvider";
import {getGraphQlLdContext} from "../../lib/context/GraphQlLdContext";

describe('GraphQlLdProvider', () => {

  afterEach(cleanup);

  const sources1 = [
    "http://example.org/source1",
    "http://example.org/source2",
  ];

  it('should render children components', () => {
    const { getByText } = render(<GraphQlLdProvider sources={sources1}>
      <div className="unique">Test</div>
    </GraphQlLdProvider>);

    expect(getByText('Test')).toBeTruthy();
  });

  it('should add a client to the children context with a given client', () => {
    const myClient: GraphQLLdClient = {} as any;
    const TestChild = (): any => {
      const context = useContext(getGraphQlLdContext());
      expect(context.client).toEqual(myClient);
      return null;
    };
    render(<GraphQlLdProvider client={myClient}>
      <TestChild />
      <TestChild />
    </GraphQlLdProvider>);
  });

  it('should add a client to the children context with a given list of sources', () => {
    const TestChild = (): any => {
      const context = useContext(getGraphQlLdContext());
      expect(context.client).toBeInstanceOf(GraphQLLdClient);
      return null;
    };
    render(<GraphQlLdProvider sources={sources1}>
      <TestChild />
      <TestChild />
    </GraphQlLdProvider>);
  });

  it('should add a client to the children context with a given list of sources, context and baseIri', () => {
    const myContext = {};
    const TestChild = (): any => {
      const context = useContext(getGraphQlLdContext());
      expect(context.client).toBeInstanceOf(GraphQLLdClient);
      return null;
    };
    render(<GraphQlLdProvider sources={sources1} context={myContext} baseIri={'http://base.org/'}>
      <TestChild />
      <TestChild />
    </GraphQlLdProvider>);
  });

  it('should require a client or list of sources', () => {
    expect(() => {
      const GraphQlLdContext = getGraphQlLdContext();
      render(<GraphQlLdContext.Provider value={{}}>
        <GraphQlLdProvider client={undefined as any} sources={undefined as any}>
          <div className="unique" />
        </GraphQlLdProvider>
      </GraphQlLdContext.Provider>);
    }).toThrowError(
      'GraphQlLdProvider was not passed a client instance or sources list. ' +
      'Make sure you pass in your client via the "client" prop, or a list of sources via the "sources" prop.',
    );
  });
});
