import * as fs from 'fs';
import Logger from '../Logger';
import { showHex } from '../util';
import ClientInfo from '../../Client';
import Sprite from '../../Sprite';

/**
 * Reader for .spr files
 */
export class SprReader extends Logger {
  /**
   * Contains the sprite data.
   */
  sprites: { [id: number]: Sprite };

  private buffer: Buffer;

  private cursor: number = 0;

  private path: string;

  constructor(path: string, sprites: { [id: number]: Sprite }) {
    super();
    this.path = path;

    if (!sprites) {
      this.abort(
        'The "sprites" argument is null/undefined. It should contain sprite information from the .dat file.'
      );
    }
    this.sprites = sprites;
  }

  readSpr(client: ClientInfo, extended: boolean = true, transparency: boolean = false) {
    this.buffer = fs.readFileSync(this.path);
    this.logd(`[SPR] Buffer size: ${this.buffer.length} bytes.`);

    // Unused for now
    const spriteSignature = this.nextUInt32();
    console.log('Sprite signature: ', showHex(spriteSignature));

    const amountOfImages = extended ? this.nextUInt32() : this.nextUInt16();

    let spriteIndexCursor = this.cursor;

    // Does sprite index begin at one?
    for (let id = 1; id <= amountOfImages; ++id) {
      this.cursor = spriteIndexCursor;
      const spriteIndex = this.nextUInt32();
      spriteIndexCursor = this.cursor;

      // Why +3?
      this.cursor = spriteIndex + 3;

      const size = this.nextUInt16();

      // Skip the sprite if the sprites info from the .dat file does not contain it.
      const sprite = this.sprites[id];
      if (sprite === undefined) {
        this.nextBytes(size);
        continue;
      }

      if (size > 0 && sprite.size > 0) {
        console.log('Warning size');
        continue;
      }

      sprite.id = id;
      sprite.size = size;
      sprite.compressedPixels = this.nextBytes(size);

      sprite.transparent = transparency;

      this.sprites[id] = sprite;
    }
  }

  private nextByte() {
    const value = this.buffer.readUInt8(this.cursor++);
    this.logd(showHex(value));
    return value;
  }

  private nextBytes(bytes: number): Buffer {
    const buffer = this.buffer.slice(this.cursor, this.cursor + bytes);
    this.cursor += bytes;
    return buffer;
  }

  private nextUInt16() {
    const value = this.buffer.readUInt16LE(this.cursor);
    this.cursor += 2;

    this.logd('0x' + value.toString(16));
    return value;
  }

  private nextUInt32() {
    const value = this.buffer.readUInt32LE(this.cursor);
    this.cursor += 4;

    this.logd('0x' + value.toString(16));
    return value;
  }
}
