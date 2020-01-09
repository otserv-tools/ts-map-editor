import * as fs from 'fs';
import { byte, uint32 } from './types';
import Logger from './io/Logger';
import Bitmap from './file/Bitmap';

export default class Sprite extends Logger {
  static RGB_BITS_PER_PIXEL = 3;
  static ARGB_BITS_PER_PIXEL = 4;
  static SPRITE_SIZE = 32;
  static RGB_PIXEL_DATA_SIZE: byte =
    Sprite.SPRITE_SIZE * Sprite.SPRITE_SIZE * Sprite.RGB_BITS_PER_PIXEL;
  static ARGB_PIXEL_DATA_SIZE: byte =
    Sprite.SPRITE_SIZE * Sprite.SPRITE_SIZE * Sprite.ARGB_BITS_PER_PIXEL;

  static EmptyRGBSprite: Uint8Array = new Uint8Array(Sprite.RGB_PIXEL_DATA_SIZE);
  static EmptyARGBSprite: Uint8Array = new Uint8Array(Sprite.ARGB_PIXEL_DATA_SIZE);

  DefaultSize: byte = 32;

  id: uint32;
  size: uint32;
  compressedPixels: Buffer;
  transparent: boolean;

  // Cursor for the compressed pixel buffer
  private inputCursor: number;

  // Cursor for the result pixel buffer
  private outputCursor: number;

  constructor() {
    super();

    this.id = 0;
    this.size = 0;
    this.compressedPixels = null;
    this.transparent = false;
    this.debug = false;
  }

  getRGBData(): Uint8Array {
    const transparent = 0x11;
    return null;
  }

  getARGBData(transparentColor: byte): Uint8Array {
    return null;
  }

  getPixels(): Uint8Array {
    this.logd('\n--> GetPixels <--');
    if (this.compressedPixels === undefined || this.compressedPixels.length !== this.size) {
      return Sprite.EmptyARGBSprite;
    }

    const pixels = Buffer.alloc(Sprite.ARGB_PIXEL_DATA_SIZE);

    this.inputCursor = 0;
    this.outputCursor = 0;
    while (this.inputCursor < this.compressedPixels.length) {
      const transparentPixelAmount = this.nextUInt16();
      this.logd(`${transparentPixelAmount} transparent pixels.`);

      for (let i = 0; i < transparentPixelAmount; ++i) {
        this.writeTransparentPixel(pixels);
      }

      const coloredPixelAmount = this.nextUInt16();
      this.logd(`${coloredPixelAmount} colored pixels.`);

      for (let i = 0; i < coloredPixelAmount; ++i) {
        const red = this.nextByte();
        const green = this.nextByte();
        const blue = this.nextByte();
        const alpha = this.transparent ? this.nextByte() : 0xff;

        pixels.writeUInt8(alpha, this.outputCursor++);
        pixels.writeUInt8(red, this.outputCursor++);
        pixels.writeUInt8(green, this.outputCursor++);
        pixels.writeUInt8(blue, this.outputCursor++);
      }
    }

    while (this.outputCursor < Sprite.ARGB_PIXEL_DATA_SIZE) {
      this.writeTransparentPixel(pixels);
    }

    const bitmap = Bitmap.encode(pixels, 32, 32);
    return pixels;
  }

  GetBitmap() {}

  private writeTransparentPixel(buffer: Buffer) {
    /*
    More performant?
    buffer.writeUInt32BE(0x00ff00ff, this.outputCursor)
    this.outputCursor += 4;
    */

    buffer.writeUInt8(0x00, this.outputCursor++); // Alpha
    buffer.writeUInt8(0xff, this.outputCursor++); // Red
    buffer.writeUInt8(0x00, this.outputCursor++); // Green
    buffer.writeUInt8(0xff, this.outputCursor++); // Blue
  }

  private nextByte() {
    const value = this.compressedPixels.readUInt8(this.inputCursor++);
    this.logd(`0x${value.toString(16)}`);
    return value;
  }

  private nextUInt16() {
    const value = this.compressedPixels.readUInt16LE(this.inputCursor);
    this.inputCursor += 2;

    this.logd(`0x${value.toString(16)}`);
    return value;
  }

  private nextUInt16BE() {
    const value = this.compressedPixels.readUInt16BE(this.inputCursor);
    this.inputCursor += 2;

    this.logd(`0x${value.toString(16)}`);
    return value;
  }

  private nextUint32() {
    const value = this.compressedPixels.readUInt32LE(this.inputCursor);
    this.inputCursor += 4;

    this.logd(`0x${value.toString(16)}`);
    return value;
  }

  private nextBytes(bytes: number): Buffer {
    const buffer = this.compressedPixels.slice(this.inputCursor, this.inputCursor + bytes);
    this.inputCursor += bytes;
    return buffer;
  }
}
