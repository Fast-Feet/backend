import * as yup from "yup";
import DeliveryMan from "../models/DeliveryMan";

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
    const deliverymen = await DeliveryMan.findAll();
    return res.json(deliverymen);
  }

  async destroy(req, res) {
    const resp = await DeliveryMan.destroy({ where: { id: req.body.id } });
    return res.json(resp);
  }
}

export default new DeliveryManController();
