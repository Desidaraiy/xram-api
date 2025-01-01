import moment from "moment";
import Order from "../models/order.model";
import User from "../models/user.model";
import sequelize from "sequelize";
import { Op } from "sequelize";
import EmailService from "../utils/email.utils";

export default {
  async run() {
    /* 
    действия
    1. получить все заказы, в которых в item.good.title есть "сорокоуст"
    2. получить пользователей этих заказов по userId заказа
    3. отправить письмо на почту пользователей, у которых со дня заказа сорокоуста прошло 40 дней, через moment.diff
    */

    const orderWithSorokoust = await Order.findAll({
      where: sequelize.where(
        sequelize.fn(
          "JSON_UNQUOTE",
          sequelize.fn("JSON_EXTRACT", sequelize.col("body"), "$")
        ),
        {
          [Op.like]: "%сорокоуст%",
        }
      ),
    });
    orderWithSorokoust.forEach(async (order) => {
      const date = new Date();
      if (moment(date).diff(moment(order.updatedAt), "days") == 38) {
        const user = await User.findByPk(order.userId);
        EmailService.getInstance().sendSorokoustEmail(user!);
      }
    });
  },
};
