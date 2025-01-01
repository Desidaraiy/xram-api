import { Request, Response } from "express";
import OrderService from "../services/order.service";
import UserService from "../services/user.service";

class OrderController {
  public async getAllOrders(req: Request, res: Response): Promise<void> {
    const orders = (await OrderService.getAllOrders()).reverse();
    res.status(200).json({ state: "success", data: orders });
  }

  public createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.body.user.id, 10);
      const extendedUser = await OrderService.getUserWithSubscription(userId);

      if (extendedUser!.subscriptions && extendedUser!.subscriptions.active) {
        await OrderService.processOrderBody(
          req.body.order.body,
          extendedUser!.subscriptions.id
        );
      }

      const total = this.calculateTotal(req.body.order.body);
      req.body.order.userId = extendedUser!.id;
      req.body.order.body = JSON.stringify(req.body.order.body);
      req.body.order.total = total;

      const result = await OrderService.createAndProcessOrder(
        req.body.order,
        extendedUser
      );

      res.status(201).json({ state: "success", data: result.payment });
    } catch (error: any) {
      res.status(500).json({ state: "error", message: error.message });
    }
  };

  public createGuestOrder = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      req.body.order.userId = 8;
      req.body.order.total = this.calculateTotal(req.body.order.body);
      req.body.order.body = JSON.stringify(req.body.order.body);
      const result = await OrderService.createAndProcessGuestOrder(
        req.body.order
      );
      res.status(201).json({ state: "success", data: result.payment });
    } catch (error: any) {
      res.status(500).json({ state: "error", message: error.message });
    }
  };

  private calculateTotal = (body: any[]): number => {
    return body.reduce(
      (total, item) => total + item.good.price * item.quantity,
      0
    );
  };

  public async getOrderById(req: Request, res: Response): Promise<void> {
    const order = await OrderService.getOrderById(parseInt(req.params.id, 10));
    if (order) {
      res.status(200).json({ state: "success", data: order });
    } else {
      res.status(200).json({ state: "error", data: "Order not found" });
    }
  }

  public async completeOrder(req: Request, res: Response): Promise<void> {
    await OrderService.completeOrder(parseInt(req.params.id, 10));
    res
      .status(200)
      .json({ state: "success", message: "Order completed successfully" });
  }

  public async getOrdersByUserToken(
    req: Request,
    res: Response
  ): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(200).json({ state: "error", data: "Unauthorized" });
    }
    const user = await UserService.verifyToken(token ?? "");
    if (!user) {
      res.status(200).json({ state: "error", data: "Invalid credentials" });
    } else {
      const orders = await OrderService.getOrdersByUserToken(user.id);
      res.status(200).json({ state: "success", data: orders });
    }
  }
}

export default new OrderController();
