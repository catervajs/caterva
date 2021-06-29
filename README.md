# Caterva

## Getting Started

### Requirements
- Postgres
- Redis

Alternatively for quick local development run `$ docker-compose up -d` in project folder

### Set Environment Variables
Connections will default to localhost otherwise
- `DATABASE_URL` for Postgres DSN
- `REDIS_URL` for Redis
- `SECRET` for JWT Secret


### Run
```bash
$ git clone https://github.com/catervajs/caterva.git
$ npm install
$ npm run start
```


## OpenAPI Specifications
After launching the project, Swagger UI can be accessed through `/api`.

Alternatively, OpenAPI specification can be downloaded as a JSON file from `/api-json`, and used for generating client libraries.

# Modules Documentation
Compodoc documentation is available in the documentation directory.

Documentation can be generated and viewed with `$npm run document`.

# Plugin Development
It is recommended to read through the [NestJS documentation](https://docs.nestjs.com) for modules and DI concepts.

After cloning the project, you can create custom modules under the extensions directory, import core services into the modules and register modules to the ExtensionsModule module for them to take effect.

Two example modules, wallet and profile modules are provided under the extensions diretory. 