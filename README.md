# Brainsoft Challenge

The Pokémon API allows browsing the catalog of Pokémon and marking them as favorites.

## Requirements

- Node.js 21.6.2 (nvm recommended)
- Yarn
- Docker

## How to Run

```
cp .env.example .env
docker-compose up
```

By running `docker-compose up`, you will:

- Set up the PostgreSQL database
- Run migrations and seed data
- Build and start the server

Alternatively, for local development, you can just set up the PostgreSQL database in the background and run everything else locally from the command line:

```sh
docker-compose up db -d
yarn migrations:up --seed
yarn dev
```

## Testing

The tests assume that the database is running and has some data

`yarn test`
