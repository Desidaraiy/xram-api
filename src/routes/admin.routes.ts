import { Router } from "express";
import AdminController from "../controllers/admin.controller";
import UserController from "../controllers/user.controller";
import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import adminMiddleware from "../middleware/adminAuth.middleware";
import ScheduleController from "../controllers/schedule.controller";
import OrderController from "../controllers/order.controller";

class AdminRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post(
      "/login",
      [
        body("username")
          .isString()
          .notEmpty()
          .withMessage("Username is required"),
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
      AdminController.login
    );

    this.router.post("/check", AdminController.checkToken);

    this.router.get("/users", adminMiddleware, UserController.getAllUsers);
    this.router.get("/users/:id", adminMiddleware, UserController.getUserById);
    this.router.post(
      "/schedules/update",
      adminMiddleware,
      ScheduleController.updateSchedule
    );
    this.router.post(
      "schedules/all",
      adminMiddleware,
      ScheduleController.updateAllSchedules
    );

    this.router.get(
      "/orders/:id",
      adminMiddleware,
      OrderController.getOrderById
    );
    this.router.post(
      "/orders/complete/:id",
      adminMiddleware,
      OrderController.completeOrder
    );
    this.router.get("/orders", adminMiddleware, OrderController.getAllOrders);
    this.router.get(
      "/schedules",
      adminMiddleware,
      ScheduleController.getAllSchedules
    );
  }
}

export default new AdminRoutes().router;
