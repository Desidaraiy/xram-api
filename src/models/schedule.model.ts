import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ScheduleAttributes {
  id: number;
  date: string;
  body: string;
}

interface ScheduleCreationAttributes
  extends Optional<ScheduleAttributes, "id"> {}

class Schedule
  extends Model<ScheduleAttributes, ScheduleCreationAttributes>
  implements ScheduleAttributes
{
  public id!: number;
  public date!: string;
  public body!: string;
}

Schedule.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: new DataTypes.STRING(1024),
      allowNull: true,
    },
    body: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
  },

  {
    tableName: "schedule",
    timestamps: false,
    sequelize,
  }
);

export default Schedule;
