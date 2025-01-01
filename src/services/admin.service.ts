import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminRepository from "../repositories/admin.repository";
import Admin from "../models/admin.model";

class AdminService {
  public async login(
    username: string,
    password: string
  ): Promise<string | null> {
    const admin = await AdminRepository.findByUsername(username);
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      await AdminRepository.updateToken(admin.id, token);
      return token;
    }
    return null;
  }

  public async verifyToken(token: string): Promise<Admin | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
      };
      return AdminRepository.findByToken(token);
    } catch {
      return null;
    }
  }
}

export default new AdminService();
