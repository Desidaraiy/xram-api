import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./user.model";

interface OrderAttributes {
  id: number;
  body: string;
  comment: string;
  total: number;
  userId: number;
  orderStatus: boolean;
  candlesComment: string;
  notesComment: string;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public body!: string;
  public comment!: string;
  public total!: number;
  public userId!: number;
  public orderStatus!: boolean;
  public candlesComment!: string;
  public notesComment!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    body: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
    comment: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    orderStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    candlesComment: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
    notesComment: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
  },
  {
    tableName: "orders",
    sequelize,
  }
);

Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Order, { foreignKey: "userId" });

export default Order;
