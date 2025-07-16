import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 指定 workspace 目錄
const WORKSPACE_DIR = path.resolve(process.cwd(), 'workspace');
const SVG_PATH = path.join(WORKSPACE_DIR, 'final_font', 'fontpico.svg');
const SCRIPTS_DIR = path.resolve(process.cwd(), 'scripts');


export function convertHandler(req, res) {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).send('請上傳至少一張 PNG');
  }

  try {
    // 依序執行你的 4 支腳本
    // cwd 指向 scripts 資料夾，讓腳本內的相對路徑都從這裡算起
    execSync('python renamePNG.py',  { stdio: 'inherit', cwd: SCRIPTS_DIR });
    execSync('node potrace.js',      { stdio: 'inherit', cwd: SCRIPTS_DIR });
    execSync('node run_pico.js',      { stdio: 'inherit', cwd: SCRIPTS_DIR });
    execSync('node readfile.js',      { stdio: 'inherit', cwd: SCRIPTS_DIR });

    // 確認 SVG 存在
    if (!fs.existsSync(SVG_PATH)) {
      return res.status(500).send('SVG 檔案不存在');
    }

    // 回傳
    res
      .type('image/svg+xml')
      .set('Content-Disposition', 'inline; filename="fontpico.svg"')
      .sendFile(SVG_PATH);

  } catch (err) {
    console.error(err);
    res.status(500).send('伺服器錯誤：' + err.message);
  }
}