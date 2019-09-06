# Solid React GraphQL-LD

[![Build Status](https://travis-ci.org/rubensworks/solid-react-graphql-ld.js.svg?branch=master)](https://travis-ci.org/rubensworks/solid-react-graphql-ld.js)
[![Coverage Status](https://coveralls.io/repos/github/rubensworks/solid-react-graphql-ld.js/badge.svg?branch=master)](https://coveralls.io/github/rubensworks/solid-react-graphql-ld.js?branch=master)
[![npm version](https://badge.fury.io/js/solid-react-graphql-ld.svg)](https://www.npmjs.com/package/solid-react-graphql-ld) [![Greenkeeper badge](https://badges.greenkeeper.io/rubensworks/solid-react-graphql-ld.js.svg)](https://greenkeeper.io/)

[React](https://reactjs.org/) components and hooks for building [Solid](https://solid.inrupt.com/) apps with [GraphQL-LD](https://github.com/rubensworks/graphql-ld.js).

## Installation

```bash
$ yarn install solid-react-graphql-ld
```

## Usage

TODO

```jsx
<Query
  query={gql`
    query @single {
      name @single
      image @single
      friends {
        id @single
      }
    }
  `}
  sources={[ activeProfile ]}
>
  {({ loading, error, data }) => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    console.log(data);
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
              <li key={friend.id}>
                <button onClick={() => this.viewProfile(friend.id)}>
                  {friend.id}
                </button>
              </li>)
            }
          </ul>
        </dd>
      </dl>
    );
  }}
</Query>
```

## License
This software is written by [Ruben Taelman](http://rubensworks.net/).

This code is released under the [MIT license](http://opensource.org/licenses/MIT).
