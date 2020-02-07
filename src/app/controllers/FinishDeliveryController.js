import { parseISO, isValid, isBefore } from "date-fns";
import * as yup from "yup";

import Order from "../models/Order";
import Signature from "../models/Signature";

class FinishDeliveryController {
  async store(req, res) {
    // Check if file was uploaded
    if (req.fileUpload.failed) {
      return res
        .status(401)
        .json({ error: "Allowed images formats are jpeg, jpg, png, and gif" });
    }
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
    // Check if order was cancelled
    if (order.canceled_at) {
      return res.status(401).json({ error: "Order was cancelled" });
    }
    // Check if end_date is not null
    if (order.end_date) {
      return res.status(400).json({ error: "Delivery has already finished" });
    }
    // Check if start_date has already begun
    if (!order.start_date) {
      return res.status(400).json({ error: "Start date has not begun yet" });
    }
    // Check if start_date is before end_date
    if (!isBefore(order.start_date, parsedDate)) {
      return res
        .status(401)
        .json({ error: "start_date must be before end_date" });
    }
    // Finally, we are good to go!
    // First, insert into signatures tables the filename and path
    const { originalname: name, filename: path } = req.file;
    const signature = await Signature.create({ name, path });
    // Update order
    const orderUpdated = await order.update(
      {
        end_date: parsedDate,
        signature_id: signature.id,
      },
      { new: true }
    );
    return res.json({ order: orderUpdated, signature });
  }
}

export default new FinishDeliveryController();
