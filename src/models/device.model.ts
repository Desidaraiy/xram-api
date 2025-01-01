import { Model, Optional, DataTypes } from "sequelize";
import sequelize from "../config/database";

interface DeviceAttributes {
  id: number;
  userId?: number;
  token?: string;
  pushId?: string;
  platform?: string;
  realIp?: string;
  browser?: string;
}

interface DeviceCreationAttributes extends Optional<DeviceAttributes, "id"> {}

class Device
  extends Model<DeviceAttributes, DeviceCreationAttributes>
  implements DeviceAttributes
{
  public id!: number;
  public userId?: number;
  public token?: string;
  public pushId?: string;
  public platform?: string;
  public realIp?: string;
  public browser?: string;
}

Device.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    token: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
    pushId: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
    platform: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
    realIp: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
    browser: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
  },
  {
    tableName: "devices",
    sequelize,
  }
);

export default Device;
