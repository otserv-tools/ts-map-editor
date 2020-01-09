import { Action, ActionCreator } from 'redux';
import { OTBData } from '../../lib/types/Otb';
import ClientItem from '../../lib/ClientItem';
import Sprite from '../../lib/Sprite';

export const FINISHED_LOADING_OTB = 'FinishedLoadingOTB';
export const FINISHED_LOADING_DAT_SPR = 'FinishedLoadingDatSpr';

export interface FinishedLoadingOTBAction extends Action {
  type: typeof FINISHED_LOADING_OTB;
  payload: OTBData;
}

export interface DatSprPayload {
  clientItems: { [id: number]: ClientItem };
  sprites: { [id: number]: Sprite };
}

export interface FinishedLoadingDatSprAction extends Action {
  type: typeof FINISHED_LOADING_DAT_SPR;
  payload: DatSprPayload;
}

export const finishedLoadingOtb: ActionCreator<FinishedLoadingOTBAction> = (otbData: OTBData) => ({
  type: FINISHED_LOADING_OTB,
  payload: otbData
});

export const finishedLoadingDatSpr: ActionCreator<FinishedLoadingDatSprAction> = (
  data: DatSprPayload
) => ({
  type: FINISHED_LOADING_DAT_SPR,
  payload: data
});

export type ItemAction = FinishedLoadingOTBAction | FinishedLoadingDatSprAction;
