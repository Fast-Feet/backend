import * as yup from "yup";

import Queue from "../../lib/Queue";
import Order from "../models/Order";
import DeliveryMan from "../models/DeliveryMan";
import Recipient from "../models/Recipient";
import { LIMIT } from "../globals/constants";

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
      await Queue.add("NewOrderMail", {
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: `New order to be delivery in ${recipient.city}, ${recipient.state}`,
        template: "newOrder",
        context: {
          name: deliveryman.name,
          product: order.product,
          recipient: recipient.name,
          address: recipient.address,
          number: recipient.number,
          address_complement: recipient.address_complement,
          postal_code: recipient.postal_code,
          city: recipient.city,
          state: recipient.state,
        },
      });

      return res.json({ order, deliveryman, recipient });
    } catch (error) {
      return res.status(401).json(error);
    }
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const orders = await Order.findAll({
      limit: LIMIT,
      offset: (page - 1) * LIMIT,
    });
    return res.json(orders);
  }

  async update(req, res) {
    // Only the product and the deliveryman_id can be updated
    // Data validation: id must be informed
    const schema = yup.object().shape({
      id: yup
        .number()
        .integer()
        .min(1)
        .required(),
      product: yup.string(),
      deliveryman_id: yup
        .number()
        .integer()
        .min(1),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    const order = await Order.findByPk(req.body.id);
    if (!order) {
      return res.status(400).json({ error: "Order does not exist" });
    }
    const { product, deliveryman_id } = req.body;
    // Put update in a try-catch block because deliveryman_id must be valid
    try {
      const result = await order.update(
        { product, deliveryman_id },
        { new: true }
      );
      return res.json(result);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async destroy(req, res) {
    // Data validation: id must be informed
    const schema = yup.object().shape({
      id: yup
        .number()
        .integer()
        .min(1)
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    const result = await Order.destroy({
      where: {
        id: req.body.id,
      },
    });
    return res.json({ message: `${result} order deleted from database` });
  }
}

export default new OrderController();
