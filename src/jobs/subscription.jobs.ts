import moment from "moment";
import subscriptionService from "../services/subscription.service";
import PaymentService from "../utils/yookassa.utils";

// subscription.jobs.ts
export default {
  async run() {
    /* 
    действия
    1. получить все активные подписки
    2. получить текущую дату 
    3. сравнить дату активной подписки в поле until с текущей c помощью moment.difference
    4. если текущая дата равна или больше дате активной подписки, то сделать ее неактивной
    5. запустить автоматическую оплату подписки с помощью сохраненного метода платежа в user unclude payMethods
    6. выставить счет для автоматической оплаты через yookassa
    */
    const subscriptions = await subscriptionService.getAllSubscriptions();
    const now = new Date();
    for (const subscription of subscriptions) {
      const diff = moment(subscription.until).diff(now, "days");
      if (diff <= 0 && subscription.active === true) {
        await subscriptionService.deactivateSubscription(subscription.id);
        const { updatedSubscription, order, payMethods } =
          await subscriptionService.autoUpdateSubscription(subscription);

        if (payMethods.length > 0) {
          const payment =
            await PaymentService.getInstance().renewSubscriptionPayment(
              order.total.toString(),
              order.id,
              payMethods[0].token
            );
        }
      }
    }
  },
};
