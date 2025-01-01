import { Router } from "express";
import UserController from "../controllers/user.controller";
import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import orderController from "../controllers/order.controller";
import clientMiddleware from "../middleware/clientAuth.middleware";
import ScheduleController from "../controllers/schedule.controller";
import OrderController from "../controllers/order.controller";
import SubscriptionController from "../controllers/subscription.controller";
import patronageController from "../controllers/patronage.controller";

class UserRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post(
      "/login",
      [
        body("email").isString().notEmpty().withMessage("Email is required"),
        body("password")
          .isString()
          .notEmpty()
          .withMessage("Password is required"),
      ],
      (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      },
      UserController.login
    );

    this.router.post(
      "/register",
      [
        body("email").isString().notEmpty().withMessage("Email is required"),
        body("password")
          .isString()
          .notEmpty()
          .withMessage("Password is required"),
        body("name").isString().notEmpty().withMessage("Name is required"),
      ],
      (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      },
      UserController.register
    );

    this.router.get(
      "/orders",
      clientMiddleware,
      orderController.getOrdersByUserToken
    );

    this.router.post("/orders", clientMiddleware, OrderController.createOrder);

    this.router.get(
      "/orders/:id",
      clientMiddleware,
      OrderController.getOrderById
    );

    this.router.get(
      "/profile",
      clientMiddleware,
      UserController.getUserProfile
    );

    this.router.get(
      "/schedules",
      clientMiddleware,
      ScheduleController.getAllSchedules
    );

    this.router.post(
      "/subscriptions",
      clientMiddleware,
      SubscriptionController.handleSubscription
    );

    this.router.get(
      "/subscriptions/cancel",
      clientMiddleware,
      SubscriptionController.cancelSubscription
    );

    this.router.post(
      "/patronages",
      clientMiddleware,
      patronageController.handlePatronage
    );

    this.router.get(
      "/patronages/cancel/:id",
      clientMiddleware,
      patronageController.cancelPatronage
    );

    this.router.post(
      "/delete-account",
      clientMiddleware,
      UserController.deleteAccount
    );
  }
}

export default new UserRoutes().router;
