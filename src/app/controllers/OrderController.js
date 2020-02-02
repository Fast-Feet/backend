import * as yup from "yup";

import Order from "../models/Order";
import DeliveryMan from "../models/DeliveryMan";

class OrderController {
  async store(req, res) {
    // Validate order data
    const schema = yup.object().shape({
      recipient_id: yup
        .number()
        .integer()
        .min(1)
        .required(),
      deliveryman_id: yup
        .number()
        .integer()
        .min(1)
        .required(),
      signature_id: yup
        .number()
        .integer()
        .min(1),
      product: yup.string().required(),
      canceled_at: yup.date(),
      start_date: yup.date(),
      end_date: yup.date(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    // We do not need to check if the foreign keys constraints are satisfied if we put our code in a try-catch block
    try {
      const order = await Order.create(req.body);
      // send email to deliveryman (to be done!)
      const deliveryman = await DeliveryMan.findByPk(req.body.deliveryman_id);
      return res.json({ order, deliveryman });
    } catch (error) {
      return res.status(401).json(error);
    }
  }
}

export default new OrderController();
