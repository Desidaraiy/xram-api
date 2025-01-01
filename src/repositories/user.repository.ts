import Device from "../models/device.model";
import Order from "../models/order.model";
import Patronage from "../models/patronage.model";
import PatronagePlan from "../models/patronagePlan.model";
import PayMethod from "../models/paymethod.model";
import Plan from "../models/plan.model";
import Subscription from "../models/subscription.model";
import SubscriptionLimit from "../models/subscriptionLimit.model";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

class UserRepository {
  public async findAll(): Promise<User[]> {
    return User.findAll({
      attributes: { exclude: ["password", "token"] },
    });
  }

  public async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  public async findExtendedById(id: number): Promise<User | null> {
    return User.findOne({
      where: { id },
      include: [
        {
          model: Subscription,
          as: "subscriptions",
          include: [
            {
              model: SubscriptionLimit,
              as: "limits",
            },
            {
              model: Plan,
              as: "plan",
            },
          ],
        },
        {
          model: Patronage,
          as: "patronages",
          include: [
            {
              model: PatronagePlan,
              as: "plan",
            },
          ],
        },
        {
          model: PayMethod,
          as: "payMethods",
        },
        {
          model: Device,
          as: "devices",
        },
      ],
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return User.findOne({
      where: { email },
    });
  }

  public async findByCode(code: string): Promise<User | null> {
    return User.findOne({
      where: { confirmationCode: code },
    });
  }

  public async verifyEmail(id: number): Promise<User | null> {
    await User.update(
      { emailVerified: true, confirmationCode: "" },
      { where: { id } }
    );
    return User.findByPk(id);
  }

  public async updatePassword(
    id: number,
    password: string
  ): Promise<User | null> {
    await User.update(
      { password: password, confirmationCode: "" },
      { where: { id } }
    );
    return User.findByPk(id);
  }

  public async updateCode(id: number, code: string): Promise<User | null> {
    await User.update({ confirmationCode: code }, { where: { id } });
    return User.findByPk(id);
  }

  public async delete(id: number): Promise<boolean> {
    await Subscription.destroy({ where: { userId: id } });
    await Patronage.destroy({ where: { userId: id } });
    await PayMethod.destroy({ where: { userId: id } });
    await Device.destroy({ where: { userId: id } });
    // передаем все заказы удаленного пользователя в гостевого пользователя
    await Order.update({ userId: 8 }, { where: { userId: id } });
    const result = await User.destroy({ where: { id } });
    return result > 0;
  }

  public async register(
    email: string,
    phone: string,
    password: string,
    name: string
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    const encryptedPassword = await bcrypt.hash(password, 10);
    if (user) {
      return null;
    } else {
      return User.create({
        email,
        phone,
        password: encryptedPassword,
        name,
      });
    }
  }

  // public async updatePushId(id: number, pushId: string): Promise<void> {
  //   await User.update({ pushId }, { where: { id } });
  // }
}

export default new UserRepository();
