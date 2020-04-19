# User store and Messages

## Table of contents
* [Dependencies](#dependencies)
* [Clone](#clone)
* [Setup](#setup)
* [Features](#features)
* [Tests](#tests)
* [Todo](#todo)

## Dependencies

- Docker

## Clone

- Clone this repo to your local machine using `https://github.com/Neablis/user-messages`

## Setup

```shell
$ docker-compose up
$ docker-compose run --rm app npm run-script migrate
```

- Go to `http://localhost:3000/graphql` to test calls

## Features
- Graphql
- Node
- Postgres
- Caching

## Structure
### Example
* Src/
  * Modules/
    * Users/
      * Model.js
      * Mutations.js
      * Queries.js
      * Resolvers.js
  * Services/
    * Users/
      * index.js
      * utilsForUsers.js

### Modules

Contains endpoints, services, and models

Structured as
* General Functionality I.E. Users
  * Model
    * Database model of the feature
  * Mutations
    * Contains all Graphql Mutations
  * Queries
    * Contains all Graphql Queries
  * Resolvers
    * Contains all validations of inputs for Mutations and Queries

This structure focuses on separating http/Graphql concerns from system concerns. Modules validate inputs, deal with auth, and format inputs.

Pros:
  - Strict rule system limiting necessary planning when adding new Functionality
  - Extends to 100s of thousands of lines of code easily
  - Simple to add new features to the code base, simple to debug, simple to search code due to the flat rather than deep code structure

Cons:
  - Lots of boilerplate necessary to implement a few Feature
  - Potentially ugly or difficult to write code for features that don't have clear lines of delineation between functionality
  - Sequelize makes it difficult to write efficient queries, this structure + graphql can hide those performance hits because of nested resolvers

### Services

Contains business logic, this is where functionality is isolated, and composed between different services.

Structured as
* Service Name
  * index.js - the root where logic will be exported from
  * supporting.js - Where anything else that is needed for the service lives, these are private from other servicers.

## Usage
### Users
#### Creating a new user using email
```graphql
  mutation {
    user (email : "<email>", password: "<password>") {
      id
      email
      phoneNumber
    }
  }
```

#### Creating a new user using phone number
```graphql
  mutation {
    user (phoneNumber : "<phoneNumber>", password: "<password>") {
      id
      email
      phoneNumber
    }
  }
```

#### Get user attached to session
```graphql
  {
    user {
      id
      email
    }
  }
```

#### Login as a user
```graphql
  {
    login (email: "<email>", password: "<password>") {
      id
      email
      phoneNumber
    }
  }
```

#### Search for users
```graphql
  {
    users (limit: 0, offset: 0) {
      id
      email
      phoneNumber
    }
  }
```

### Messages
#### Create Message
```graphql
  mutation {
    message(message: "<message>") {
      id
      message
      createdAt
    }
  }
```

#### Delete Message
```graphql
  mutation {
    deleteMessage(id: 1)
  }
```

#### Update Message
```graphql
  mutation {
    message(message: "<message>", id: <messageId>) {
      id
      message
      createdAt
    }
  }
```

#### Get All messages
```graphql
  {
    messages {
      id
      message
      createdAt
    }
  }
```

### Follows
#### Create Follow
```graphql
  mutation {
    follow(userId: <userId>)
  }
```

#### Unfollow a user
```graphql
  mutation {
    unfollow(userId: <userId>)
  }
```

#### Get Follows
```graphql
  {
    follows {
      id
      email
      phoneNumber
    }
  }
```

#### Get messages of followed users
```graphql
  {
    followedMessages {
      id
      message
      createdAt
    }
  }
```

## Tests
```shell
$ docker-compose run --rm app npm run-script test
```

## Todo
- Get test coverage to 100% (Only happy paths ATM)
- Optimize some DB calls for getFollowedMessages
- Build out factories to clean up test suites
- Dynamically load models, queries, and mutations

---
