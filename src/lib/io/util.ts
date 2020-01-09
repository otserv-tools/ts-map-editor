import { Token } from '../enums';

export const ZeroOffset = 0;

export function readEscapedBytes(buffer: Buffer, cursor: number, bytes: number) {
  let lastEscaped = false;

  const dataBuffer = Buffer.alloc(bytes);

  let escapes = 0;
  let value;
  for (let i = 0; i < bytes + escapes; ++i) {
    value = buffer.readUInt8(cursor + i);
    if (value === Token.Escape && !lastEscaped) {
      lastEscaped = true;
      ++escapes;
    } else {
      lastEscaped = false;
      dataBuffer.writeUInt8(value, i - escapes);
    }
  }

  return { buffer: dataBuffer, bytesRead: bytes + escapes };
}

export function showHex(value: number) {
  // return value.toString(16);
  return value.toString(16) + '[Hex] ';
}

export function createBinaryString(nMask: number) {
  let nFlag = 0;
  let nShifted = nMask;
  let sMask = '';
  
  for (
    ;
    nFlag < 32;
    nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1
  ) {}

  // Add space between every 4 numbers
  let res = '';
  for (let k = 0; k < sMask.length; k++) {
    if (k !== 0 && k % 4 === 0) {
      res += ' ';
    }
    res += sMask[k];
  }
  return res;
}
