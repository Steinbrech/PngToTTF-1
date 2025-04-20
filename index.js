// index.js
const { PythonShell } = require('python-shell');
const path = require('path');

async function generateFontFromImage(imgPath) {
  return new Promise((resolve, reject) => {
    const outDir = path.resolve(__dirname, 'output_fonts');

    const pyshell = new PythonShell('generate_font.py', {
      mode: 'json',
      pythonOptions: ['-u'],   // 即時 flush
      args: [ imgPath, outDir ] // 傳給 Python 的 sys.argv[1], sys.argv[2]
    });

    pyshell.on('message', msg => {
      // Python print(json.dumps(...)) 會在這裡解析成物件
      resolve(msg);
    });

    pyshell.on('stderr', err => console.error('PY ERR>', err));
    pyshell.on('error', reject);
    pyshell.on('close', () => {
      // 如果 Python 端沒傳任何 message，就算錯
      // （視需求可省略）
    });
  });
}

/* 呼叫範例
generateFontFromImage('uploads/user_sample.png')
  .then(res => console.log('完成：', res))
  .catch(err => console.error(err));
*/