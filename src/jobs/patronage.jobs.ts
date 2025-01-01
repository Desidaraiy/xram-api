import moment from "moment";
import patronageService from "../services/patronage.service";
import PaymentService from "../utils/yookassa.utils";

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
    const patronages = await patronageService.getAllPatronages();
    const now = new Date();
    for (const patronage of patronages) {
      const diff = moment(patronage.until).diff(now, "days");
      if (diff <= 0 && patronage.active === true) {
        await patronageService.deactivatePatronage(patronage.id);
        const { updatedPatronage, order, payMethods } =
          await patronageService.autoUpdatePatronage(patronage);
        if (payMethods.length > 0) {
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
