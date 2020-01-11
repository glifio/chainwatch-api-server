An API server that wraps the [chainwatch branch](https://github.com/filecoin-project/lotus/tree/feat/chainwatch-pg) on Lotus.

This will be used by wallets to display a transaction table for now.

Make sure to add a `.env` file at the project root, exporting a LOTUS_DB string - the database to query.

`npm run start:dev` to run the server in development mode
`npm start` for prod
