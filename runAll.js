const cors = require('cors');
const express = require('express');
const multer  = require('multer');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors({ origin: '*' }));
const PORT = process.env.PORT || 3000;
const SRC_DIR = path.join(__dirname, 'sourcePNG');
const SVG_PATH = path.join(__dirname, 'final_font', 'fontpico.svg');

const storage = multer.diskStorage({
  // 上傳目錄
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'sourcePNG'));
  },
  // 檔案命名：這裡直接用原本檔名
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') cb(null, true);
    else cb(new Error('只接受 PNG 格式'), false);
  },
  limits: { files: 5000 }
}); 

app.post('/convert', upload.any(), (req, res) => {
  // 只保留 PNG
  const pngFiles = (req.files || []).filter(f => f.mimetype === 'image/png');
  if (!pngFiles.length) {
    return res.status(400).send('請上傳至少一個 PNG');
  }

  try {
    console.log('1. renamePNG.py');
    execSync('python renamePNG.py', { stdio: 'inherit' });

    console.log('2. potrace.js');
    execSync('node potrace.js', { stdio: 'inherit' });

    console.log('3. run_pico.js');
    execSync('node run_pico.js', { stdio: 'inherit' });

    console.log('4. readfile.js');
    execSync('node readfile.js', { stdio: 'inherit' });

    if (!fs.existsSync(SVG_PATH)) {
      return res.status(500).send('SVG 檔案不存在');
    }

    res
      .type('image/svg+xml')
      .set('Content-Disposition', 'inline; filename="fontpico.svg"')
      .sendFile(SVG_PATH);
  } catch (err) {
    console.error(err);
    res.status(500).send('伺服器錯誤：' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
