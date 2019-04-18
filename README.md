### CRUD

|intention                  | request type  | request url       | request body             | side effect         | response body
|---------------------------|:-------------:|-------------------|--------------------------|---------------------|----------------------------------------------|
| obtain list of user comment objects for given album id | GET           | support/:id       | none             | none                | `[{id: 2, username: "Adrian.Jerde20", comment: "lorem ipsum..."}, {id: 25, username: "Electa11", comment: "ipsum lorem..."}]` |
| add new comment for album by id | POST          | support/:id    | `{username: "DaleCooper", comment: "fine coffee", id: 4}`| creates new record in database | `POST successful: {username: "DaleCooper", comment: "fine coffee", id: 5}` |
| modify one comment | PUT           | support/:id       | `{username: "DaleCooper", comment: "decent coffee", id: 4}` | modifies db entry for comment associated with given album/user/comment id | `PUT successful: {username: "DaleCooper", comment: "decent coffee", id: 4}` |
| delete single comment by id | DELETE        | support/:id       | `{id: 25, username: "Electa11", comment: "ipsum lorem..."}` | deletes db entry for comment associated with given album/user/comment id | `DELETE successful: {id: 25, username: "Electa11", comment: "ipsum lorem..."}` |


# Supported by module

Displays user album reviews and avatars

## Related Projects

  - https://github.com/team-amy/ana-service
  - https://github.com/team-amy/Nam-s-Service

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

- Install mongoDB using homebrew before using the database seeding script
- Run `brew services start mongodb-community@4.0` and then `mongo` in the command line
- Then use the seed script located in the package.json

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 10.15.3

## Development

To start bundling run `npm run react-dev`

To start server run `npm run server-dev`

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install -g nodemon
npm install
```

