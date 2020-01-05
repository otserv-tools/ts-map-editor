import { hot } from 'react-hot-loader/root';
import * as React from 'react';

import SplitPane from 'react-split-pane';
import ItemListContainer from '../containers/ItemListContainer';
import MainArea from './MainArea';
import { ItemList2 } from './ItemList';

require('./Application.scss');

const Application = () => (
  <div className="root">
    <div className="items">
      <ItemListContainer />
    </div>
    <div className="main-content">
      <MainArea />
    </div>
  </div>
);

const App2 = () => (
  <div className="app">
    <SplitPane className="split-pane" split="vertical" defaultSize="50%">
      <ItemList2 />
      <MainArea />
    </SplitPane>
  </div>
);

export default hot(App2);
