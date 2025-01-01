import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import PatronagePlan from "./patronagePlan.model";

interface PatronageAttributes {
  id: number;
  userId: number;
  planId: number;
  amount: number;
  until: Date;
  active: boolean;
}

interface PatronageCreationAttributes
  extends Optional<PatronageAttributes, "id"> {}

class Patronage
  extends Model<PatronageAttributes, PatronageCreationAttributes>
  implements PatronageAttributes
{
  public id!: number;
  public userId!: number;
  public planId!: number;
  public amount!: number;
  public until!: Date;
  public active!: boolean;
  public readonly plan: PatronagePlan | undefined;
}

Patronage.init(
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
    planId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
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
    tableName: "patronages",
    sequelize,
  }
);

Patronage.belongsTo(PatronagePlan, { as: "plan", foreignKey: "planId" });

export default Patronage;
