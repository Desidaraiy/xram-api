import express from "express";
import bodyParser from "body-parser";
import Routes from "./routes";
import cors from "cors";
import errorMiddleware from "./middleware/error.middleware";
import "./jobs";
import path from "path";

const app = express();

app.use(bodyParser.json());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorMiddleware);
app.use("/static", express.static(path.join(__dirname, "public")));
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
new Routes(app);

export default app;
