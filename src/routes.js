import { Router } from "express";
import multer from "multer";

import multerConfig from "./config/multer";
import SessionController from "./app/controllers/SessionController";
import RecipientController from "./app/controllers/RecipientController";
import FileController from "./app/controllers/FileController";
import DeliveryManController from "./app/controllers/DeliveryManController";

import userAuth from "./app/middlewares/auth";

const routes = new Router();
const uploads = multer(multerConfig).single("file");

routes.get("/", (req, res) => {
  return res.json({ message: "Hello from backend!" });
});

// sessions
routes.post("/sessions", SessionController.store);
// recipients
routes.post("/recipients", userAuth, RecipientController.store);
routes.put("/recipients", userAuth, RecipientController.update);
// deliverymen
routes.get("/deliverymen", userAuth, DeliveryManController.index);
routes.post("/deliverymen", userAuth, DeliveryManController.store);
routes.delete("/deliverymen", userAuth, DeliveryManController.destroy);
routes.put("/deliverymen", userAuth, DeliveryManController.update);

// files
routes.post(
  "/files",
  (req, res, next) => {
    uploads(req, res, err => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return next();
    });
  },
  FileController.store
);
export default routes;
