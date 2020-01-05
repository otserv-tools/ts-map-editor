import { combineReducers } from 'redux';

import { ItemState, itemReducer } from './itemReducer';

export interface RootState {
  items: ItemState;
}

export const rootReducer = combineReducers<RootState | undefined>({
  items: itemReducer
});
