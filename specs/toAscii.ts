export default function toAscii(view: DataView, begin: number, end: number): string {
  return Buffer.from(view.buffer).toString('ascii', begin, end);
}