import multer from 'multer';
import pkg from 'lodash';
const {slice} = pkg;
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;

    cb(null, `${file.originalname.slice(0, -4)}-${uniqueSuffix}${path.extname(file.originalname)}`)
  }
})

export const fileUpload = multer({ storage: storage })