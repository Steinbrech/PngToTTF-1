// startGradio.js (CommonJS)
const axios = require('axios');
const { exec } = require('child_process');

async function startGradio() {
  try {
    const res = await axios.post('http://localhost:8000/gradio/start');
    console.log(res.data);
    console.log('開啟瀏覽器 http://localhost:7860 …');
    // Windows
    exec('start http://localhost:7860');
    // macOS: exec('open http://localhost:7860');
    // Linux: exec('xdg-open http://localhost:7860');
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

startGradio();
