import { Router } from "express";
import multer from "multer";

import multerConfig from "./config/multer";
import SessionController from "./app/controllers/SessionController";
import RecipientController from "./app/controllers/RecipientController";
import DeliveryManController from "./app/controllers/DeliveryManController";
import OrderController from "./app/controllers/OrderController";
import VisualizeOrderController from "./app/controllers/VisualizeOrderController";
import DeliveredOrderController from "./app/controllers/DeliveredOrderController";
import FileController from "./app/controllers/FileController";
import StartDeliveryController from "./app/controllers/StartDeliveryController";
import SignatureController from "./app/controllers/SignatureController";

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
// orders
routes.get("/orders", userAuth, OrderController.index);
routes.post("/orders", userAuth, OrderController.store);
routes.put("/orders", userAuth, OrderController.update);
routes.delete("/orders", userAuth, OrderController.destroy);
// deliveryman
routes.get("/deliveryman/:deliveryman_id", VisualizeOrderController.index);
routes.get(
  "/deliveryman/:deliveryman_id/deliveries",
  DeliveredOrderController.index
);
routes.post(
  "/deliveryman/:deliveryman_id/start_delivery",
  StartDeliveryController.store
);
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
// signatures
routes.post(
  "/signatures",
  (req, res, next) => {
    uploads(req, res, err => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return next();
    });
  },
  SignatureController.store
);
export default routes;
