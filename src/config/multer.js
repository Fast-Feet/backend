import crypto from "crypto";
import multer from "multer";
import { extname, resolve } from "path";

import {
  SIGNATURE_FILE_SIZE,
  AVATAR_FILE_SIZE,
} from "../app/globals/constants";

export const avatar_limit = {
  limits: {
    files: 1,
    fileSize: AVATAR_FILE_SIZE,
  },
};

export const signature_limit = {
  limits: {
    files: 1,
    fileSize: SIGNATURE_FILE_SIZE,
  },
};

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "temp", "uploads"),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return cb(err);
        const ext = extname(file.originalname);
        return cb(null, `${buf.toString("hex")}${ext}`);
      });
    },
  }),
  fileFilter: (req, file, cb) => {
    const fileExtension = extname(file.originalname);
    const imagesExtensions = [".jpg", ".jpeg", ".png", ".gif"];

    if (imagesExtensions.indexOf(fileExtension) === -1) {
      req.fileUpload = {
        ext: fileExtension,
        failed: true,
      };
      return cb(null, false);
    }
    req.fileUpload = {
      ext: fileExtension,
      failed: false,
    };
    return cb(null, true);
  },
};
