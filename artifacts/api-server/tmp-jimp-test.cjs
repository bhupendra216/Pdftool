const { Jimp, JimpMime } = require('jimp');
(async () => {
  try {
    console.log('cwd', process.cwd());
    console.log('JimpMime', JimpMime);
    const image = new Jimp({ width: 1, height: 1, color: 0xffffffff });
    console.log('created image', image.bitmap.width, image.bitmap.height);
    const pngBuf = await new Promise((resolve, reject) => {
      image.getBuffer(JimpMime.png, (err, buf) => err ? reject(err) : resolve(buf));
    });
    console.log('pngBuf len', pngBuf.length);
    const img2 = await Jimp.read(pngBuf);
    console.log('read ok', img2.bitmap.width, img2.bitmap.height);
    const outBuffer = await new Promise((resolve, reject) => {
      img2.getBuffer(JimpMime.jpeg, (err, buf) => err ? reject(err) : resolve(buf));
    });
    console.log('outBuffer len', outBuffer.length);
  } catch (err) {
    console.error('test error', err);
    process.exit(1);
  }
})();
