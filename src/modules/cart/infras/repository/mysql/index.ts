import { AddCartItemDTO, CartItem, CartItemCondDTO, UpdateCartItemDTO } from "@/modules/cart/model"
import { ICartCommandRepository, ICartQueryRepository } from "@modules/cart/interface"
import { Sequelize } from "sequelize"

export class CartRepository implements ICartQueryRepository, ICartCommandRepository {
  constructor(readonly modelName: string, readonly sequelize: Sequelize) {}
  async get(id: string): Promise<CartItem | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id)
    if (!data) return null

    const plainData = data.get({ plain: true })
    const { created_at, updated_at, ...props } = plainData

    return {
      ...props,
      createdAt: created_at,
      updatedAt: updated_at,
    } as CartItem
  }
  async listItems(requesterId: string): Promise<Array<CartItem>> {
    const datas = await this.sequelize.models[this.modelName].findAll({
      where: { userId: requesterId },
    })

    return datas.map((item) => {
      const plainItem = item.get({ plain: true })
      const { created_at, updated_at, ...props } = plainItem

      return {
        ...props,
        createdAt: created_at,
        updatedAt: updated_at,
      } as CartItem
    })
  }
  async findByCond(cond: CartItemCondDTO): Promise<CartItem | null> {
    const data = await this.sequelize.models[this.modelName].findOne({ where: cond })
    if (!data) return null

    const plainData = data.get({ plain: true })
    const { created_at, updated_at, ...props } = plainData

    return {
      ...props,
      createdAt: created_at,
      updatedAt: updated_at,
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
  async updateMany(dto: UpdateCartItemDTO[], userId: string): Promise<boolean> {
    await this.sequelize.transaction(async (t) => {
      for (let i = 0; i < dto.length; i++) {
        const { productId, quantity, attribute } = dto[i]
        await this.sequelize.models[this.modelName].update(
          { quantity },
          { where: { productId, userId, attribute }, transaction: t }
        )
      }
      return true
    })
    return true
  }
  async remove(id: string, isHard: boolean): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } })
    return true
  }
}
