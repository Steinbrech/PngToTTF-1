import multer from 'multer';
import path from 'path';

const MAX_FILES = 5000;
const WORKSPACE = path.resolve(process.cwd(), 'workspace');
const SRC_DIR   = path.join(WORKSPACE, 'sourcePNG');

const storage = multer.diskStorage({
  // 把上傳丟到 workspace/sourcePNG
  destination: (req, file, cb) => {
    cb(null, SRC_DIR);
  },
  // 原始檔名
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('只接受 PNG 格式'), false);
    }
  },
  limits: { files: MAX_FILES }
});

// 接收欄位名稱叫 images 的多檔上傳，最多 MAX_FILES 張
export default upload.array('files', MAX_FILES);