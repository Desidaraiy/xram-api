import Payment from "yookassa-ts/lib/payment";
import { CurrencyEnum } from "yookassa-ts/lib/types/Common";
import { ConfirmationTypesEnum } from "yookassa-ts/lib/types/Payment";
import { PaymentMethodsEnum } from "yookassa-ts/lib/types/PaymentMethod";
import YooKassa from "yookassa-ts/lib/yookassa";
import { v4 as uuid } from "uuid";

class PaymentService {
  private static instance: PaymentService;
  private yooKassa: YooKassa;

  private constructor() {
    this.yooKassa = new YooKassa({
      shopId: "408641",
      // shopId: "447348",
      secretKey: "live_UouQueNDqIf0ScMdQARd8IVTvCh5aUziO7AmTJ1AeLo",
      // secretKey: "test_sxNpJEwg2zsEOdm1hStpK-GeMs7XiuOpx-W0Gg4y1sY",
    });
  }

  public static getInstance(): PaymentService {
    if (!this.instance) {
      this.instance = new PaymentService();
    }
    return this.instance;
  }

  public async createPayment(
    amount: string,
    orderId: number
  ): Promise<Payment> {
    const payment = await this.yooKassa.createPayment(
      {
        amount: {
          value: amount,
          currency: CurrencyEnum.RUB,
        },
        payment_method_data: {
          type: PaymentMethodsEnum.bank_card,
        },
        capture: true,
        confirmation: {
          type: ConfirmationTypesEnum.redirect,
          confirmation_url: "",
          return_url: "https://vratarnitca.ru/thank-you?order=" + orderId,
        },
        description: "Оплата заказа #" + orderId,
        metadata: {
          orderId: orderId.toString(),
        },
      },
      uuid()
    );
    return payment;
  }

  public async verifyNotification(requestBody: any): Promise<boolean> {
    let ret = false;

    if (
      requestBody.type != undefined &&
      requestBody.type == "notification" &&
      requestBody.event != undefined &&
      requestBody.event != ""
    ) {
      ret = true;
    }

    return ret;
  }

  public async createSubscriptionPayment(
    amount: string,
    orderId: number
  ): Promise<Payment | null> {
    try {
      const payment = await this.yooKassa.createPayment(
        {
          amount: {
            value: amount,
            currency: CurrencyEnum.RUB,
          },
          payment_method_data: {
            type: PaymentMethodsEnum.bank_card,
          },
          save_payment_method: true,
          capture: true,
          confirmation: {
            type: ConfirmationTypesEnum.redirect,
            confirmation_url: "",
            return_url: "https://vratarnitca.ru/thank-you?order=" + orderId,
          },
          description: "Оплата заказа #" + orderId,
          metadata: {
            orderId: orderId.toString(),
          },
        },
        uuid()
      );
      return payment;
    } catch (error: any) {
      console.error("Payment error:", error.stack || error.message || error);
      return null;
    }
  }

  public async renewSubscriptionPayment(
    amount: string,
    orderId: number,
    payMethodToken: string
  ): Promise<Payment> {
    const payment = await this.yooKassa.createPayment(
      {
        amount: {
          value: amount,
          currency: CurrencyEnum.RUB,
        },
        payment_method_id: payMethodToken,
        capture: true,
        description: "Оплата заказа #" + orderId,
        metadata: {
          orderId: orderId.toString(),
        },
        confirmation: null,
      },
      uuid()
    );
    return payment;
  }
}

export default PaymentService;
