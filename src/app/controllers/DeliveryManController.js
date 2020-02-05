import * as yup from "yup";
import DeliveryMan from "../models/DeliveryMan";
import { LIMIT } from "../globals/constants";

class DeliveryManController {
  async store(req, res) {
    // Validate email, avatar_id, name
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup
        .string()
        .email()
        .required(),
      avatar_id: yup
        .number()
        .integer()
        .min(1),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: "Validation fails" });
    }
    // create DeliveryMan inside a try-catch block
    try {
      const deliveryman = await DeliveryMan.create(req.body);
      return res.json(deliveryman);
    } catch (error) {
      return res.json(error);
    }
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const deliverymen = await DeliveryMan.findAll({
      limit: LIMIT,
      offset: (page - 1) * LIMIT,
    });
    return res.json(deliverymen);
  }

  async update(req, res) {
    // Validate email, avatar_id, name
    const schema = yup.object().shape({
      id: yup
        .number()
        .integer()
        .min(1)
        .required(),
      name: yup.string(),
      email: yup.string().email(),
      avatar_id: yup
        .number()
        .integer()
        .min(1),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: "Validation fails" });
    }
    // Check that deliveryman exists
    const deliveryman = await DeliveryMan.findByPk(req.body.id);
    if (!deliveryman) {
      return res.status(400).json({ error: "Delivery man does not exist" });
    }
    try {
      const result = await deliveryman.update(req.body);
      return res.json({
        message: result ? "Delivery man data updated" : "Nothing to update",
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async destroy(req, res) {
    const resp = await DeliveryMan.destroy({ where: { id: req.body.id } });
    return res.json(resp);
  }
}

export default new DeliveryManController();
