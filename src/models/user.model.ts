import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Subscription from "./subscription.model";
import PayMethod from "./paymethod.model";
import Patronage from "./patronage.model";
import Device from "./device.model";

interface UserAttributes {
  id: number;
  password: string;
  email: string;
  name: string;
  phone?: string;
  confirmationCode?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  token?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public password!: string;
  public email!: string;
  public name!: string;
  public phone?: string;
  public confirmationCode?: string;
  public emailVerified?: boolean;
  public phoneVerified?: boolean;
  payMethods: any;
  subscriptions: any;
  patronages: any;
  public token?: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    password: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    phone: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    confirmationCode: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    sequelize,
  }
);

User.hasMany(Device, { as: "devices", foreignKey: "userId" });
User.hasMany(Patronage, { as: "patronages", foreignKey: "userId" });
User.hasOne(Subscription, { as: "subscriptions", foreignKey: "userId" });
User.hasMany(PayMethod, { as: "payMethods", foreignKey: "userId" });
Subscription.belongsTo(User, { as: "user", foreignKey: "userId" });

export default User;
