import { Request, Response } from "express";
import UserService from "../services/user.service";

class UserController {
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    const users = await UserService.getAllUsers();
    res.status(200).json({ state: "success", data: users });
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    const user = await UserService.getUserById(parseInt(req.params.id, 10));
    if (user) {
      res.status(200).json({ state: "success", data: user });
    } else {
      res.status(200).json({ state: "error", message: "User not found" });
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const user = await UserService.forgotPassword(email);
    if (user) {
      res.status(200).json({ state: "success" });
    } else {
      res.status(200).json({ state: "error", message: "User not found" });
    }
  }

  public async verifyEmail(req: Request, res: Response): Promise<void> {
    const { code } = req.body;
    const user = await UserService.verifyEmail(code);
    if (user) {
      res.status(200).json({ state: "success" });
    } else {
      res.status(200).json({ state: "error", message: "User not found" });
    }
  }

  public async changePassword(req: Request, res: Response): Promise<void> {
    const { code, password } = req.body;
    const user = await UserService.changePassword(code, password);
    if (user) {
      res.status(200).json({ state: "success" });
    } else {
      res.status(200).json({ state: "error", message: "User not found" });
    }
  }

  public async getUserProfile(req: Request, res: Response): Promise<void> {
    const user = await UserService.getExtendedUserById(
      parseInt(req.body.user.id, 10)
    );
    if (user) {
      res.status(200).json({ state: "success", data: user });
    } else {
      res.status(200).json({ state: "error", message: "User not found" });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    const { email, password, pushId } = req.body;
    const user = await UserService.login(req, email, password, pushId);
    if (user) {
      if (user.emailVerified) {
        res.status(200).json({ state: "success", data: user });
      } else {
        res.status(200).json({ state: "error", message: "Email not verified" });
      }
    } else {
      res.status(200).json({ state: "error", message: "User not found" });
    }
  }

  public async register(req: Request, res: Response): Promise<void> {
    const { email, phone, password, name, pushId } = req.body;
    const registered = await UserService.register(email, phone, password, name);
    if (registered != null) {
      // const user = await UserService.getUserById(registered.id);
      // if (pushId != null && pushId != "") {
      //   await UserService.updatePushId(user!.id, pushId);
      // }
      res.status(200).json({ state: "success" });
    } else {
      res.status(200).json({ state: "error", message: "User already exists" });
    }
  }

  public async deleteAccount(req: Request, res: Response): Promise<void> {
    const { user } = req.body;
    const deleted = await UserService.deleteAccount(user.id);
    if (deleted) {
      res.status(200).json({ state: "success" });
    } else {
      res.status(200).json({ state: "error", message: "User not found" });
    }
  }
}

export default new UserController();
