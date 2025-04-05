<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

**Objective:** Build a task management system API, similar to Trello, for creating and managing boards, lists, and tasks.

## Project setup

```bash
$ npm install

$ npm install -g dotenv-cli 
```

## .env Example

```
DATABASE_URL="<Mongo-DB-URL>"
JWT_ACCESS_TOKEN_SECRET="<Your-Access-Token>"
JWT_ACCESS_TOKEN_EXPIRATION_TIME="1d"
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

### Create a .env.test file 

```
DATABASE_URL="<Mongo-DB-test-URL>"
JWT_ACCESS_TOKEN_SECRET="<Your-Access-Token>"
JWT_ACCESS_TOKEN_EXPIRATION_TIME="1d"
```

### Run command to test

- Note: Make sure you have install dotenv-cli globally as mentioned above.

```bash
# e2e tests
$ npm run test:e2e
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kumar Utsav Singh](https://github.com/kus0023)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
