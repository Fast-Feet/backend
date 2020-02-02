import Signature from "../models/Signature";

class SignatureController {
  async store(req, res) {
    const { failed } = req.fileUpload;
    if (failed) {
      return res
        .status(401)
        .json({ err: "Allowed images formats are jpeg, jpg, png, and gif" });
    }
    const { originalname: name, filename: path } = req.file;
    const signature = await Signature.create({ name, path });
    return res.json(signature);
  }
}

export default new SignatureController();
