#!/usr/bin/env node

/**
 * generate-font.js (ESM)
 * 用途：將 workspace/final_font 裡的 fontpico.svg 轉成 fontpico.ttf
 * 使用方法：直接執行即可，不需參數
 */

import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM 裡自己建立 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// 定位到 workspace/final_font
const workspaceDir = path.resolve(__dirname, '../workspace/final_font');
const rawInputPath  = path.join(workspaceDir, 'fontpico.svg');
const rawOutputPath = path.join(workspaceDir, 'fontpico.ttf');

// 將 Windows 的反斜線 "\" 換成 "/"，避免在 template literal 裡被視為 escape
const inputPath  = rawInputPath.replace(/\\/g, '/');
const outputPath = rawOutputPath.replace(/\\/g, '/');

// 構造 FontForge FF script
const ffScript = `Open("${inputPath}"); Generate("${outputPath}"); Quit();`;

// execFile 直接傳 args，不經過 shell
execFile('fontforge', ['-lang=ff', '-c', ffScript], (err, stdout, stderr) => {
  if (err) {
    console.error(`執行失敗：${err.message}`);
    console.error(stderr);
    process.exit(err.code);
  }
  console.log(`✅ 字型已輸出至：${outputPath}`);
  if (stdout) console.log(stdout);
});
