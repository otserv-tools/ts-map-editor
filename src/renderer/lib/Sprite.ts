import { byte, uint32 } from '../types';

export default class Sprite {
  static RGBPixelsDataSize: byte = 32 * 32 * 3;
  static ARGBPixelsDataSize: byte = 32 * 32 * 4;

  static BlankRGBSprite: Uint8Array = new Uint8Array(Sprite.RGBPixelsDataSize);
  static BlankARGBSprite: Uint8Array = new Uint8Array(Sprite.ARGBPixelsDataSize);

  DefaultSize: byte = 32;

  id: uint32;
  size: uint32;
  compressedPixels: Uint8Array;
  transparent: boolean;

  constructor() {
    this.id = 0;
    this.size = 0;
    this.compressedPixels = null;
    this.transparent = false;
  }

  getRGBData(): Uint8Array {
    return null;
  }

  getRGBAData(transparentColor: byte): Uint8Array {
    return null;
  }

  GetPixels(): Uint8Array {
    return null;
  }

  GetBitmap() {}
}
