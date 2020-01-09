import * as fs from 'fs';
import {
  Token,
  ServerItemGroup,
  ServerItemType,
  ServerItemAttribute,
  showServerItemAttribute
} from '../../enums';
import { OtbFormat, OTBData } from '../../types/Otb';
import ServerItem from '../../ServerItem';
import { ushort } from '../../types';

import { readEscapedBytes, createBinaryString, ZeroOffset } from '../util';
import Logger from '../Logger';

export class OTBReader extends Logger {
  private buffer: Buffer;
  private cursor: number = 0;
  private path: string;
  private description: string;

  private lastEscaped: boolean = false;

  private itemData: OTBData = {
    majorVersion: 0,
    minorVersion: 0,
    buildNumber: 0,
    items: []
  };

  constructor(path: string) {
    super();
    this.path = path;
  }

  public getItemData() {
    return this.itemData;
  }

  readOTB() {
    this.buffer = fs.readFileSync(this.path);
    this.logd(`[OTB] Buffer size: ${this.buffer.length} bytes.`);

    this.readRoot();
  }

  private readRoot() {
    // Read first 4 empty bytes
    const value = this.nextUInt32();
    if (value !== 0) {
      this.abort(`Expected first 4 bytes to be 0, but received ${showHex(value)}`);
    }

    // Start token
    const start = this.nextByte();
    if (start !== Token.Start) {
      this.abort(`Expected start token but received ${showHex(start)}`);
    }

    this.nextByte(); // First byte of otb is zero
    this.nextUInt32(); // 4 unused bytes

    // Root Header Version
    const rootAttribute = this.nextByte();
    if (rootAttribute !== Token.OTBM_ROOTV1) {
      this.abort(
        `Expected RootHeaderVersion ${showHex(Token.OTBM_ROOTV1)}, but received ${rootAttribute}`
      );
    }

    const dataLength = this.nextUInt16();
    if (dataLength !== OtbFormat.Datalength) {
      this.abort(
        `Size of version header is invalid. Expected ${showHex(
          OtbFormat.Datalength
        )} but received ${showHex(dataLength)}`
      );
    }

    this.itemData.majorVersion = this.nextUInt32(); // items otb format file version
    this.itemData.minorVersion = this.nextUInt32(); // client version
    this.itemData.buildNumber = this.nextUInt32(); // build number, revision

    this.readOtbDescription();
    this.logInfo(this.description);

    this.readNode();
  }

  private readNode() {
    // let x = 20000;

    do {
      // Node must start with "START"
      const startToken = this.nextByte();
      if (startToken !== Token.Start) {
        this.abort(`Expected start token but received ${showHex(startToken)}`);
      }
      const item = new ServerItem();

      this.readServerItemGroup(item);
      this.readServerItemFlags(item);
      this.readServerItemAttributes(item);

      // Set spriteHash to zeros in this special case (why?)
      if (item.spriteHash === undefined && item.itemType !== ServerItemType.Deprecated) {
        item.spriteHash = new Uint8Array(16);
      }

      // Node must end with "END"
      const endToken = this.nextByte();
      if (endToken !== Token.End) {
        this.abort(`Expected end token but received ${showHex(endToken)}`);
      }

      this.itemData.items.push(item);
      // } while (this.hasNextNode() && x-- > 0);
    } while (this.hasNextNode());

    console.log(`Loaded ${this.itemData.items.length} items.`);
    /*this.items.items.forEach(i => {
      console.log(i.show());
    });*/
  }

  /**
   * Read OTB Description. Something like 'OTB 3.62.78-11.1'
   */
  private readOtbDescription() {
    const buffer = this.nextBytes(128);

    // Remove trailing zeros
    const description = buffer.slice(ZeroOffset, buffer.indexOf(0)).toString('utf8');
    this.description = description;
  }

  private hasNextNode() {
    const hasNext = this.peekByte() !== Token.End;
    return hasNext;
  }

