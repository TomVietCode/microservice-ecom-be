import { AddCartItemDTO, CartItem, CartItemCondDTO } from "@/modules/cart/model";
import { ICartCommandRepository, ICartQueryRepository } from "@modules/cart/interface";
import { Sequelize } from "sequelize";

export class CartRepository implements ICartQueryRepository, ICartCommandRepository {
  constructor(
    readonly modelName: string,
    readonly sequelize: Sequelize
  ) {}
  async get(id: string): Promise<CartItem | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id)
    if(!data) return null

    const plainData = data.get({ plain: true });
    const { created_at, updated_at, ...props } = plainData

    return {
      ...props,
      createdAt: created_at,
      updatedAt: updated_at
    } as CartItem
  }
  async listItems(requesterId: string): Promise<Array<CartItem> | null> {
    const datas = await this.sequelize.models[this.modelName].findAll({ where: { userId: requesterId } })

    return datas.map(item => {
      const plainItem = item.get({ plain: true })
      const { created_at, updated_at, ...props } = plainItem

      return {
        ...props,
        createdAt: created_at,
        updatedAt: updated_at
      } as CartItem
    })
  }
  async findByCond(cond: CartItemCondDTO): Promise<CartItem | null> {
    const data = await this.sequelize.models[this.modelName].findOne({ where: cond })
    if(!data) return null 

    const plainData = data.get({ plain: true });
    const { created_at, updated_at, ...props } = plainData

    return {
      ...props,
      createdAt: created_at,
      updatedAt: updated_at
    } as CartItem

  }
  
  async create(dto: AddCartItemDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(dto)
    return true
  }
  async update(id: string, data: CartItem): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data, { where: { id } })
    return true
  }
  async remove(id: string, isHard: boolean): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } })
    return true
  }
}