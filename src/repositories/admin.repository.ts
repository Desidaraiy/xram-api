import Admin from "../models/admin.model";

class AdminRepository {
  public async findByUsername(username: string): Promise<Admin | null> {
    return Admin.findOne({ where: { username } });
  }

  public async updateToken(id: number, token: string): Promise<void> {
    await Admin.update({ token }, { where: { id } });
  }

  public async findByToken(token: string): Promise<Admin | null> {
    return Admin.findOne({ where: { token } });
  }
}

export default new AdminRepository();
