import * as fs from 'fs';
import Logger from '../Logger';
import { showHex } from '../util';
import { ServerItemType, TileStackOrder, DatFlag, showDatFlag } from '../../enums';
import { byte } from '../../types';
import ClientInfo from '../../Client';
import Sprite from '../../Sprite';
import ClientItem from '../../ClientItem';

/**
 * Reader for .dat files
 */
export class DatReader extends Logger {
  items: { [id: number]: ClientItem } = {};

  /**
   * Contains information about sprite ids.
   */
  baseSprites: { [id: number]: Sprite } = {};

  private buffer: Buffer;

  private cursor: number = 0;

  private path: string;

  constructor(path: string) {
    super();
    this.path = path;
  }

  readDat(client: ClientInfo, extended: boolean = true, useFrameDurations: boolean = true) {
    this.buffer = fs.readFileSync(this.path);
    this.logInfo(`[DAT] Buffer size: ${this.buffer.length} bytes.`);

    // Unused for now
    const datSignature = this.nextUInt32();
    this.logd(`Dat signature: ${showHex(datSignature)}`);

    const amountOfItems = this.nextUInt16();
    this.logInfo(`Amount of items: ${amountOfItems}`);
    this.logd('Outfit count:');
    this.nextUInt16(); // Skip outfits count
    this.logd('Effect count:');
    this.nextUInt16(); // Skip effects count
    this.logd('Projectile count:');
    this.nextUInt16(); // Skip projectile count

    let id = 100;
    while (id <= amountOfItems) {
      this.logd(`--> Id: ${id} <--`);
      this.logd(`C ${this.cursor.toString(10)}`);
      const item = new ClientItem();
      item.id = id;
      this.items[id] = item;

      this.readFlags(item);

      this.logd('--> Height and width <--');
      item.width = this.nextByte();
      item.height = this.nextByte();

      if (item.width > 1 || item.height > 1) {
        // This byte describes the exact size. We skip it.
        this.nextByte();
      }

      this.logd('--> Layer, pattern, frames <--');
      item.layers = this.nextByte();
      item.patternX = this.nextByte();
      item.patternY = this.nextByte();
      item.patternZ = this.nextByte();
      item.frames = this.nextByte();
      item.isAnimation = item.frames > 1;
      item.numSprites =
        item.width *
        item.height *
        item.layers *
        item.patternX *
        item.patternY *
        item.patternZ *
        item.frames;

      if (item.isAnimation && useFrameDurations) {
        this.readAnimation(item);

        // this.nextBytes(6 + 8 * item.frames);
      }

      this.logd(`--> Read ${item.numSprites} sprites <--`);
      this.readSpriteIds(item);
      ++id;
    }
  }

  private readAnimation(item: ClientItem) {
    this.logd('--> Animations <--');
    const async = this.nextByte();
    this.logd(`async: ${async}`);
    const loopCount = this.nextInt32();
    this.logd(`loopCount: ${loopCount}`);
    const startPhase = this.nextSignedByte();
    this.logd(`startPhase: ${startPhase}`);

    this.logd('Durations');
    for (let i = 0; i < item.frames; ++i) {
      const minDuration = this.nextInt32();
      this.logd(`minDuration: ${minDuration}`);
      const maxDuration = this.nextInt32();
      this.logd(`maxDuration: ${maxDuration}`);
    }
  }

  private readSpriteIds(item: ClientItem) {
    for (let i = 0; i < item.numSprites; ++i) {
      const spriteId = this.nextUInt32();
      let sprite = this.baseSprites[spriteId];
      if (sprite === undefined) {
        sprite = new Sprite();
        sprite.id = spriteId;
        this.baseSprites[spriteId] = sprite;
      }

      item.spriteList.push(sprite);
    }
  }

