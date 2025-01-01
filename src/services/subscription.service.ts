import moment from "moment";
import Plan from "../models/plan.model";
import subscriptionRepository from "../repositories/subscription.repository";
import OrderService from "../services/order.service";
import User from "../models/user.model";
import Subscription from "../models/subscription.model";
import SubscriptionLimit from "../models/subscriptionLimit.model";
import Limit from "../models/limit.model";
import userRepository from "../repositories/user.repository";
import Service from "../models/service.model";

class SubscriptionService {
  public async getUserSubscription(
    userId: number
  ): Promise<Subscription | null> {
    return subscriptionRepository.findByUserId(userId);
  }

  public async newSubscription(user: User, planId: number) {
    const plan = await Plan.findByPk(planId);
    if (!plan) {
      throw new Error("Plan not found");
    }

    const days = plan.id === 3 ? 60 : 7;
    const total = plan.id === 3 ? 10000 : 1;
    const until = moment().add(days, "days").toDate();

    const subscription = await subscriptionRepository.createSubscription(
      user,
      planId,
      until
    );

    const order = await OrderService.createSubscriptionOrder({
      plan,
      days,
      subscriptionId: subscription.id,
      userId: user.id,
      total,
    });
    await this.updateUserSubscriptionLimits(subscription!.id);
    return { subscription, order };
  }

  public async renewSubscription(user: User, planId: number) {
    const until = moment().add(30, "days").toDate();
    const plan = await Plan.findByPk(planId);
    if (!plan) {
      throw new Error("Plan not found");
    }
    const subscription = await subscriptionRepository.renewSubscription(
      user,
      until,
      planId
    );
    const order = await OrderService.createSubscriptionOrder({
      plan,
      days: 30,
      subscriptionId: subscription!.id,
      userId: user.id,
      total: plan.price,
    });
    await this.updateUserSubscriptionLimits(subscription!.id);
    return { subscription, order };
  }

  // автоматическое продление подписки
  public async autoUpdateSubscription(subscription: Subscription) {
    const until = moment().add(30, "days").toDate();
    const plan = await Plan.findByPk(subscription.planId);
    const user = await userRepository.findExtendedById(subscription.userId);
    const updatedSubscription = await subscriptionRepository.renewSubscription(
      user!,
      until,
      plan!.id
    );
    const order = await OrderService.createSubscriptionOrder({
      plan,
      days: 30,
      subscriptionId: updatedSubscription!.id,
      userId: user!.id,
      total: plan!.price,
    });
    await this.updateUserSubscriptionLimits(updatedSubscription!.id);
    const payMethods = user!.payMethods;
    return { updatedSubscription, order, payMethods };
  }

  public async cancelSubscription(user: User) {
    const subscription = await subscriptionRepository.cancelSubscription(user);
    return subscription;
  }

  public async deactivateSubscription(subscriptionId: number) {
    return subscriptionRepository.deactivateSubscription(subscriptionId);
  }

  public async activateSubscription(user: User) {
    return subscriptionRepository.activateSubscription(user);
  }

  private async updateUserSubscriptionLimits(subscriptionId: number) {
    const subscription = await Subscription.findByPk(subscriptionId, {
      include: [
        { model: Plan, as: "plan", include: [{ model: Limit, as: "limits" }] },
      ],
    });
    const planLimits = subscription!.plan.limits;
    const existingLimits = await SubscriptionLimit.findAll({
      where: { subscriptionId },
    });
    const existingServiceIds = existingLimits.map((limit) => limit.serviceId);

    await SubscriptionLimit.update(
      { quantity: 0 },
      { where: { subscriptionId: subscription!.id } }
    );

    const newLimits = planLimits
      .map((planLimit: Limit) => {
        if (existingServiceIds.includes(planLimit.serviceId)) {
          return null;
        }
        return {
          subscriptionId: subscriptionId,
          serviceId: planLimit.serviceId,
          quantity: 0,
        };
      })
      .filter((limit: any) => limit !== null);
    if (newLimits.length > 0) {
      await SubscriptionLimit.bulkCreate(newLimits as any[]);
    }
  }

  public async incrementSubscriptionLimit(
    subscriptionId: number,
    serviceId: number
  ) {
    const limit = await SubscriptionLimit.increment("quantity", {
      where: { subscriptionId, serviceId },
    });
    return limit;
  }

  public async checkSubscriptionLimit(
    subscriptionId: number,
    serviceId: number
  ): Promise<boolean> {
    const [subscription, service] = await Promise.all([
      this.findSubscription(subscriptionId),
      this.findService(serviceId),
    ]);

    if (!subscription || !service) {
      throw new Error("Subscription or service not found");
    }

    const hasSubscriptionLimit = await this.hasSubscriptionLimit(
      subscription,
      service
    );

    return hasSubscriptionLimit;
  }

  private async findSubscription(
    subscriptionId: number
  ): Promise<Subscription | null> {
    return await Subscription.findByPk(subscriptionId, {
      include: [
        { model: SubscriptionLimit, as: "limits" },
        { model: Plan, as: "plan", include: [{ model: Limit, as: "limits" }] },
      ],
    });
  }

  private async findService(serviceId: number): Promise<Service | null> {
    return await Service.findByPk(serviceId);
  }

  private async hasSubscriptionLimit(
    subscription: Subscription,
    service: Service
  ): Promise<boolean> {
    const subscriptionLimit = subscription.limits.find(
      (limit: SubscriptionLimit) => limit.serviceId === service.id
    );
    const planLimit = subscription.plan.limits.find(
      (limit: Limit) => limit.serviceId === service.id
    );
    return subscriptionLimit?.quantity >= planLimit?.quantity;
  }

  public async getAllSubscriptions(): Promise<Subscription[]> {
    return subscriptionRepository.getAllSubscriptions();
  }

  public async getAllServices(): Promise<Service[]> {
    return subscriptionRepository.getAllServices();
  }

  public async getAllPlans(): Promise<Plan[]> {
    return subscriptionRepository.getAllPlans();
  }
}

export default new SubscriptionService();
