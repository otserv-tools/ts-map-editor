import { byte } from './types';
import Sprite from './Sprite';
import Item from './Item';

const DefaultValue = 'N/A';

export default class ClientItem extends Item {
  width: byte;
  height: byte;
  layers: byte;
  patternX: byte;
  patternY: byte;
  patternZ: byte;
  frames: byte;
  numSprites: number;
  sprite: Sprite[];

  show(): string {
    // return `{ id = ${this.id}, name = "${this.name}", clientId = ${this.clientId || DefaultValue} }`;
    return 'ClientItem';
  }
}
