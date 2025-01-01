import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Service from "./service.model";
import Plan from "./plan.model";

interface LimitAttributes {
  id: number;
  planId: number;
  serviceId: number;
  quantity: number;
}

interface LimitCreationAttributes extends Optional<LimitAttributes, "id"> {}

class Limit
  extends Model<LimitAttributes, LimitCreationAttributes>
  implements LimitAttributes
{
  public id!: number;
  public planId!: number;
  public serviceId!: number;
  public quantity!: number;
}

Limit.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    planId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: "limits",
    sequelize,
  }
);

export default Limit;
