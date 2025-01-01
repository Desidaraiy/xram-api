import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface PatronagePlanAttributes {
  id: number;
  title: string;
}

interface PatronagePlanCreationAttributes
  extends Optional<PatronagePlanAttributes, "id"> {}

class PatronagePlan
  extends Model<PatronagePlanAttributes, PatronagePlanCreationAttributes>
  implements PatronagePlanAttributes
{
  public id!: number;
  public title!: string;
}

PatronagePlan.init(
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
  },
  {
    tableName: "patronage_plans",
    sequelize,
  }
);

export default PatronagePlan;
