import { uint32 } from '.';
import ServerItem from '../ServerItem';

export const OtbFormat = {
  Datalength: 0x04 + 0x04 + 0x04 + 0x80
};

export interface OTBData {
  majorVersion: uint32;
  minorVersion: uint32;
  buildNumber: uint32;

  items: ServerItem[];
}
