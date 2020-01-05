import { uint32 } from './types';

interface JsonClientObject {
  version: number;
  description: string;
  otbVersion: number;
  datSignature: string;
  sprSignature: string;
}

export default class ClientInfo {
  version: uint32;
  otbVersion: uint32;
  datSignature: uint32;
  sprSignature: uint32;

  static fromObject(obj: JsonClientObject): ClientInfo {
    const client = new ClientInfo();
    client.version = obj.version;
    client.otbVersion = obj.otbVersion;

    const datSignature = this.parseHex(obj.datSignature);
    const sprSignature = this.parseHex(obj.sprSignature);

    if (datSignature === undefined || sprSignature === undefined) {
      console.error(`[ERROR] Could not parse dat signature '${obj.datSignature}' to hex value.`);
      process.exit(1);
    }

    if (sprSignature === undefined) {
      console.error(`[ERROR] Could not parse spr signature '${obj.sprSignature}' to hex value.`);
      process.exit(1);
    }

    client.datSignature = datSignature;
    client.sprSignature = sprSignature;

    return client;
  }

  private static parseHex(s: string): number {
    let ss = s;
    if (s.indexOf('0x') === -1) {
      ss = `0x${s}`;
    }

    const value = Number(ss);
    return isNaN(value) ? undefined : value;
  }
}
