import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { OTBData } from '../../lib/types/Otb';

import ItemList from '../components/ItemList';
import { RootState } from '../reducers';
import { ItemAction, finishedLoadingOtb } from '../actions/itemActions';

const mapStateToProps = (state: RootState) => ({
  clientItems: state.items.clientItems,
  sprites: state.items.sprites,
  otbData: state.items.otbData
});

const mapDispatchToProps = (dispatch: Dispatch<ItemAction>) => ({
  finishedLoadingOtb: (otbData: OTBData) => dispatch(finishedLoadingOtb(otbData))
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemList);
