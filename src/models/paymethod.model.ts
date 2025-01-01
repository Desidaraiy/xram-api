import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface PayMethodAttributes {
  id: number;
  userId: number;
  payMethodToken: string;
  payMethodBody: string;
}

interface PayMethodCreationAttributes
  extends Optional<PayMethodAttributes, "id"> {}

class PayMethod
  extends Model<PayMethodAttributes, PayMethodCreationAttributes>
  implements PayMethodAttributes
{
  public id!: number;
  public userId!: number;
  public payMethodToken!: string;
  public payMethodBody!: string;
}

PayMethod.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    payMethodToken: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
    payMethodBody: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
  },
  {
    tableName: "paymethods",
    sequelize,
  }
);

export default PayMethod;
