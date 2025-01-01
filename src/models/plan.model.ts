import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Limit from "./limit.model";
import Subscription from "./subscription.model";
import Service from "./service.model";

interface PlanAttributes {
  id: number;
  title: string;
  price: number;
}

interface PlanCreationAttributes extends Optional<PlanAttributes, "id"> {}

class Plan
  extends Model<PlanAttributes, PlanCreationAttributes>
  implements PlanAttributes
{
  public id!: number;
  public title!: string;
  public price!: number;
}

Plan.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "plans",
    sequelize,
  }
);

Plan.hasMany(Limit, { as: "limits", foreignKey: "planId" });
Plan.hasMany(Service, { as: "services", foreignKey: "planId" });
// Plan.hasMany(Subscription, { as: "subscriptions", foreignKey: "planId" });

export default Plan;
