import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface SubscriptionLimitAttributes {
  id: number;
  subscriptionId: number;
  serviceId: number;
  quantity: number;
}

interface SubscriptionLimitCreationAttributes
  extends Optional<SubscriptionLimitAttributes, "id"> {}

class SubscriptionLimit
  extends Model<
    SubscriptionLimitAttributes,
    SubscriptionLimitCreationAttributes
  >
  implements SubscriptionLimitAttributes
{
  public id!: number;
  public subscriptionId!: number;
  public serviceId!: number;
  public quantity!: number;
}

SubscriptionLimit.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    subscriptionId: {
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
      defaultValue: 0,
    },
  },
  {
    tableName: "subscription_limits",
    sequelize,
  }
);

export default SubscriptionLimit;
