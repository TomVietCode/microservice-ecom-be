import { Sequelize, Op } from "sequelize"
import { IRepository } from "../interface"
import { ModelStatus, PagingDTO } from "../models/base-model"

export class BaseRepositorySequelize<Entity, UpdateDTO, Cond> implements IRepository<Entity, UpdateDTO, Cond>{
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  async insert(data: Entity): Promise<boolean> {
    console.log("Available models:", this.sequelize?.models);
    await this.sequelize.models[this.modelName].create(data as any);
    return true;
  }

  async get(id: string): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id)

    if (!data) return null

    const persistenceData = data.get({ plain: true })
    const { created_at, updated_at, ...props } = persistenceData

    return {
      ...props,
      createdAt: created_at,
      updatedAt: updated_at,
    } as Entity
  }

  async findByCond(cond: Cond): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findOne({ where: cond as any })

    if(!data) return null

    const persistenceData = data.get({ plain: true })
    return persistenceData as Entity 
  }
  async list(cond: Cond, paging: PagingDTO): Promise<Array<Entity>> {
    const { page, limit } = paging

    const queryCond = { ...cond, status: { [Op.ne]: ModelStatus.DELETED } }

    const rows = await this.sequelize.models[this.modelName].findAll({
      where: queryCond,
      limit,
      offset: (page - 1) * limit,
      order: [["id", "DESC"]],
    })

      rows.forEach((row, index) => {
      const persistenceData = row.get({ plain: true })
      const { created_at, updated_at, ...props } = persistenceData

      rows[index] = {
        ...props,
        createdAt: created_at,
        updatedAt: updated_at
      }
    })

    return rows as Entity[]
  }

  async update(id: string, data: UpdateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data as any, {
      where: { id },
    })
    return true
  }

  async delete(id: string, isHard: boolean): Promise<boolean> {
    if (isHard) {
      await this.sequelize.models[this.modelName].destroy({ where: { id } })
    } else {
      await this.sequelize.models[this.modelName].update(
        { status: ModelStatus.DELETED },
        { where: { id } }
      )
    }
    return true
  }
}
