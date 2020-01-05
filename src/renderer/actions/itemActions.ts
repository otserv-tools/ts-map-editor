import { Action, ActionCreator } from 'redux';
import { OTBData } from '../types/itemTypes';

export const FINISHED_LOADING_OTB = 'FinishedLoadingOTB';

export interface FinishedLoadingOTBAction extends Action {
  type: 'FinishedLoadingOTB';
  payload: OTBData;
}

export const finishedLoadingOtb: ActionCreator<FinishedLoadingOTBAction> = (otbData: OTBData) => ({
  type: FINISHED_LOADING_OTB,
  payload: otbData
});

export type ItemAction = FinishedLoadingOTBAction;
