// cleanfile.js
const fs = require("fs");
const path = require("path");

/**
 * 清空指定資料夾(保留資料夾本身，刪除資料夾內所有檔案與子資料夾)
 * @param {string} folderPath - 要清空的資料夾絕對或相對路徑
 */
function cleanFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.warn(`Folder does not exist: ${folderPath}`);
    return;
  }

  const entries = fs.readdirSync(folderPath);
  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry);
    const stat = fs.lstatSync(fullPath);

    if (stat.isFile() || stat.isSymbolicLink()) {
      fs.unlinkSync(fullPath);
    } else if (stat.isDirectory()) {
      removeDirectory(fullPath);
    }
  }
}

/**
 * 遞迴刪除資料夾整個內容，再把資料夾本身刪除
 * @param {string} dirPath
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
  fs.rmdirSync(dirPath);
}

// 從專案根目錄取得 workspace 路徑
const WORKSPACE = path.resolve(process.cwd(), "../workspace");

// 要清空的資料夾清單，全部放在 workspace 底下
const foldersToClean = [
  path.join(WORKSPACE, "sourcePNG"),
  path.join(WORKSPACE, "svg_separate"),
  path.join(WORKSPACE, "pico"),
  path.join(WORKSPACE, "final_font")
];

for (const folderPath of foldersToClean) {
  console.log(`Cleaning folder: ${folderPath}`);
  cleanFolder(folderPath);
  console.log(`Done cleaning: ${folderPath}`);
}

console.log("All specified folders have been cleaned!");
