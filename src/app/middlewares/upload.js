import multer from "multer";
import multerConfig, {
  avatar_limit,
  signature_limit,
} from "../../config/multer";

class Upload {
  signature(req, res, next) {
    const upload = multer({
      ...multerConfig,
      ...signature_limit,
    }).single("file");
    upload(req, res, err => {
      if (err) {
        return res.status(401).json({ error: err.message });
      }
      return next();
    });
  }

  avatar(req, res, next) {
    const upload = multer({
      ...multerConfig,
      ...avatar_limit,
    }).single("file");
    upload(req, res, err => {
      if (err) {
        return res.status(401).json({ error: err.message });
      }
      return next();
    });
  }
}

export default new Upload();
