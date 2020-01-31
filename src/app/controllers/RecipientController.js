import * as yup from "yup";

import Recipient from "../models/Recipient";

class RecipientController {
  async store(req, res) {
    // Validate recipient data
    const schema = yup.object().shape({
      name: yup.string().required(),
      address: yup.string().required(),
      number: yup
        .number()
        .integer()
        .min(0),
      address_complement: yup.string(),
      city: yup.string().required(),
      state: yup.string().required(),
      postal_code: yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    const recipient = await Recipient.create(req.body);
    return res.json(recipient);
  }

  async update(req, res) {
    // Validate recipient data
    const schema = yup.object().shape({
      id: yup
        .number()
        .integer()
        .min(1)
        .required(),
      name: yup.string(),
      address: yup.string(),
      number: yup
        .number()
        .integer()
        .min(0),
      address_complement: yup.string(),
      city: yup.string(),
      state: yup.string(),
      postal_code: yup.string(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    // Check if recipient exists
    const recipient = await Recipient.findByPk(req.body.id);
    if (!recipient) {
      return res.status(400).json({ error: "Recipient does not exist" });
    }
    Object.keys(req.body).forEach(key => {
      if (key !== "id") {
        recipient[key] = req.body[key];
      }
    });
    await recipient.save();
    return res.json(recipient);
  }
}

export default new RecipientController();
