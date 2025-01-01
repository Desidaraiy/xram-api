import { Application } from "express";
import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";
import publicRoutes from "./public.routes";
import yookassaRoutes from "./yookassa.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/admin", adminRoutes);
    app.use("/clients", userRoutes);
    app.use("/public", publicRoutes);
    app.use("/kassa", yookassaRoutes);
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
  }
}
