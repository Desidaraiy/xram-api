import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
const clientMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("client middleware");
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const user = await UserService.verifyToken(token);
    if (user) {
      req.body.user = user;
      next();
    } else {
      res.status(200).json({ state: "error", data: "Invalid credentials" });
    }
  } else {
    res.status(200).json({ state: "error", data: "Unauthorized" });
  }
};

export default clientMiddleware;