  private readServerItemGroup(item: ServerItem) {
    this.logd('\n>> readServerItemGroup <<\n');

    const itemGroup = this.nextByte();
    switch (itemGroup) {
      case ServerItemGroup.None:
        item.itemType = ServerItemType.None;
        break;

      case ServerItemGroup.Ground:
        item.itemType = ServerItemType.Ground;
        break;

      case ServerItemGroup.Container:
        item.itemType = ServerItemType.Container;
        break;

      case ServerItemGroup.Splash:
        item.itemType = ServerItemType.Splash;
        break;

      case ServerItemGroup.Fluid:
        item.itemType = ServerItemType.Fluid;
        break;

      case ServerItemGroup.Deprecated:
        item.itemType = ServerItemType.Deprecated;
        break;
      default:
        if (itemGroup >= ServerItemGroup.Last) {
          this.abort(`Unrecognized value for ServerItemGroup: ${showHex(itemGroup)}`);
        }

        item.itemType = ServerItemType.Deprecated;
    }
  }

  private readServerItemFlags(item: ServerItem) {
    this.logd('\n>> readServerItemFlags <<\n');

    const flags = this.nextUInt32();
    item.setFlags(flags);
  }

  /*
  Reads a byte without advancing the cursor
  */
  private peekByte() {
    this.logd('C ' + this.cursor.toString(10));

    return this.buffer.readUInt8(this.cursor);
  }

  private nextBytes(bytes: number): Buffer {
    const { buffer, bytesRead } = readEscapedBytes(this.buffer, this.cursor, bytes);
    this.cursor += bytesRead;
    return buffer;
  }

  private readServerItemAttributes(item: ServerItem) {
    this.logd('\n>> readServerItemAttributes <<\n');

    while (this.peekByte() !== Token.End) {
      const attribute = this.nextByte();
      const dataLength: ushort = this.nextUInt16();
      this.logd(
        `Attribute (size: ${dataLength.toString(10)} base10): ${showServerItemAttribute(attribute)}`
      );

      switch (attribute) {
        case ServerItemAttribute.ServerID:
          item.id = this.nextUInt16();
          break;

        case ServerItemAttribute.ClientID:
          item.clientId = this.nextUInt16();
          break;

        case ServerItemAttribute.GroundSpeed:
          item.groundSpeed = this.nextUInt16();
          break;

        case ServerItemAttribute.Name:
          item.name = this.nextBytes(dataLength).toString('utf8');
          this.logd('Name: ' + item.name);
          break;

        case ServerItemAttribute.SpriteHash:
          item.spriteHash = Uint8Array.from(this.nextBytes(dataLength));
          break;

        case ServerItemAttribute.MinimapColor:
          item.minimapColor = this.nextUInt16();
          break;

        case ServerItemAttribute.MaxReadWriteChars:
          item.maxReadWriteChars = this.nextUInt16();
          break;

        case ServerItemAttribute.MaxReadChars:
          item.maxReadChars = this.nextUInt16();
          break;

        case ServerItemAttribute.Light:
          item.lightIntensity = this.nextUInt16();
          item.lightColor = this.nextUInt16();
          break;

        case ServerItemAttribute.StackOrder:
          item.stackOrder = this.nextByte();
          break;

        case ServerItemAttribute.TradeAs:
          item.tradeAs = this.nextUInt16();
          break;

        default:
          this.logWarning(`Skipping ServerItemAttribute: ${showHex(attribute)}`);
          this.nextBytes(dataLength);
          break;
      }
      this.logd('--');
    }
  }

  private nextByte() {
    let value = this.buffer.readUInt8(this.cursor++);
    this.logd(showHex(value));

    // Only escape if last token was not also an escape
    if (value === Token.Escape && !this.lastEscaped) {
      value = this.buffer.readUInt8(this.cursor++);
      this.logd(showHex(value));
      this.lastEscaped = true;
    } else {
      this.lastEscaped = false;
    }

    return value;
  }

  private nextUInt16() {
    const { buffer, bytesRead } = readEscapedBytes(this.buffer, this.cursor, 2);
    const value = buffer.readUInt16LE(ZeroOffset);
    this.cursor += bytesRead;

    this.logd('0x' + value.toString(16));
    return value;
  }

  private nextUInt32() {
    const { buffer, bytesRead } = readEscapedBytes(this.buffer, this.cursor, 4);
    // Maybe BE not LE?
    const value = buffer.readUInt32LE(ZeroOffset);
    this.cursor += bytesRead;

    this.logd('0x' + createBinaryString(value));

    return value;
  }
}

function showHex(value: number) {
  switch (value) {
    case Token.Start:
      return 'START';
    case Token.End:
      return 'END';
    case Token.Escape:
      return 'ESCAPE';
    default:
      return value.toString(16) + '[Hex] ';
    // return value.toString(10);
  }
}
