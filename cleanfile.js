// cleanfile.js
const fs = require("fs");
const path = require("path");

/**
 * 清空指定資料夾(保留資料夾本身，刪除資料夾內所有檔案與子資料夾)
 * @param {string} folderPath - 要清空的資料夾路徑
 */
function cleanFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.warn(`Folder does not exist: ${folderPath}`);
    return;
  }

  // 讀取資料夾內容
  const entries = fs.readdirSync(folderPath);
  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry);
    const stat = fs.lstatSync(fullPath);

    // 如果是檔案或連結，直接刪除
    if (stat.isFile() || stat.isSymbolicLink()) {
      fs.unlinkSync(fullPath);
    }
    // 如果是資料夾，遞迴刪除其內所有檔案，再刪除該資料夾
    else if (stat.isDirectory()) {
      removeDirectory(fullPath);
    }
  }
}

/**
 * 遞迴刪除資料夾
 * @param {string} dirPath - 要刪除的資料夾路徑
 */
function removeDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.lstatSync(fullPath);

    if (stat.isFile() || stat.isSymbolicLink()) {
      fs.unlinkSync(fullPath);
    } else if (stat.isDirectory()) {
      removeDirectory(fullPath);
    }
  }
  // 刪除空的資料夾
  fs.rmdirSync(dirPath);
}

// 要清空的資料夾清單
const foldersToClean = [
  "pico",
  "svg_separate",
  "final_font"
];

// 逐一清空每個資料夾
for (const folder of foldersToClean) {
  console.log(`Cleaning folder: ${folder}`);
  cleanFolder(folder);
  console.log(`Done cleaning: ${folder}`);
}

console.log("All specified folders have been cleaned!");
