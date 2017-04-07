import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import rootReducer from '../reducers';

export default function configureStore (defaultState) {
  return createStore(
    rootReducer,
    defaultState,
    applyMiddleware(
      reduxThunk,
      reduxLogger
    )
  )
}
