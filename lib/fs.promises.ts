import * as fs from 'fs'

// fs.promises polyfill for node 8.x
if (!('promises' in fs)) {

  class FileHandle {
    private fd: number

    constructor(fd: number) {
      this.fd = fd
    }

    public stat() {
      return new Promise((resolve, reject) => {
        fs.fstat(this.fd, (err, stats) => {
          if (err) { reject(err) } else { resolve(stats) }
        })
      })
    }

    public read(buffer: Buffer, offset: number, length: number, position: number) {
      return new Promise((resolve, reject) => {
        fs.read(this.fd, buffer, offset, length, position, (err) => {
          if (err) { reject(err) } else { resolve() }
        })
      })
    }

    public close() {
      return new Promise((resolve, reject) => {
        fs.close(this.fd, (err) => {
          if (err) { reject(err) } else { resolve() }
        })
      })
    }
  }

  Object.defineProperty(fs, 'promises', {
    value: {
      open: (filepath: string, flags: string): Promise<FileHandle> => (new Promise((resolve, reject) => {
        fs.open(filepath, flags, (err, fd) => {
          if (err) { reject(err) } else { resolve(new FileHandle(fd)) }
        })
      })),
    },
    writable: false
  })
}
