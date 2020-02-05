import { Op } from "sequelize";
import * as yup from "yup";

import Order from "../models/Order";
import Recipient from "../models/Recipient";
import { LIMIT } from "../globals/constants";

class DeliveredOrderController {
  async index(req, res) {
    const schema = yup.object().shape({
      deliveryman_id: yup
        .number()
        .integer()
        .min(1)
        .required(),
    });
    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    const { deliveryman_id } = req.params;
    const { page = 1 } = req.query;
    const orders = await Order.findAll({
      where: {
        deliveryman_id,
        canceled_at: null,
        end_date: {
          [Op.ne]: null,
        },
      },
      offset: (page - 1) * LIMIT,
      limit: LIMIT,
      include: [
        {
          model: Recipient,
          as: "recipient",
        },
      ],
    });
    return res.json(orders);
  }
}

export default new DeliveredOrderController();
