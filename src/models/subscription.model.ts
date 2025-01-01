import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Plan from "./plan.model";
import SubscriptionLimit from "./subscriptionLimit.model";

interface SubscriptionAttributes {
  id: number;
  planId: number;
  userId: number;
  until: Date;
  active: boolean;
}

interface SubscriptionCreationAttributes
  extends Optional<SubscriptionAttributes, "id"> {}

class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes
{
  public id!: number;
  public planId!: number;
  public userId!: number;
  public until!: Date;
  public active!: boolean;
  plan: any;
  limits: any;
}

Subscription.init(
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
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "subscription",
    sequelize,
  }
);

Subscription.belongsTo(Plan, { as: "plan", foreignKey: "planId" });
Subscription.hasMany(SubscriptionLimit, {
  foreignKey: "subscriptionId",
  as: "limits",
});

export default Subscription;
