import * as fs from 'fs';
import { OTBReader } from './io/otb/OtbReader';
import { SprReader } from './io/spr/SprReader';
import ClientInfo from './Client';
import { DatReader } from './io/dat/DatReader';
import Sprite from './Sprite';
import ClientItem from './ClientItem';

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

  return reader.getItemData();
}

function readClientFile(path: string) {
  const json = JSON.parse(fs.readFileSync(path, 'utf8'));
  const defaultClient = '1098';
  const clientInfo = ClientInfo.fromObject(json[defaultClient]);

  return clientInfo;
}

function readSpr(sprites: { [id: number]: Sprite }): { [id: number]: Sprite } {
  const clientPath = 'data/clients.json';
  const clientInfo = readClientFile(clientPath);

  const path = 'data/tibia.spr';
  const reader = new SprReader(path, sprites);

  time(() => reader.readSpr(clientInfo));

  return reader.sprites;
}

interface DatResult {
  baseSprites: { [id: number]: Sprite };
  items: { [id: number]: ClientItem };
}

export function readDat(): DatResult {
  const clientPath = 'data/clients.json';
  const clientInfo = readClientFile(clientPath);

  const path = 'data/tibia.dat';
  const reader = new DatReader(path);

  time(() => reader.readDat(clientInfo));

  const { baseSprites, items } = reader;
  return {
    baseSprites,
    items
  };
}

export function readDatAndSpr() {
  const { baseSprites, items: clientItems } = readDat();
  const sprites = readSpr(baseSprites);

  return { clientItems, sprites };
}
