import toHexadecimal from '../src/toHexadecimal';

describe('toHexadecimal', () => {
  test('SOIMarker', () => { 
    const data = new Uint8Array([255, 216]);
    const view = new DataView(data.buffer);
    const actual = toHexadecimal(view, 0, 2);
    expect(actual).toEqual('ffd8');
  })
})