import { combineReducers } from 'redux';
import items from './items-reducer';
import days from './days-reducer';

export default combineReducers({
  items,
  days
});
