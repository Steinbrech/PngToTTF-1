const fs = require("fs").promises;
const { exec } = require("child_process");
const util = require("util");
const asyncPool = require("tiny-async-pool");
const path = require("path");

const execPromise = util.promisify(exec);
async function asyncPoolAll(...args) {
  const results = [];
  for await (const result of asyncPool(...args)) {
    results.push(result);
  }
  return results;
}

const WORKSPACE     = path.resolve(process.cwd(), '../workspace');
const INPUT_FOLDER  = path.join(WORKSPACE, 'svg_separate');
const OUTPUT_FOLDER = path.join(WORKSPACE, 'pico');

const concurrency = 20; // 同時執行的最大任務數，太高可能會導致 EBADF 錯誤

async function processFiles() {
  const startTime = Date.now();
  // Create output folder if it doesn't exist
  try {
    await fs.mkdir(OUTPUT_FOLDER, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") {
      console.error("Error creating output folder:", err);
      return;
    }
  }
  try {
    const files = await fs.readdir(INPUT_FOLDER);
    await asyncPoolAll(concurrency, files, async (filename) => {
      const src = path.join(INPUT_FOLDER, filename);
      const dest = path.join(OUTPUT_FOLDER, filename);

      try {
        // 執行 picosvg 並把結果 stream 到新的檔案
        await execPromise(`picosvg "${src}" > "${dest}"`);
        console.log(`Converted: ${filename}`);
      } catch (err) {
        console.error(filename, "Error executing picosvg:", err);
      }
    });
  } catch (err) {
    console.error("Error reading input folder:", err);
  }
  console.log("Conversion complete!");
  const endTime = Date.now();
  console.log("Time taken:", (endTime - startTime) / 1000, "seconds");
}

processFiles();
