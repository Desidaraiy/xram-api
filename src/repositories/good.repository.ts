import Good from "../models/good.model";

class GoodRepository {
  public async getAll(): Promise<Good[]> {
    return Good.findAll();
  }

  public async findById(id: number): Promise<Good | null> {
    return Good.findByPk(id);
  }
}

export default new GoodRepository();
