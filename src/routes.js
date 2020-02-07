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
import DeliveryProblemsController from "./app/controllers/DeliveryProblemsController";
// Middlewares
import adminAuth from "./app/middlewares/auth";
import Upload from "./app/middlewares/upload";

const routes = new Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello from backend!" });
});

// sessions
routes.post("/sessions", SessionController.store);
// recipients
routes.post("/recipients", adminAuth, RecipientController.store);
routes.put("/recipients", adminAuth, RecipientController.update);
// deliverymen
routes.get("/deliverymen", adminAuth, DeliveryManController.index);
routes.post("/deliverymen", adminAuth, DeliveryManController.store);
routes.delete("/deliverymen", adminAuth, DeliveryManController.destroy);
routes.put("/deliverymen", adminAuth, DeliveryManController.update);
// orders
routes.get("/orders", adminAuth, OrderController.index);
routes.post("/orders", adminAuth, OrderController.store);
routes.put("/orders", adminAuth, OrderController.update);
routes.delete("/orders", adminAuth, OrderController.destroy);
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
// delivery problems: https://fastfeet.com/delivery/3/problems
routes.get("/delivery/problems", adminAuth, DeliveryProblemsController.index);
routes.get(
  "/delivery/:delivery_id/problems",
  adminAuth,
  DeliveryProblemsController.show
);
routes.delete(
  "/delivery/:problem_id/cancel-delivery",
  adminAuth,
  DeliveryProblemsController.destroy
);
routes.post(
  "/delivery/:delivery_id/problems",
  DeliveryProblemsController.store
);

// files
routes.post("/files", Upload.avatar, FileController.store);
// signatures
routes.post("/signatures", Upload.signature, SignatureController.store);
export default routes;
