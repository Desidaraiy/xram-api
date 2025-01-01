import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface AdminAttributes {
  id: number;
  username: string;
  password: string;
  name: string;
  token?: string;
}

interface AdminCreationAttributes
  extends Optional<AdminAttributes, "id" | "token"> {}

class Admin
  extends Model<AdminAttributes, AdminCreationAttributes>
  implements AdminAttributes
{
  public id!: number;
  public username!: string;
  public password!: string;
  public name!: string;
  public token?: string;
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    token: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
  },
  {
    tableName: "admins",
    sequelize,
  }
);

export default Admin;
