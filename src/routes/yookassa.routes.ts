import { Router } from "express";
import yookassaController from "../controllers/yookassa.controller";

class YookassaRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post("/payment-hook", yookassaController.webhook);
  }
}

export default new YookassaRoutes().router;
