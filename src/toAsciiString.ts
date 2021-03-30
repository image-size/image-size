export default function toAsciiString(
  view: DataView,
  begin: number,
  end: number,
): string {
  const segment = view.buffer.slice(begin, end);
  const decoder = new TextDecoder('ascii');
  return decoder.decode(segment);
}
