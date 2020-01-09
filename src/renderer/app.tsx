import * as PIXI from 'pixi.js';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { finishedLoadingOtb, DatSprPayload } from './actions/itemActions';
import { readDatAndSpr, readOTB } from '../lib/main';

import Application from './components/Application';
import store from './store';
import { OTBData } from '../lib/types/Otb';

import Icon from './item.png';

const { ipcRenderer } = require('electron');

ipcRenderer.on('otbData', (event, otbData: OTBData) => {
  store.dispatch(finishedLoadingOtb(otbData));
});

ipcRenderer.on('datsprData', (event, data: DatSprPayload) => {
  store.dispatch(finishedLoadingOtb(data));
});

const otbData = readOTB();
const datSprData = readDatAndSpr();

// Create main element
/*const mainElement = document.createElement('div');
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
};*/

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

function addSprite(texture: PIXI.Texture, x: number, y: number) {
  const sprite = new PIXI.Sprite(texture);
  sprite.x = x;
  sprite.y = y;

  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;

  app.stage.addChild(sprite);

  app.ticker.add(() => {
    sprite.rotation += 0.01;
  });
}
/*setTimeout(() => {
  const sprites = store.getState().items.sprites;
  console.log('id of first item: ', Object.keys(sprites)[0]);
}, 2000);*/

app.loader.add('item', 'b83aaf3883973bd330086f09bc614c46.png').load((loader, resources) => {
  const baseX = 32;
  const baseY = 32;

  for (let i = 0; i < 80; ++i) {
    const column = i % 10;
    const row = Math.floor(i / 10);
    addSprite(resources.item.texture, baseX + column * 48, baseY + row * 48);
  }
});

// render(Application);
