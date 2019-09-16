import { typeHandlers } from './types'

const keys = Object.keys(typeHandlers)

export function detector(buffer: Buffer): string | undefined {
  const finder = (key: string) => typeHandlers[key].validate(buffer)
  return keys.find(finder)
}
