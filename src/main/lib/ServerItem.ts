import { ushort } from './types';
import Item from './Item';

const DefaultValue = 'N/A';

export default class ServerItem extends Item {
  clientId: ushort;
  previousClientId: ushort;

  spriteAssigned: boolean;
  isCustomCreated: boolean;

  spriteHash: Uint8Array;

  show(): string {
    return `{ id = ${this.id}, name = "${this.name}", clientId = ${this.clientId ||
      DefaultValue} }`;
  }
}