  private readFlags(item: ClientItem) {
    let flag: byte;

    do {
      flag = this.nextByte();
      this.logd(`[Flag] ${showDatFlag(flag)}`);

      switch (flag) {
        case DatFlag.Ground:
          item.itemType = ServerItemType.Ground;
          item.groundSpeed = this.nextUInt16();
          break;

        case DatFlag.GroundBorder:
          item.hasStackOrder = true;
          item.stackOrder = TileStackOrder.Border;
          break;

        case DatFlag.OnBottom:
          item.hasStackOrder = true;
          item.stackOrder = TileStackOrder.Bottom;
          break;

        case DatFlag.OnTop:
          item.hasStackOrder = true;
          item.stackOrder = TileStackOrder.Top;
          break;

        case DatFlag.Container:
          item.itemType = ServerItemType.Container;
          break;

        case DatFlag.Stackable:
          item.stackable = true;
          break;

        case DatFlag.ForceUse:
          break;

        case DatFlag.MultiUse:
          item.multiUse = true;
          break;

        case DatFlag.Writable:
          item.readable = true;
          item.maxReadWriteChars = this.nextUInt16();
          break;

        case DatFlag.WritableOnce:
          item.readable = true;
          item.maxReadChars = this.nextUInt16();
          break;

        case DatFlag.FluidContainer:
          item.itemType = ServerItemType.Fluid;
          break;

        case DatFlag.Splash:
          item.itemType = ServerItemType.Splash;
          break;

        case DatFlag.NotWalkable:
          item.walkable = false;
          break;

        case DatFlag.NotMoveable:
          item.movable = false;
          break;

        case DatFlag.BlockProjectile:
          item.blockMissiles = true;
          break;

        case DatFlag.NotPathable:
          item.blockPathfinder = true;
          break;

        case DatFlag.NoMoveAnimation:
          item.noMoveAnimation = true;
          break;

        case DatFlag.Pickupable:
          item.pickupable = true;
          break;

        case DatFlag.Hangable:
          item.hangable = true;
          break;

        case DatFlag.HookEast:
          item.hookEast = true;
          break;

        case DatFlag.HookSouth:
          item.hookSouth = true;
          break;

        case DatFlag.Rotatable:
          item.rotatable = true;
          break;

        case DatFlag.Light:
          item.lightIntensity = this.nextUInt16();
          item.lightColor = this.nextUInt16();
          break;

        case DatFlag.DontHide:
          break;

        case DatFlag.Translucent:
          item.translucent = true;
          break;

        case DatFlag.Displacement:
          this.nextUInt16(); // x offset
          this.nextUInt16(); // y offset
          break;

        case DatFlag.Elevation:
          item.hasElevation = true;
          this.nextUInt16(); // Height
          break;

        case DatFlag.LyingCorpse:
          break;

        case DatFlag.AnimateAlways:
          break;

        case DatFlag.MinimapColor:
          item.minimapColor = this.nextUInt16();
          break;

        case DatFlag.LensHelp:
          const opt = this.nextUInt16();
          if (opt === 1112) {
            item.readable = true;
          }
          break;

        case DatFlag.FullGround:
          item.fullGround = true;
          break;

        case DatFlag.IgnoreLook:
          item.ignoreLook = true;
          break;

        case DatFlag.Cloth:
          this.nextUInt16();
          break;

        case DatFlag.Market:
          this.nextUInt16(); // category
          item.tradeAs = this.nextUInt16(); // trade as
          this.nextUInt16(); // show as
          const nameLength = this.nextUInt16();
          item.name = this.nextBytes(nameLength).toString('utf8');
          this.nextUInt16(); // profession
          this.nextUInt16(); // level
          break;

        case DatFlag.DefaultAction:
          this.nextUInt16();
          break;

        case DatFlag.Wrappable:
        case DatFlag.Unwrappable:
        case DatFlag.TopEffect:
        case DatFlag.Usable:
        case DatFlag.NotPreWalkable:
          break;

        case DatFlag.LastAttr:
          break;

        default:
          console.log(`Error while parsing, unknown flag ${showHex(flag)} at id ${item.id}.`);
          return false;
      }
    } while (flag !== DatFlag.LastAttr);
  }

  private nextByte() {
    const value = this.buffer.readUInt8(this.cursor++);
    this.logd(showHex(value));
    return value;
  }

  private nextSignedByte() {
    const value = this.buffer.readInt8(this.cursor++);
    this.logd(`${value.toString(10)} [Base 10]`);
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

    this.logd(`0x${value.toString(16)}`);
    return value;
  }

  private nextUInt32() {
    const value = this.buffer.readUInt32LE(this.cursor);
    this.cursor += 4;

    this.logd(`0x${value.toString(16)}`);
    return value;
  }

  private nextInt32() {
    const value = this.buffer.readInt32LE(this.cursor);
    this.cursor += 4;

    this.logd(`${value.toString(10)} [Base 10]`);
    return value;
  }
}
