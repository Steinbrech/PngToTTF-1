import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 指定 workspace 目錄
const WORKSPACE_DIR = path.resolve(process.cwd(), 'workspace');
const FINAL_FONT_DIR = path.join(WORKSPACE_DIR, 'final_font');
const SVG_PATH    = path.join(FINAL_FONT_DIR, 'fontpico.svg');
const TTF_PATH    = path.join(FINAL_FONT_DIR, 'fontpico.ttf');
const SCRIPTS_DIR = path.resolve(process.cwd(), 'scripts');

export function convertHandler(req, res) {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).send('請上傳至少一張 PNG');
  }

  try {
    // 1. 依序執行前面 4 支腳本
    execSync('python renamePNG.py',  { stdio: 'inherit', cwd: SCRIPTS_DIR });
    execSync('node potrace.js',      { stdio: 'inherit', cwd: SCRIPTS_DIR });
    execSync('node run_pico.js',      { stdio: 'inherit', cwd: SCRIPTS_DIR });
    execSync('node readfile.js',      { stdio: 'inherit', cwd: SCRIPTS_DIR });

    // 2. 確認 SVG 已生成
    if (!fs.existsSync(SVG_PATH)) {
      return res.status(500).send('SVG 檔案不存在');
    }

    // 3. 呼叫 generate-font.js 轉成 ttf
    execSync('node generate-font.js', { stdio: 'inherit', cwd: SCRIPTS_DIR });

    // 4. 確認 TTF 已生成
    if (!fs.existsSync(TTF_PATH)) {
      return res.status(500).send('TTF 檔案不存在');
    }

    // 5. 回傳 .ttf 給前端
    res
      .type('font/ttf')
      .set('Content-Disposition', 'attachment; filename="fontpico.ttf"')
      .sendFile(TTF_PATH, (err) => {
        if (err) {
          console.error('sendFile 錯誤：', err);
        } else {
          // 6. 回傳完成後，清理 workspace
          try {
            console.log('開始清理 workspace …');
            execSync('node cleanfile.js', { stdio: 'inherit', cwd: SCRIPTS_DIR });
            console.log('清理完成');
          } catch (cleanErr) {
            console.error('清理檔案時出錯：', cleanErr);
          }
        }
      });

  } catch (err) {
    console.error(err);
    res.status(500).send('伺服器錯誤：' + err.message);
  }
}
