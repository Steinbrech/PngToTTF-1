# 打包字體說明書
## 專案概述
* 本專案（fork 自 [chiaoooo/PngToTTF](https://github.com/chiaoooo/PngToTTF)）提供一套把手寫或 PNG 字形切割並打包成 TTF 字型的流程與工具，此專案目的在於修改並建立自動化腳本之 API。
* 字體打包流程大致分為：
  * PNG → SVG：以 potrace（專案內為 potrace.js）把每個 letter/png 向量化成單一 SVG。
    
  * SVG → SVG：使用 Google 的 picosvg（專案內為 run_pico.js）調整 fill-rule、合併路徑等，避免後續打包問題。
    
  * SVG → SVG font file：用 readfile.js 把多個 SVG 打包成一個 fontpico.svg（最後拿到 FontForge）。
 
  * SVG → TTF（FontForge）：把 fontpico.svg 匯入 FontForge，Generate 為 TTF。
* 細節請參考原始專案檔案與 README 。
## 安裝與使用
### 環境需求（Prerequisites）
  * Node.js：v22.18.0
  * Python：3.9 以上
  * FontForge：CLI，需於系統的 PATH 加上 FontForgeBuilds\bin，具體取決於你安裝在哪裡
### 下載專案

```
git clone https://github.com/Steinbrech/PngToTTF-1.git
cd PngToTTF-1
```
### 安裝套件

```
npm install
pip install picosvg
```
### 檔案/資料夾結構
* 圖片處理資料夾格式，下載後放在專案根目錄底下
  * https://drive.google.com/file/d/1ETq1gKw8ZO-YMrr2ACJ0TTmU20LKZpdq/view?usp=drive_link
### 使用說明
1. 啟動服務
```
node index.js
```
2. 呼叫範例
```
async uploadFiles() {
      if (!this.files.length) return
      this.loading = true
      this.ttfUrl = null

      const formData = new FormData()
      this.files.forEach((file) => {
        formData.append('files', file)
      })

      try {
        const response = await axios.post('http://localhost:3001/convert', formData, {
          responseType: 'blob',
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        const blob = new Blob([response.data], { type: 'font/ttf' })
        this.ttfUrl = URL.createObjectURL(blob)
      } catch (err) {
        console.error(err)
        alert('轉換失敗，請檢查後端服務是否運作正常')
      } finally {
        this.loading = false
      }
    }
```
