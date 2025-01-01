import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface GoodAttributes {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface GoodCreationAttributes extends Optional<GoodAttributes, "id"> {}

class Good
  extends Model<GoodAttributes, GoodCreationAttributes>
  implements GoodAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public category!: string;
  public price!: number;
  public image!: string;
}

Good.init(
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
    description: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
    category: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
  },
  {
    tableName: "goods",
    sequelize,
  }
);

export default Good;
