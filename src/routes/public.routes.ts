import { Router } from "express";
import ScheduleController from "../controllers/schedule.controller";
import GoodController from "../controllers/good.controller";
import UserController from "../controllers/user.controller";
import subscriptionController from "../controllers/subscription.controller";
import orderController from "../controllers/order.controller";

class PublicRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get("/schedules", ScheduleController.getAllSchedules);
    this.router.get("/goods", GoodController.getAllGoods);
    this.router.post("/forgot-password", UserController.forgotPassword);
    this.router.post("/email-verification", UserController.verifyEmail);
    this.router.post("/change-password", UserController.changePassword);
    this.router.get("/plans", subscriptionController.getAllPlans);
    this.router.post("/orders", orderController.createGuestOrder);
  }
}

export default new PublicRoutes().router;
