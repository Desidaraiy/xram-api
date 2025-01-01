import { Request, Response } from "express";
import GoodService from "../services/good.service";

class GoodController {
  public async getAllGoods(req: Request, res: Response): Promise<void> {
    const goods = await GoodService.getAll();
    res.status(200).json({ state: "success", data: goods });
  }
}

export default new GoodController();
