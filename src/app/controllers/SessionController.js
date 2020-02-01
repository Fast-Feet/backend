import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as yup from "yup";

import authConfig from "../../config/auth";
import User from "../models/User";

class SessionController {
  async store(req, res) {
    // Validation of email and password data
    const schema = yup.object().shape({
      email: yup
        .string()
        .email()
        .required(),
      password: yup
        .string()
        .min(6)
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    // Receive email and password in req.body
    const { email, password } = req.body;
    // Check if user exists in database through email
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }
    // Check if password is correct
    const checkPassword = await bcrypt.compare(password, user.password_hash);

    if (!checkPassword) {
      return res
        .status(401)
        .json({ error: "Email and password does not match" });
    }
    // Return token in response: the client should store this token locally (localStorage) and use it to interact with the application
    const payload = {
      email: user.email,
      id: user.id,
    };
    const token = jwt.sign(payload, authConfig.secretKey, {
      expiresIn: authConfig.expiresIn,
    });

    return res.json({
      token,
    });
  }
}

export default new SessionController();
