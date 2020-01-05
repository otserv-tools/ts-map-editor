import * as fs from 'fs';
import BaseIO from '../BaseIO';
import { showHex } from '../util';
import ClientInfo from '../../Client';
import Sprite from '../../Sprite';

/**
 * Reader for .spr files
 */
export class SprReader extends BaseIO {
  private buffer: Buffer;

  private cursor: number = 0;
  private spriteCursor: number = 0;

  private path: string;
  private lastEscaped: boolean = false;

  public sprites = {};

  private cursorType: CursorType = CursorType.Main;

  constructor(path: string) {
    super();
    this.path = path;
  }

  readSpr(client: ClientInfo, extended: boolean = true, transparency: boolean = false) {
    this.buffer = fs.readFileSync(this.path);
    this.logd(`[SPR] Buffer size: ${this.buffer.length} bytes.`);

    // Unused for now
    const spriteSignature = this.nextUInt32();
    console.log('Sprite signature: ', showHex(spriteSignature));

    const amountOfImages = extended ? this.nextUInt32() : this.nextUInt16();

    let prevMainCursor = this.cursor;

    // Does sprite index begin at one?
    for (let i = 1; i <= amountOfImages; ++i) {
      if (this.sprites[i] !== undefined) {
        console.log('Duplicate');
      }
      this.cursor = prevMainCursor;
      const spriteIndex = this.nextUInt32();
      // console.log('SpriteIndex ', spriteIndex);
      prevMainCursor = this.cursor;

      // Why +3?
      this.cursor = spriteIndex + 3;

      const size = this.nextUInt16();

      const sprite = new Sprite();
      sprite.id = i;
      sprite.size = size;
      sprite.compressedPixels = this.nextBytes(size);
      sprite.transparent = transparency;

      this.sprites[i] = sprite;
    }

    console.log('Done');
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

enum CursorType {
  Main,
  Sprite
}
