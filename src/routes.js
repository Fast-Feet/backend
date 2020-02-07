import { Router } from "express";
// Controllers
import SessionController from "./app/controllers/SessionController";
import RecipientController from "./app/controllers/RecipientController";
import DeliveryManController from "./app/controllers/DeliveryManController";
import OrderController from "./app/controllers/OrderController";
import VisualizeOrderController from "./app/controllers/VisualizeOrderController";
import DeliveredOrderController from "./app/controllers/DeliveredOrderController";
import FileController from "./app/controllers/FileController";
import StartDeliveryController from "./app/controllers/StartDeliveryController";
import FinishDeliveryController from "./app/controllers/FinishDeliveryController";
import SignatureController from "./app/controllers/SignatureController";
// Middlewares
import userAuth from "./app/middlewares/auth";
import Upload from "./app/middlewares/upload";

const routes = new Router();

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
routes.post(
  "/deliveryman/:deliveryman_id/finish_delivery",
  Upload.signature,
  FinishDeliveryController.store
);
// files
routes.post("/files", Upload.avatar, FileController.store);
// signatures
routes.post("/signatures", Upload.signature, SignatureController.store);
export default routes;
