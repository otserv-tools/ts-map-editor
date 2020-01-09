import { word, dword } from '../types';
import CursorBuffer from '../io/CursorBuffer';

/* See
  https://itnext.io/bits-to-bitmaps-a-simple-walkthrough-of-bmp-image-format-765dc6857393
  https://en.wikipedia.org/wiki/BMP_file_format#Pixel_format
*/

enum BitMasks {
  Red = 0x00ff0000,
  Green = 0x0000ff00,
  Blue = 0x000000ff,
  Alpha = 0xff000000
}

// BMP uses LE when value is larger than 1 byte.
export default class Bitmap {
  static FILE_TYPE = 0x424d; // 'BM' in ascii
  static INFO_HEADER_SIZE = 108;
  static PIXEL_DATA_OFFSET = 14 + Bitmap.INFO_HEADER_SIZE; // BMP Header is 14 bytes, DIB header is 108 bytes
  static PLANES = 0x01;
  static BITS_PER_PIXEL = 32;
  static BI_BITFIELDS = 3;
  static COMPRESSION = Bitmap.BI_BITFIELDS;
  static X_PIXELS_PER_METER = 0;
  static Y_PIXELS_PER_METER = 0;
  static TOTAL_COLORS = 0; // We can set TotalColors to 0 which means we want to utilize maximum colors (2^BitsPerPixel)
  static IMPORTANT_COLORS = 0;

  static ASCII_WIN = 0x57696e20; // The string "Win "

  /**
   * Creates a Buffer that represents a bitmap.
   * @param pixelData Buffer holding the pixel data. Each pixel has 4 bytes, one for each of R, G, B, A.
   * @param width width of the bitmap image
   * @param height height of the bitmap image
   */
  static encode(pixelData: Buffer, width: dword, height: dword): Buffer {
    const bytesInImage = pixelData.length;
    const fileSize = Bitmap.PIXEL_DATA_OFFSET + bytesInImage;
    const buffer = CursorBuffer.alloc(fileSize);

    /* -- Bitmap file header -- */
    buffer.writeUInt16BE(Bitmap.FILE_TYPE);
    buffer.writeUInt32LE(fileSize);

    // Reserved bytes
    buffer.writeUInt16LE(0);
    buffer.writeUInt16LE(0);

    buffer.writeUInt32LE(Bitmap.PIXEL_DATA_OFFSET);

    /* -- DIB Header -- */
    buffer.writeUInt32LE(Bitmap.INFO_HEADER_SIZE);
    buffer.writeUInt32LE(width);
    buffer.writeUInt32LE(height);
    buffer.writeUInt16LE(Bitmap.PLANES);
    buffer.writeUInt16LE(Bitmap.BITS_PER_PIXEL);
    buffer.writeUInt32LE(Bitmap.COMPRESSION);
    buffer.writeUInt32LE(bytesInImage);
    buffer.writeUInt32LE(Bitmap.X_PIXELS_PER_METER);
    buffer.writeUInt32LE(Bitmap.Y_PIXELS_PER_METER);
    buffer.writeUInt32LE(Bitmap.TOTAL_COLORS);
    buffer.writeUInt32LE(Bitmap.IMPORTANT_COLORS);

    // Write pixel format (RGBA)
    buffer.writeUInt32BE(BitMasks.Red);
    buffer.writeUInt32BE(BitMasks.Green);
    buffer.writeUInt32BE(BitMasks.Blue);
    buffer.writeUInt32BE(BitMasks.Alpha);

    buffer.writeUInt32BE(Bitmap.ASCII_WIN);

    // Unused (CIEXYZTRIPLE Color Space endpoints and RGB gamma)
    buffer.setCursor(buffer.getCursor() + 48);

    buffer.dump(pixelData, bytesInImage);

    return buffer.getUnderlyingBuffer();
  }
}
