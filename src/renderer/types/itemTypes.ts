import ServerItem from '../lib/ServerItem';

export interface OTBData {
  majorVersion: number;
  minorVersion: number;
  buildNumber: number;
  items: ServerItem[];
}
