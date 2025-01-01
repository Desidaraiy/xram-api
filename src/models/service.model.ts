import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Limit from "./limit.model";

interface ServiceAttributes {
  id: number;
  title: string;
  price: number;
}

interface ServiceCreationAttributes extends Optional<ServiceAttributes, "id"> {}

class Service
  extends Model<ServiceAttributes, ServiceCreationAttributes>
  implements ServiceAttributes
{
  public id!: number;
  public title!: string;
  public price!: number;
  limits: any;
}

Service.init(
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
    tableName: "services",
    sequelize,
  }
);

Service.hasMany(Limit, {
  foreignKey: "serviceId",
  as: "limits",
});

export default Service;
