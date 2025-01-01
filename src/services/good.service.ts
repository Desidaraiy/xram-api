import Good from "../models/good.model";
import goodRepository from "../repositories/good.repository";

class GoodService {
  public async getAll(): Promise<Good[]> {
    return goodRepository.getAll();
  }
}

export default new GoodService();
