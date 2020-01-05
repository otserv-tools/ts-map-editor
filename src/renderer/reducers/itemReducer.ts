import { Reducer } from 'redux';
import { OTBData } from '../types/itemTypes';

import { FINISHED_LOADING_OTB, ItemAction } from '../actions/itemActions';
import ServerItem from '../../main/lib/ServerItem';

export interface ItemState {
  readonly otbData?: OTBData;
  readonly itemData?: any;
  readonly itemFilter: (item: ServerItem) => boolean;
}

const defaultState = {
  itemData: undefined,
  otbData: {
    majorVersion: -1,
    minorVersion: -1,
    buildNumber: -1,
    items: []
  },
  itemFilter: (item: ServerItem) => item.name !== ''
};

export const itemReducer: Reducer<ItemState> = (state = defaultState, action: ItemAction) => {
  switch (action.type) {
    case FINISHED_LOADING_OTB:
      return {
        ...state,
        otbData: action.payload
      };
    default:
      return state;
  }
};
