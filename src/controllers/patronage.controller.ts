import patronageService from "../services/patronage.service";
import { Request, Response } from "express";
import PaymentService from "../utils/yookassa.utils";
import Patronage from "../models/patronage.model";

class PatronageController {
  public handlePatronage = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { user, planId } = req.body;
    try {
      const userPatronages = await patronageService.getUserPatronages(user.id);
      const existingPatronage = userPatronages.find(
        (patronage) => patronage.planId === planId
      );
      if (existingPatronage) {
        await this.renewPatronage(req, res, existingPatronage);
      } else {
        await this.createPatronage(req, res);
      }
    } catch (error: any) {
      res.status(500).json({ state: "error", message: error.message });
    }
  };

  private async createPatronage(req: Request, res: Response): Promise<void> {
    const { user, planId, amount } = req.body;
    try {
      const subscription = await patronageService.newPatronage(
        user,
        amount,
        planId
      );
      const payment =
        await PaymentService.getInstance().createSubscriptionPayment(
          subscription.order.total.toString(),
          subscription.order.id
        );
      res.status(201).json({ state: "success", data: payment });
    } catch (error: any) {
      res.status(500).json({ state: "error", message: error.message });
    }
  }

  private async renewPatronage(
    req: Request,
    res: Response,
    patronage: Patronage
  ): Promise<void> {
    const { user, planId, amount } = req.body;
    try {
      const renewedSubscription = await patronageService.renewPatronage(
        user,
        planId,
        amount,
        patronage
      );
      const payment =
        await PaymentService.getInstance().createSubscriptionPayment(
          renewedSubscription.order.total.toString(),
          renewedSubscription.order.id
        );
      res.status(200).json({ state: "success", data: payment });
    } catch (error: any) {
      res.status(500).json({ state: "error", message: error.message });
    }
  }

  public async cancelPatronage(req: Request, res: Response): Promise<void> {
    const patronageId = parseInt(req.params.id, 10);
    try {
      const patronage = await patronageService.cancelPatronage(patronageId);
      res.status(200).json({ state: "success", data: patronage });
    } catch (error: any) {
      res.status(500).json({ state: "error", message: error.message });
    }
  }
}

export default new PatronageController();
