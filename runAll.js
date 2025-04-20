// runAll.js
const { execSync } = require("child_process");

function runAll() {
  try {
    console.log("Running renamePNG.js ...");
    execSync("python renamePNG.py", { stdio: "inherit" });

    console.log("Running potrace.js ...");
    execSync("node potrace.js", { stdio: "inherit" });

    console.log("Running pico.js ...");
    execSync("node run_pico.js", { stdio: "inherit" });

    console.log("Running readfile.js ...");
    execSync("node readfile.js", { stdio: "inherit" });

    console.log("All steps completed!");
  } catch (err) {
    console.error("Error:", err);
  }
}

runAll();
