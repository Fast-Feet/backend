import File from "../models/File";

class FileController {
  async store(req, res) {
    const { failed } = req.fileUpload;
    if (failed) {
      return res
        .status(401)
        .json({ err: "Allowed images formats are jpeg, jpg, png, and gif" });
    }
    const { originalname: name, filename: path } = req.file;
    const file = await File.create({ name, path });
    return res.json(file);
  }
}

export default new FileController();
