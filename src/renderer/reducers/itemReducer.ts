import { Reducer } from 'redux';
import { OTBData } from '../types/itemTypes';

import { FINISHED_LOADING_OTB, ItemAction } from '../actions/itemActions';

export interface ItemState {
  readonly otbData?: OTBData;
  readonly itemData?: any;
}

export const itemReducer: Reducer<ItemState> = (state = {}, action: ItemAction) => {
  switch (action.type) {
    case FINISHED_LOADING_OTB:
      console.log('REDUCER: ', action.payload);
      return {
        ...state,
        otbData: action.payload
      };
    default:
      return state;
  }
};
