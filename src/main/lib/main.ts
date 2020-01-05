import * as fs from 'fs';
import { OTBReader } from './io/otb/OtbReader';
import { SprReader } from './io/spr/SprReader';
import ClientInfo from './Client';
import { DatReader } from './io/dat/DatReader';

const { performance } = require('perf_hooks');

function time(thunk: () => any) {
  const start = performance.now();
  thunk();
  const end = performance.now();
  console.log(`Elapsed time: ${Math.round((end - start) * 1000) / 1000} ms.`);
}

export function readOTB() {
  const path = 'data/items.otb';
  const reader = new OTBReader(path);
  reader.setDebug(false);

  time(() => reader.readOTB());

  // console.log(reader.getItemData().items.find(i => i.id === 6497));
  return reader.getItemData();
}

function readClientFile(path: string) {
  const json = JSON.parse(fs.readFileSync(path, 'utf8'));
  const defaultClient = '1098';
  const clientInfo = ClientInfo.fromObject(json[defaultClient]);

  return clientInfo;
}

function readSpr() {
  const clientPath = 'data/clients.json';
  const clientInfo = readClientFile(clientPath);

  const path = 'data/tibia.spr';
  const reader = new SprReader(path);

  time(() => reader.readSpr(clientInfo));

  return reader.sprites;
}

export function readDat() {
  const clientPath = 'data/clients.json';
  const clientInfo = readClientFile(clientPath);

  const sprites = readSpr();

  const path = 'data/tibia.dat';
  const reader = new DatReader(path, sprites);
  // reader.setDebug(true);

  time(() => reader.readDat(clientInfo));

  return {
    items: reader.items
  };
}
/*
console.log('OTB:');
readOTB();
console.log('SPR & DAT:');
readDat();
*/
