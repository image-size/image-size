import fs from 'fs'
import path from 'path'

export default function setupView(testFilePath: string, capacity: number, position: number = 0) {
  const filepath = path.resolve(testFilePath)
  const inputBuffer = Buffer.alloc(capacity)

  const fd = fs.openSync(filepath, 'r');
  const count = fs.readSync(fd, inputBuffer, 0, capacity, position);
  return new DataView(inputBuffer.buffer, 0, count);
}