import jwt from "jsonwebtoken";

const { PRIVATE_KEY } = process.env;

export default async function userAuth(req, res, next) {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.split(" ")[1];
    if (token) {
      try {
        const payload = jwt.verify(token, PRIVATE_KEY);
        req.payload = payload;
        return next();
      } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
      }
    }
  }
  return res.status(400).json({ error: "You are not logged in" });
}
