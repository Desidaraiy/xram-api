import { Request, Response, NextFunction } from "express";
import AdminService from "../services/admin.service";
const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("admin middleware");
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const admin = await AdminService.verifyToken(token);
    if (admin) {
      req.body.admin = admin;
      next();
    } else {
      res.status(200).json({ state: "error", data: "Invalid credentials" });
    }
  } else {
    res.status(200).json({ state: "error", data: "Unauthorized" });
  }
};

export default adminMiddleware;
