import { Request, Response } from "express";
import AdminService from "../services/admin.service";

class AdminController {
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const token = await AdminService.login(username, password);
      if (!token) {
        res.status(200).json({ state: "error", data: "Invalid credentials" });
      } else {
        res.status(200).json({ state: "success", data: { token } });
      }
    } catch (error) {
      res.status(200).json({ state: "error", data: "Invalid credentials" });
    }
  }

  public async checkToken(req: Request, res: Response): Promise<void> {
    const { token } = req.body;
    const admin = await AdminService.verifyToken(token);
    if (admin) {
      res.status(200).json({ state: "success", data: admin });
    } else {
      res.status(200).json({ state: "error", data: "unauthorized" });
    }
  }
}

export default new AdminController();
