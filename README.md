# Sentry Insurance Notice

Sends a postcard to customers who are about to pay off equipment financed with JDF.

## Usage

1. Add the environment variables to a `.env` file in the root directory using the template in `.env.template`.
2. Enter information in a spreadsheet under `data/data.xlsx` with sheet name `data` and columns for `name`, `street`, `city`, `state`, and `zip`.
3. Run `npm run start` to send postcards or `npm run test` to do a test run.

Errors will be logged to `data/results.csv`.

## License

MIT © [Hutson Inc](https://www.hutsoninc.com)