import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { finishedLoadingOtb } from './actions/itemActions';

import Application from './components/Application';
import store from './store';

require('electron').ipcRenderer.on('hello', (event, message) => {
  store.dispatch(finishedLoadingOtb(message));
});

// Create main element
const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

// Render components
const render = (Component: () => JSX.Element) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    mainElement
  );
};

render(Application);
