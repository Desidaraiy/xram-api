import moment from "moment";
import OrderService from "../services/order.service";
import User from "../models/user.model";
import userRepository from "../repositories/user.repository";
import patronageRepository from "../repositories/patronage.repository";
import Patronage from "../models/patronage.model";
import PatronagePlan from "../models/patronagePlan.model";

class PatronageService {
  public async getUserPatronages(userId: number): Promise<Patronage[]> {
    const patronages = await patronageRepository.findByUserId(userId);
    if (patronages && patronages.length > 0) {
      return patronages;
    } else {
      return [];
    }
  }

  public async getAllPlans(): Promise<PatronagePlan[]> {
    return PatronagePlan.findAll();
  }

  public async newPatronage(user: User, amount: number, planId: number) {
    const plan = await PatronagePlan.findByPk(planId);
    const until = moment().add(30, "days").toDate();
    const patronage = await patronageRepository.createPatronage(
      user,
      until,
      amount,
      planId
    );
    const order = await OrderService.createPatronageOrder({
      plan,
      amount,
      userId: user.id,
      until,
      patronageId: patronage.id,
    });

    return { patronage, order };
  }

  public async renewPatronage(
    user: User,
    planId: number,
    amount: number,
    patronage: Patronage
  ) {
    const until = moment().add(30, "days").toDate();
    const renewedPatronage = await patronageRepository.renewPatronage(
      patronage.id,
      until,
      amount
    );
    const plan = await PatronagePlan.findByPk(planId);
    const order = await OrderService.createPatronageOrder({
      plan: plan,
      amount: amount,
      userId: user.id,
      until,
      patronageId: patronage!.id,
    });
    return { patronage, order };
  }

  public async autoUpdatePatronage(patronage: Patronage) {
    const until = moment().add(30, "days").toDate();
    const user = await userRepository.findExtendedById(patronage.userId);
    const updatedPatronage = await patronageRepository.renewPatronage(
      patronage.id,
      until,
      patronage.amount
    );
    const plan = await PatronagePlan.findByPk(patronage.planId);
    const order = await OrderService.createPatronageOrder({
      plan: plan,
      amount: patronage!.amount,
      userId: user!.id,
      until,
      patronageId: patronage!.id,
    });

    const payMethods = user!.payMethods;
    return { updatedPatronage, order, payMethods };
  }

  public async cancelPatronage(patronageId: number) {
    const patronage = await patronageRepository.cancelPatronage(patronageId);
    return patronage;
  }

  public async deactivatePatronage(patronageId: number) {
    return patronageRepository.deactivatePatronage(patronageId);
  }

  public async activatePatronage(user: User, order: any) {
    const patronageId = await patronageRepository.getPatronageIdByOrder(
      user,
      order
    );
    return patronageRepository.activatePatronage(patronageId!);
  }

  public async getAllPatronages(): Promise<Patronage[]> {
    return patronageRepository.getAllPatronages();
  }
}

export default new PatronageService();
