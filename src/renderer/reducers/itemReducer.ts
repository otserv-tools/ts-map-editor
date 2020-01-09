import { Reducer } from 'redux';
import { OTBData } from '../../lib/types/Otb';
import ClientItem from '../../lib/ClientItem';
import Sprite from '../../lib/Sprite';

import * as ItemActions from '../actions/itemActions';
import ServerItem from '../../lib/ServerItem';

export interface ItemState {
  readonly otbData?: OTBData;
  readonly clientItems?: { [id: number]: ClientItem };
  readonly sprites?: { [id: number]: Sprite };

  readonly itemFilter: (item: ServerItem) => boolean;
}

const defaultState = {
  otbData: {
    majorVersion: -1,
    minorVersion: -1,
    buildNumber: -1,
    items: []
  },
  itemFilter: (item: ServerItem) => item.name !== ''
};

export const itemReducer: Reducer<ItemState> = (
  state = defaultState,
  action: ItemActions.ItemAction
) => {
  switch (action.type) {
    case ItemActions.FINISHED_LOADING_OTB:
      return {
        ...state,
        otbData: action.payload
      };
    case ItemActions.FINISHED_LOADING_DAT_SPR:
      return {
        ...state,
        clientItems: action.payload.clientItems,
        sprites: action.payload.sprites
      };
    default:
      return state;
  }
};
