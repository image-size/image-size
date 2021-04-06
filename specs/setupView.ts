import fs from 'fs'
import path from 'path'

export default function setupView(testFilePath: string, capacity: number) {
  const filepath = path.resolve(testFilePath)
  const inputBuffer = Buffer.alloc(capacity)

  const fd = fs.openSync(filepath, 'r');
  const count = fs.readSync(fd, inputBuffer, 0, capacity, null);
  return new DataView(inputBuffer.buffer, 0, count);
}