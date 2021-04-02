import { imageSize } from './lib/index.js';

const imgThumbnail: HTMLImageElement = document.querySelector('.img-thumbnail');
const imgFiles: HTMLSelectElement = document.querySelector('.img-files');
const inspectBtn = document.querySelector('.inspect-btn');
const outputPanel: HTMLDivElement = document.querySelector('.output-panel')

function str2ab(str) {
  var buf = new ArrayBuffer(str.length)
  var bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i += 1) {
      bufView[i] = str.charCodeAt(i) % 255;
  }
  return buf;
}

// const dv = new DataView(str2ab('BM1234567890abcddedsfklgejgjkdkglajldjfkljfadskljfkljdskfjkdsjkfjkdlsjkfljkfdjkfjdkljfadlsjfkldj'));

const decoder = new TextDecoder('ascii');
const toAscii = (view: DataView, begin: number, end: number) => {
  const segment = view.buffer.slice(begin, end);
  return decoder.decode(segment);
}

function getImageResponse(imgPath) {
  let myRequest = new Request(imgPath);

  fetch(myRequest)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.arrayBuffer();
  })
  .then(arrayBuf => {
    const sizeOfImage = () => {
      const dv = new DataView(arrayBuf);
      return imageSize(dv, toAscii);
    }

    const output = sizeOfImage();
    outputPanel.textContent = JSON.stringify(output);
  });
}

const handleInspect = () => {
  const imgPath = imgFiles.value;
  getImageResponse(imgPath);
}

const handleChange = () => {
  const resetOutput = () => {
    outputPanel.textContent = '';
  }

  const updateThumbnail = () => {
    const imgPath = imgFiles.value;
    imgThumbnail.src = imgPath;
  }

  updateThumbnail();
  resetOutput();
}

inspectBtn.addEventListener('click', handleInspect);
imgFiles.addEventListener('change', handleChange)