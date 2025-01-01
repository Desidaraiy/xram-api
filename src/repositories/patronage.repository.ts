import User from "../models/user.model";
import Patronage from "../models/patronage.model";
import PatronagePlan from "../models/patronagePlan.model";

class SubscriptionRepository {
  public async findByUserId(id: number): Promise<Patronage[]> {
    return Patronage.findAll({ where: { userId: id } });
  }

  public async createPatronage(
    user: User,
    until: Date,
    amount: number,
    planId: number
  ): Promise<Patronage> {
    console.log("ok, create patronage", until, amount, planId);
    return Patronage.create({
      userId: user.id,
      until,
      amount,
      planId,
      active: false,
    });
  }

  public async renewPatronage(
    id: number,
    until: Date,
    amount: number
  ): Promise<Patronage | null> {
    Patronage.update({ until, amount }, { where: { id } });
    return Patronage.findOne({ where: { id } });
  }

  public async activatePatronage(id: number): Promise<Patronage | null> {
    Patronage.update({ active: true }, { where: { id } });
    return Patronage.findByPk(id);
  }

  public async cancelPatronage(id: number): Promise<Patronage | null> {
    Patronage.update({ active: false }, { where: { id } });
    return Patronage.findByPk(id);
  }

  public async deactivatePatronage(id: number): Promise<Patronage | null> {
    Patronage.update({ active: false }, { where: { id } });
    return Patronage.findByPk(id);
  }

  public async getAllPatronages(): Promise<Patronage[]> {
    return Patronage.findAll();
  }

  public async getPatronageIdByOrder(
    user: User,
    order: any
  ): Promise<number | null> {
    const orderBody = JSON.parse(order.body);
    const key = orderBody[0].good.title.trim().toLowerCase();
    const patronages = await Patronage.findAll({
      where: { userId: user.id },
      include: [{ model: PatronagePlan, as: "plan" }],
    });

    for (const item of patronages) {
      if (key.includes(item.plan?.title.trim().toLowerCase())) {
        return item.id;
      }
    }
    return null;
  }
}

export default new SubscriptionRepository();
