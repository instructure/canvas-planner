import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducer from '../reducers';

let middlewares = [
  reduxThunk
];

if ((process.env.NODE_ENV !== 'production') &&
   (process.env.NODE_ENV !== 'test')) {
  const reduxLogger = require('redux-logger').default;
  middlewares = [ ...middlewares, reduxLogger ];
}

export default function configureStore (defaultState) {
  return createStore(
    rootReducer,
    defaultState,
    applyMiddleware(...middlewares)
  );
}
