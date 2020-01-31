import { Router } from "express";

import SessionController from "./app/controllers/SessionController";
import RecipientController from "./app/controllers/RecipientController";
import userAuth from "./app/middlewares/auth";

const routes = new Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello from backend!" });
});

// sessions
routes.post("/sessions", SessionController.store);
// recipients
routes.post("/recipients", userAuth, RecipientController.store);
routes.put("/recipients", userAuth, RecipientController.update);

export default routes;
