/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This module is part of Canvas.
 *
 * This module and Canvas are free software: you can redistribute them and/or modify them under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * This module and Canvas are distributed in the hope that they will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise';
import rootReducer from '../reducers';

let middlewares = [
  reduxThunk,
  reduxPromise,
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
