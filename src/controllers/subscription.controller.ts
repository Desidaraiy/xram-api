import subscriptionService from "../services/subscription.service";
import { Request, Response } from "express";
import PaymentService from "../utils/yookassa.utils";

class SubscriptionController {
  public handleSubscription = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { user, planId } = req.body;
    try {
      const existingSubscription =
        await subscriptionService.getUserSubscription(user.id);
      if (existingSubscription) {
        await this.renewSubscription(req, res);
      } else {
        await this.createSubscription(req, res);
      }
    } catch (error: any) {
      res.status(500).json({ state: "error", message: error.message });
    }
  };

  private async createSubscription(req: Request, res: Response): Promise<void> {
    const { user, planId } = req.body;
    try {
      const subscription = await subscriptionService.newSubscription(
        user,
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

  private async renewSubscription(req: Request, res: Response): Promise<void> {
    const { user, planId } = req.body;
    try {
      const renewedSubscription = await subscriptionService.renewSubscription(
        user,
        planId
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

  public async cancelSubscription(req: Request, res: Response): Promise<void> {
    const { user } = req.body;
    try {
      const subscription = await subscriptionService.cancelSubscription(user);
      res.status(200).json({ state: "success", data: subscription });
    } catch (error: any) {
      res.status(500).json({ state: "error", message: error.message });
    }
  }

  public async getAllPlans(req: Request, res: Response): Promise<void> {
    const plans = await subscriptionService.getAllPlans();
    const services = await subscriptionService.getAllServices();
    res.status(200).json({ state: "success", data: { plans, services } });
  }
}

export default new SubscriptionController();
