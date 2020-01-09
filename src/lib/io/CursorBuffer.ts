import Logger from './Logger';

export default class CursorBuffer {
  private log = new Logger();
  private buffer: Buffer;

  private cursor = 0;

  static alloc(
    size: number,
    fill?: string | number | Buffer,
    encoding?: BufferEncoding
  ): CursorBuffer {
    const it = new CursorBuffer();
    it.buffer = Buffer.alloc(size, fill, encoding);

    return it;
  }

  setCursor(cursorPos: number) {
    if (cursorPos < 0 || cursorPos > this.buffer.length) {
      throw new Error(
        `cursorPos ${cursorPos} is out of bounds. Must be in [0, ${this.buffer.length - 1}].`
      );
    }

    this.cursor = cursorPos;
  }

  getCursor(): number {
    return this.cursor;
  }

  getUnderlyingBuffer() {
    return this.buffer;
  }

  writeUIntLE(value: number, byteLength: number): number {
    const res = this.buffer.writeUIntLE(value, this.cursor, byteLength);
    this.cursor += 1;
    return res;
  }
  writeUIntBE(value: number, byteLength: number): number {
    const res = this.buffer.writeUIntBE(value, this.cursor, byteLength);
    this.cursor += 1;
    return res;
  }
  writeIntLE(value: number, byteLength: number): number {
    const res = this.buffer.writeIntLE(value, this.cursor, byteLength);
    this.cursor += 4;
    return res;
  }
  writeIntBE(value: number, byteLength: number): number {
    const res = this.buffer.writeIntBE(value, this.cursor, byteLength);
    this.cursor += 4;
    return res;
  }

  writeUInt8(value: number): number {
    const res = this.buffer.writeUInt8(value, this.cursor);
    this.cursor += 1;
    return res;
  }
  writeUInt16LE(value: number): number {
    const res = this.buffer.writeUInt16LE(value, this.cursor);
    this.cursor += 2;
    return res;
  }
  writeUInt16BE(value: number): number {
    const res = this.buffer.writeUInt16BE(value, this.cursor);
    this.cursor += 2;
    return res;
  }
  writeUInt32LE(value: number): number {
    const res = this.buffer.writeUInt32LE(value, this.cursor);
    this.cursor += 4;
    return res;
  }
  writeUInt32BE(value: number): number {
    const res = this.buffer.writeUInt32BE(value, this.cursor);
    this.cursor += 4;
    return res;
  }
  writeInt8(value: number): number {
    const res = this.buffer.writeInt8(value, this.cursor);
    this.cursor += 1;
    return res;
  }
  writeInt16LE(value: number): number {
    const res = this.buffer.writeInt16LE(value, this.cursor);
    this.cursor += 2;
    return res;
  }
  writeInt16BE(value: number): number {
    const res = this.buffer.writeInt16BE(value, this.cursor);
    this.cursor += 2;
    return res;
  }
  writeInt32LE(value: number): number {
    const res = this.buffer.writeInt32LE(value, this.cursor);
    this.cursor += 4;
    return res;
  }
  writeInt32BE(value: number): number {
    const res = this.buffer.writeInt32BE(value, this.cursor);
    this.cursor += 4;
    return res;
  }
  writeFloatLE(value: number): number {
    const res = this.buffer.writeFloatLE(value, this.cursor);
    this.cursor += 4;
    return res;
  }
  writeFloatBE(value: number): number {
    const res = this.buffer.writeFloatBE(value, this.cursor);
    this.cursor += 4;
    return res;
  }
  writeDoubleLE(value: number): number {
    const res = this.buffer.writeDoubleLE(value, this.cursor);
    this.cursor += 8;
    return res;
  }
  writeDoubleBE(value: number): number {
    const res = this.buffer.writeDoubleBE(value, this.cursor);
    this.cursor += 8;
    return res;
  }

  dump(source: Buffer, length?: number) {
    if (!length) {
      length = source.length;
    }

    source.copy(this.buffer, this.cursor, 0, length);
    this.cursor += length;
  }

  nextByte() {
    const value = this.buffer.readUInt8(this.cursor++);
    this.log.logd('0x' + value.toString(16));
    return value;
  }

  nextBytes(bytes: number): Buffer {
    const buffer = this.buffer.slice(this.cursor, this.cursor + bytes);
    this.cursor += bytes;
    return buffer;
  }

  nextUInt16() {
    const value = this.buffer.readUInt16LE(this.cursor);
    this.cursor += 2;

    this.log.logd('0x' + value.toString(16));
    return value;
  }

  nextUInt32() {
    const value = this.buffer.readUInt32LE(this.cursor);
    this.cursor += 4;

    this.log.logd('0x' + value.toString(16));
    return value;
  }
}
