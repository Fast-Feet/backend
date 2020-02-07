import * as yup from "yup";

import DeliveryProblem from "../schemas/DeliveryProblem";
import Order from "../models/Order";

class DeliveryProblemController {
  async store(req, res) {
    // Data validation
    const schema = yup.object().shape({
      delivery_id: yup
        .number()
        .integer()
        .min(1)
        .required(),
      deliveryman_id: yup
        .number()
        .integer()
        .min(1)
        .required(),
      description: yup
        .string()
        .trim()
        .required(),
    });
    if (!(await schema.isValid({ ...req.body, ...req.params }))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    // Grab data
    const { description, deliveryman_id } = req.body;
    const { delivery_id } = req.params;
    /*
      Check the following conditions:
        - order exists
        - deliveryman and delivery (order) match
        - order was not canceled
        - order has not finished
    */
    const order = await Order.findByPk(delivery_id);
    if (!order || order.deliveryman_id !== deliveryman_id) {
      return res
        .status(401)
        .json({ error: "This order was not attributed to you" });
    }
    if (order.canceled_at || order.end_date) {
      return res
        .status(401)
        .json({ error: "Order already finished or canceled" });
    }
    //
    // Create document into DeliveryProblem model
    const delivery_problem = await DeliveryProblem.create({
      description,
      delivery_id,
    });
    return res.json(delivery_problem);
  }

  async index(req, res) {
    const delivery_problems = await DeliveryProblem.find();
    return res.json(delivery_problems);
  }

  async show(req, res) {
    // Data validation
    const schema = yup.object().shape({
      delivery_id: yup
        .number()
        .integer()
        .min(1)
        .required(),
    });
    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    const delivery_problems = await DeliveryProblem.find({
      delivery_id: req.params.delivery_id,
    });
    return res.json(delivery_problems);
  }

  async destroy(req, res) {
    // Data validation
    const objectIdPattern = /^[\dabcdef]{24}$/;
    const schema = yup.object().shape({
      problem_id: yup.string().required(),
    });
    const { problem_id } = req.params;
    if (
      !(await schema.isValid(req.params)) ||
      !objectIdPattern.test(problem_id)
    ) {
      return res.status(400).json({ error: "Validation fails" });
    }
    const delivery_problem = await DeliveryProblem.findById(problem_id);
    // Cancel order
    const order = await Order.findByPk(delivery_problem.delivery_id);
    if (!order || order.end_date) {
      return res
        .status(401)
        .json({ error: "Order does not exist or was already finished" });
    }
    // Idempotent response if order is canceled
    if (order.canceled_at) {
      return res.json(order);
    }
    const orderUpdated = await order.update(
      {
        canceled_at: new Date(),
      },
      { new: true }
    );
    return res.json(orderUpdated);
  }
}

export default new DeliveryProblemController();
