import { DataTypes, Model, Sequelize } from "sequelize";
import { Gender, UserRole, Status } from "../../model/model";

export class UserPersistence extends Model { }

export const modelName = 'User';

export function init(sequelize: Sequelize) {
  UserPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name'
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: Status.ACTIVE
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: Gender.UNKNOWN
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: UserRole.USER
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: 'users'
    }
  );
}