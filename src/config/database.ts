import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "xram",
  process.env.DB_USER || "admin",
  process.env.DB_PASSWORD || "airtnueysapafivujbgnxgvgm",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: 3306,
    dialect: "mysql",
    logging: console.log,
  }
);

export default sequelize;
