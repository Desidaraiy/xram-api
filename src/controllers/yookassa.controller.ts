import { Request, Response } from "express";
import PaymentService from "../utils/yookassa.utils";
import orderService from "../services/order.service";
import userService from "../services/user.service";
import EmailService from "../utils/email.utils";
import subscriptionService from "../services/subscription.service";
import patronageService from "../services/patronage.service";

class YookassaController {
  public webhook = async (req: Request, res: Response) => {
    const verified = await PaymentService.getInstance().verifyNotification(
      req.body
    );
    if (!verified) {
      res.status(200).json({ state: "error" });
      return;
    }

    if (req.body.event === "payment.succeeded") {
      await this.orderCompletionHub(req);
    }
    res.status(200).json({ state: "success" });
  };

  public async orderCompletionHub(req: Request) {
    const orderId = parseInt(req.body.object.metadata.orderId, 10);
    const order = await orderService.getOrderById(orderId);
    const userId = await orderService.getUserIdByOrderId(orderId);
    if (!order || !userId) {
      return;
    }
    const user =
      userId != 8
        ? await userService.getUserById(userId)
        : userService.createGuestUser();
    const body = JSON.parse(order.body);
    const key = body[0].good.title.trim().toLowerCase();
    if (key.includes("подписка")) {
      if (key.includes("пожертвования") || key.includes("помощь")) {
        patronageService.activatePatronage(user!, order);
      } else {
        subscriptionService.activateSubscription(user!);
        userService.savePaymentInfo(user!, req.body.object.payment_method);
      }
    }
    await orderService.completeOrder(orderId);
    EmailService.getInstance().sendAdminEmail(user!, order);
    EmailService.getInstance().sendUserEmail(user!, order);
    return;
  }
}

export default new YookassaController();
