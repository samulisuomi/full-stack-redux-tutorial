import { createStore } from 'redux';
import { reducer } from '../src/reducer';

export const makeStore = () => {
  return createStore(reducer);
};