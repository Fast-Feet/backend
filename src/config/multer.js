import crypto from "crypto";
import multer from "multer";
import { extname, resolve } from "path";

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
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024, // 2M
  },
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
