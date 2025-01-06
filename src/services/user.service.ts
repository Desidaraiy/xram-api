import UserRepository from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import EmailService from "../utils/email.utils";
import { v4 as uuid } from "uuid";
import PayMethod from "../models/paymethod.model";
import { Request } from "express";
import Device from "../models/device.model";
import DeviceRepository from "../repositories/device.repository";

class UserService {
  public async getAllUsers(): Promise<User[]> {
    return UserRepository.findAll();
  }

  public async getUserById(id: number): Promise<User | null> {
    return UserRepository.findById(id);
  }

  public async getExtendedUserById(id: number): Promise<User | null> {
    return UserRepository.findExtendedById(id);
  }

  public async forgotPassword(email: string): Promise<boolean> {
    let user = await UserRepository.findByEmail(email);
    if (user) {
      const code: string = uuid();
      user = await UserRepository.updateCode(user.id, code);
      if (!user) return false;
      EmailService.getInstance().sendPasswordRecovery(user);
      return true;
    }
    return false;
  }

  public async verifyEmail(code: string): Promise<User | null> {
    const user = await UserRepository.findByCode(code);
    if (user) {
      return UserRepository.verifyEmail(user.id);
    }
    return null;
  }

  public async changePassword(
    code: string,
    password: string
  ): Promise<User | null> {
    let user = await UserRepository.findByCode(code);
    if (user) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      user = await UserRepository.updatePassword(user.id, encryptedPassword);
      return user;
    }
    return null;
  }

  public async login(
    request: Request,
    email: string,
    password: string,
    pushId: string = ""
  ): Promise<User | null> {
    const user = await UserRepository.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "24h",
      });
      const newDevice = {
        userId: user.id,
        pushId,
        token,
        realIp: request.ip,
        browser: request.headers["user-agent"],
      };
      user.dataValues.token = token;
      await DeviceRepository.create(newDevice);
      return user;
    }
    return null;
  }

  public async register(
    email: string,
    phone: string,
    password: string,
    name: string
  ) {
    let user = await UserRepository.register(email, phone, password, name);
    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "24h",
      });
      const code = uuid();
      user = await UserRepository.updateCode(user.id, code);
      EmailService.getInstance().sendConfirmationEmail(user!);
      return user;
    }
  }

  public async deleteAccount(id: number) {
    return UserRepository.delete(id);
  }

  public async verifyToken(token: string): Promise<User | null> {
    try {
      const device = await DeviceRepository.findByToken(token);
      if (device) {
        const user = await UserRepository.findById(device.userId!);
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          id: number;
        };
        if (user && user.id === decoded.id) {
          return user;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  public async savePaymentInfo(user: User, paymentInfo: any): Promise<void> {
    await PayMethod.create({
      userId: user.id,
      payMethodToken: paymentInfo.id,
      payMethodBody: JSON.stringify(paymentInfo.card),
    });
  }

  public createGuestUser(): User {
    const user = new User();
    user.name = "Гость";
    user.email = "Не указан";
    user.phone = "Не указан";
    return user;
  }
}

export default new UserService();
