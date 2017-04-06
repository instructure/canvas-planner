canvas-planner
==================

## Development

### Getting Started

```bash
yarn
yarn start
```

Go to your browser to http://localhost:3005 to see the app.  This will
also start a json-server instance at http://localhost:3004 which api requests
will be proxied from webpack-dev-server to eliminating the need to have an
instance of canvas running to do development.

### Linting

This project uses [eslint-config-react-app](https://github.com/facebookincubator/create-react-app/tree/master/packages/eslint-config-react-app)
for linting JS files.  Linting is enforced at the build level.  ESLint errors will cause the build to fail.
