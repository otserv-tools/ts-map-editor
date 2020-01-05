import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { OTBData } from '../types/itemTypes';

import ItemList from '../components/ItemList';
import { RootState } from '../reducers';
import { ItemAction, finishedLoadingOtb } from '../actions/itemActions';

const mapStateToProps = (state: RootState) => ({
  itemData: state.items.itemData,
  otbData: state.items.otbData
});

const mapDispatchToProps = (dispatch: Dispatch<ItemAction>) => ({
  finishedLoadingOtb: (otbData: OTBData) => dispatch(finishedLoadingOtb(otbData))
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemList);
