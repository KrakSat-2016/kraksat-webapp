# kraksat-webapp

## Installation

First, copy `config/local.json.example` to `config/local.json` and change the values if necessary.

Make sure you have `npm` installed. Then, execute:

```
npm install
```

This will build the assets and place them in `dist/` folder. To build them manually, execute:

```
npm run webpack
```

Or, if you have webpack installed globally, just:

```
webpack
```

For local development, watch mode may come in handy:

```
npm run webpack-watch
```

or:

```
webpack --watch
```
