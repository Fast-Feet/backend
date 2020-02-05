import { Op } from "sequelize";
import {
  parseISO,
  isValid,
  getHours,
  startOfHour,
  startOfDay,
  endOfDay,
} from "date-fns";
import * as yup from "yup";

import Order from "../models/Order";

class StartDeliveryController {
  async store(req, res) {
    // Data validation
    const schema = yup.object().shape({
      order_id: yup
        .number()
        .integer()
        .min(1)
        .required(),
      deliveryman_id: yup
        .number()
        .integer()
        .min(1)
        .required(),
      date: yup.date().required(),
    });
    if (!(await schema.isValid({ ...req.body, ...req.params }))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    // Grab fields from body and params
    const { deliveryman_id } = req.params;
    const { order_id, date } = req.body;
    // Check if passed date is valid
    const parsedDate = parseISO(date);
    if (!isValid(parsedDate)) {
      return res.status(400).json({ error: "Invalid date" });
    }
    // Check if order_id and deliveryman_id matches
    const order = await Order.findByPk(order_id);
    if (!order || order.deliveryman_id !== Number(deliveryman_id)) {
      return res.status(400).json({ error: "Order was not attributed to you" });
    }
    // Check if start_date is not null
    if (order.start_date) {
      return res.status(400).json({ error: "Delivery has already started" });
    }
    // Check if start_date is btw 08:00 and 18:00
    const hour = getHours(parsedDate);
    const hourEnd = hour + (parsedDate - startOfHour(parsedDate) > 0 ? 1 : 0);

    if (hour < 8 || hourEnd > 18) {
      return res.status(401).json({
        error: "Pick up hours are between 08:00 and 18:00",
      });
    }
    // Check how many pick ups the delivery man did already in the following day
    const pickups = await Order.findAll({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });
    if (pickups.length >= 5) {
      return res
        .status(401)
        .json({ error: "Maximum number of pick ups orders achieved" });
    }
    // Finally, we are good to go!
    const orderUpdated = await order.update(
      {
        start_date: parsedDate,
      },
      { new: true }
    );
    return res.json(orderUpdated);
  }
}

export default new StartDeliveryController();
