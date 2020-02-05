import * as yup from "yup";

// import Mail from "../../lib/Mail";
import Queue from "../../lib/Queue";
import Order from "../models/Order";
import DeliveryMan from "../models/DeliveryMan";
import Recipient from "../models/Recipient";

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
      const deliveryman = await DeliveryMan.findByPk(req.body.deliveryman_id);
      const recipient = await Recipient.findByPk(req.body.recipient_id);
      // enqueue email to be sent to deliveryman
      await Queue.add("NewOrderMail", { order, deliveryman, recipient });
      // await Mail.sendMail({ order, deliveryman, recipient });
      return res.json({ order, deliveryman });
    } catch (error) {
      return res.status(401).json(error);
    }
  }
}

export default new OrderController();
