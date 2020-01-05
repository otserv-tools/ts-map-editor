import { uint32 } from '.';
import ServerItem from '../ServerItem';

export interface Items {
  majorVersion: uint32;
  minorVersion: uint32;
  buildNumber: uint32;

  items: ServerItem[];
}
