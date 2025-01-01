import Limit from "../models/limit.model";
import Plan from "../models/plan.model";
import Service from "../models/service.model";
import Subscription from "../models/subscription.model";
import User from "../models/user.model";

class SubscriptionRepository {
  public async findByUserId(id: number): Promise<Subscription | null> {
    return Subscription.findOne({ where: { userId: id } });
  }

  public async createSubscription(
    user: User,
    planId: number,
    until: Date
  ): Promise<Subscription> {
    return Subscription.create({
      userId: user.id,
      planId,
      until,
      active: false,
    });
  }

  public async renewSubscription(
    user: User,
    until: Date,
    planId: number
  ): Promise<Subscription | null> {
    Subscription.update({ until, planId }, { where: { userId: user.id } });
    return Subscription.findOne({ where: { userId: user.id } });
  }

  public async activateSubscription(user: User): Promise<Subscription | null> {
    Subscription.update({ active: true }, { where: { userId: user.id } });
    return Subscription.findOne({ where: { userId: user.id } });
  }

  public async cancelSubscription(user: User): Promise<Subscription | null> {
    Subscription.update({ active: false }, { where: { userId: user.id } });
    return Subscription.findOne({ where: { userId: user.id } });
  }

  public async deactivateSubscription(
    id: number
  ): Promise<Subscription | null> {
    Subscription.update({ active: false }, { where: { id } });
    return Subscription.findOne({ where: { id } });
  }

  public async getAllSubscriptions(): Promise<Subscription[]> {
    return Subscription.findAll();
  }

  public async getAllServices(): Promise<Service[]> {
    return Service.findAll();
  }

  public async getAllPlans(): Promise<Plan[]> {
    return Plan.findAll({
      include: [{ model: Limit, as: "limits" }],
    });
  }
}

export default new SubscriptionRepository();
