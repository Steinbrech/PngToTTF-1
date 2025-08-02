#!/usr/bin/env node

/**
 * merge.js
 * 用途：把 workspace/SVG 裡的檔案複製到 workspace/pico，
 *      只複製那些 pico 資料夾中不存在的檔案
 */

import fs from 'fs';
import path from 'path';

// 設定來源跟目的地
const WORKSPACE = path.resolve(process.cwd(), '../workspace');

const SRC_DIR  = path.join(WORKSPACE, 'SVG');
const DST_DIR  = path.join(WORKSPACE, 'pico');

function copyNewFiles(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath  = path.join(srcDir, entry.name);
    const dstPath  = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      // 遞迴處理子資料夾
      copyNewFiles(srcPath, dstPath);
    }
    else if (entry.isFile()) {
      if (fs.existsSync(dstPath)) {
        console.log(`跳過（已存在）：${dstPath}`);
      } else {
        fs.copyFileSync(srcPath, dstPath);
        console.log(`已複製：${srcPath} → ${dstPath}`);
      }
    }
  }
}

// 執行
copyNewFiles(SRC_DIR, DST_DIR);
console.log('完成');