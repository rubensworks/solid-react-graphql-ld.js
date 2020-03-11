# Solid React GraphQL-LD

[![Build Status](https://travis-ci.org/rubensworks/solid-react-graphql-ld.js.svg?branch=master)](https://travis-ci.org/rubensworks/solid-react-graphql-ld.js)
[![Coverage Status](https://coveralls.io/repos/github/rubensworks/solid-react-graphql-ld.js/badge.svg?branch=master)](https://coveralls.io/github/rubensworks/solid-react-graphql-ld.js?branch=master)
[![npm version](https://badge.fury.io/js/solid-react-graphql-ld.svg)](https://www.npmjs.com/package/solid-react-graphql-ld)

[React](https://reactjs.org/) components and hooks for building [Solid](https://solid.inrupt.com/) apps with [GraphQL-LD](https://github.com/rubensworks/graphql-ld.js),
a developer-friendly way to query Linked Data using _[GraphQL](https://graphql.org/)_ queries.

This package is fully compatible with the [React Components for Solid](https://github.com/solid/react-components),
which means that GraphQL-LD queries will be able to query private resources when you are logged in with Solid.

More details on what kinds of queries you can write can be found in the [README of the GraphQL-to-SPARQL repository](https://github.com/rubensworks/graphql-to-sparql.js).

_This package makes use of the [Comunica](Comunica) query engine using the [GraphQL-LD Comunica Solid wrapper](https://github.com/rubensworks/graphql-ld-comunica-solid.js)._

## Installation

```bash
$ yarn add solid-react-graphql-ld
```

or

```bash
$ npm install solid-react-graphql-ld
```

## Require

Import any of the available components and hooks

```
import { GraphQlLdProvider, Query, useQuery } from 'solid-react-graphql-ld';
```

## Usage

### Query component

Using the `GraphQlLdProvider` and `Query` components,
you can execute queries and render its results within a custom UI.

The `GraphQlLdProvider` component will create a reusable query engine
that is available for consumption by one or more `Query` components.

The `Query` component uses the internal query engine
to execute a query, and render the results.

**Example:**
```jsx
import gql from "graphql-tag";

<GraphQlLdProvider sources={[ 'https://www.rubensworks.net/' ]}>
  <Query
    query={gql`query @single(scope: all) {
      name
      image
      friends @plural {
        id
      }
    }`}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      return (
        <dl>
          <dt>Full name</dt>
          <dd>{data.name}</dd>
          <dt>Image</dt>
          <dd><img src={data.image} alt={data.name} width="100px" /></dd>
          <dt>Friends</dt>
          <dd>
            <ul>
              {
                data.friends && data.friends.map(friend =>
                  <li key={friend.id}>{friend.id}</li>)
              }
            </ul>
          </dd>
        </dl>
      );
    }}
  </Query>
</GraphQlLdProvider>
```

**`GraphQlLdProvider` props:**

Either `client` and `children`, or `sources` and `children` are required.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `children` | `(result: QueryResult) => React.ReactNode` | A function returning the UI you want to render based on your query result. (**Required**) |
| `client` | `QueryEngine` | A [GraphQL-LD query engine](https://github.com/rubensworks/GraphQL-LD.js). (**Either this or `sources` is required.**) |
| `sources` | `string[]` | An array of URLs to query from. (**Either this or `client` is required.**) |
| `context` | `object | string | any[]` | A JSON-LD context, which can be either a local object or an URL. Defaults to [`@solid/context`](https://github.com/solid/context/blob/master/context.json). (_Only used with `sources`_) |
| `baseIri` | `baseIri` | The baseIRI using which the query will be parsed and resolved. (_Only used with `sources`_) |

**`Query` props:**

Only `query` and `children` are required.

| Field | Type | Description |
| ----- | ---- | ----------- |
| `children` | `(result: QueryResult) => React.ReactNode` | A function returning the UI you want to render based on your query result. (**Required**) |
| `query` | `string | DocumentNode` | A GraphQL query string or document parsed into an AST by [graphql-tag](graphql-tag). (**Required**) |
| `variables` | `{ [key: string]: any }` | An object containing all of the variables your query needs to execute. |
| `queryEngineOptions` | `any` | Optional query engine options to pass to the internal query engine. |

### Query hook

With the `useQuery` hook, you can create your own React components.
Have a look at the implementation of the [`Query` component](https://github.com/rubensworks/solid-react-graphql-ld.js/blob/master/lib/components/Query.tsx)
on how this hook can be used.

**Example**
```jsx
export function MyComponent() {
  // Only the query prop is required
  const result = useQuery({ query: '{ name @single }', variables: {}, queryEngineOptions: {} });
  return <span>My name is is {result.data.name}.</span>;
}
```

## License
This software is written by [Ruben Taelman](http://rubensworks.net/).

This code is released under the [MIT license](http://opensource.org/licenses/MIT).
