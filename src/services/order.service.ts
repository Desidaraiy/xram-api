import OrderRepository from "../repositories/order.repository";
import Order from "../models/order.model";
import UserService from "../services/user.service";
import SubscriptionService from "../services/subscription.service";
import PaymentService from "../utils/yookassa.utils";
import Payment from "yookassa-ts/lib/payment";
import EmailService from "../utils/email.utils";
import GoodInOrder from "../interfaces/goodinorder.interface";

interface CreateSubscriptionOrderParams {
  plan: any;
  days: number;
  subscriptionId: number;
  userId: number;
  total: number;
}

interface CreatePatronageOrderParams {
  plan: any;
  amount: number;
  userId: number;
  until: Date;
  patronageId: number;
}

class OrderService {
  public async getAllOrders(): Promise<Order[]> {
    return OrderRepository.findAll();
  }

  public async createSubscriptionOrder(
    params: CreateSubscriptionOrderParams
  ): Promise<Order> {
    const orderBody = [
      {
        id: params.subscriptionId,
        quantity: 1,
        comment: "",
        good: {
          id: params.plan.id,
          title: params.plan.title,
          price: params.total,
          description: `На ${params.days} дней`,
        },
      },
    ];
    const orderBodyString = JSON.stringify(orderBody);
    const order = await Order.create({
      body: orderBodyString,
      total: params.total,
      userId: params.userId,
      orderStatus: false,
      comment: "",
      candlesComment: "",
      notesComment: "",
    });
    return order;
  }

  public async createPatronageOrder(
    params: CreatePatronageOrderParams
  ): Promise<Order> {
    const orderBody = [
      {
        id: params.patronageId,
        quantity: 1,
        comment: "",
        good: {
          id: params.patronageId,
          title: `Подписка: ${params.plan.title}`,
          price: params.amount,
          description: `На 30 дней`,
        },
      },
    ];
    const orderBodyString = JSON.stringify(orderBody);
    const order = await Order.create({
      body: orderBodyString,
      total: params.amount,
      userId: params.userId,
      orderStatus: false,
      comment: "",
      candlesComment: "",
      notesComment: "",
    });
    return order;
  }

  public async getUserWithSubscription(userId: number) {
    const user = await UserService.getUserById(userId);
    if (!user) throw new Error("User not found");

    const extendedUser = await UserService.getExtendedUserById(user.id);
    return extendedUser;
  }

  public async processOrderBody(
    orderBody: GoodInOrder[],
    subscriptionId: number
  ) {
    const services = await SubscriptionService.getAllServices();

    for (let item of orderBody) {
      const service = services.find((service) =>
        item.good.title.toLowerCase().includes(service.title.toLowerCase())
      );
      if (service) {
        for (let i = 1; i <= item.quantity; i++) {
          const hasLimit = await SubscriptionService.checkSubscriptionLimit(
            subscriptionId,
            service.id
          );
          if (!hasLimit) {
            item.good.price = 0;
            await SubscriptionService.incrementSubscriptionLimit(
              subscriptionId,
              service.id
            );
          }
        }
      }
    }
  }

  public createOrder = async (orderData: Order): Promise<Order> => {
    return OrderRepository.create(orderData);
  };

  public createAndProcessOrder = async (orderData: any, user: any) => {
    const createdOrder = await this.createOrder(orderData);

    if (orderData.total > 0) {
      const payment: Payment = await PaymentService.getInstance().createPayment(
        createdOrder.total.toString(),
        createdOrder.id
      );
      return { payment };
    } else {
      await this.sendOrderEmails(user, createdOrder);
      const payment = {
        confirmation: {
          confirmation_url:
            "https://vratarnitca.ru/thank-you?order=" + createdOrder.id,
        },
      };
      return { payment };
    }
  };

  public createAndProcessGuestOrder = async (orderData: any) => {
    const createdOrder = await this.createOrder(orderData);
    if (orderData.total > 0) {
      const payment: Payment = await PaymentService.getInstance().createPayment(
        createdOrder.total.toString(),
        createdOrder.id
      );
      return { payment };
    } else {
      const user = UserService.createGuestUser();
      await this.sendOrderEmails(user, createdOrder);
      const payment = {
        confirmation: {
          confirmation_url:
            "https://vratarnitca.ru/thank-you?order=" + createdOrder.id,
        },
      };
      return { payment };
    }
  };

  private sendOrderEmails = async (user: any, order: Order): Promise<void> => {
    EmailService.getInstance().sendAdminEmail(user, order);
    EmailService.getInstance().sendUserEmail(user, order);
  };

  public async getOrderById(id: number): Promise<Order | null> {
    return OrderRepository.findById(id);
  }

  public async completeOrder(id: number): Promise<void> {
    await OrderRepository.update({ orderStatus: true }, id);
  }

  public async getUserIdByOrderId(id: number): Promise<number | null> {
    const order = await OrderRepository.findById(id);
    if (order) {
      return order.userId;
    }
    return null;
  }

  public async getOrdersByUserToken(userId: number): Promise<Order[]> {
    return OrderRepository.findByUserId(userId);
  }
}

export default new OrderService();
