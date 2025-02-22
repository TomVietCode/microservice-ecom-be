import { DataTypes, Model, Sequelize } from "sequelize";

export class CartItemPersistence extends Model { }

export const modelName = "Cart";

export function init(sequelize: Sequelize) {
  CartItemPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.STRING,
        field: 'user_id'
      },

      productId: {
        type: DataTypes.STRING,
        field: 'product_id'
      },

      attribute: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },

      quantity: {
        type: DataTypes.NUMBER,
        defaultValue: 1
      }
    },
    {
      sequelize,
      modelName: modelName,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: 'carts'
    }
  );
}