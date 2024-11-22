import { Sequelize } from "sequelize"
import { IRepository } from "../../interface"
import { ModelStatus, PagingDTO } from "../../../../share/models/base-model"
import { CategoryCondDTO, CategoryCreateDTO, CategoryUpdateDTO, } from "../../model/dto"
import { Category } from "../../model/model"
import { modelName } from "./dto"
import { Op } from "sequelize"

export class MySQLCategoryRepository implements IRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  async insert(data: CategoryCreateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data)
    return true
  }

  async get(id: string): Promise<Category | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id)

    if(!data) return null

    return data.get({ plain: true }) as Category
  }
  async list(cond: CategoryCondDTO): Promise<Array<Category>> {
    const condSQL = { ...cond, status: { [Op.ne]: ModelStatus.DELETED } }

    const rows = await this.sequelize.models[this.modelName].findAll({
      where: condSQL,
      order: [["id", "DESC"]],
    })

    return rows.map(row => row.get({ plain: true }))
  }
  async update(id: string, data: CategoryUpdateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data, { where: { id } })

    return true
  }
  async delete(id: string, isHard: boolean = false): Promise<boolean> {
    if (!isHard) {
      await this.sequelize.models[this.modelName].update({ status: ModelStatus.DELETED }, { where: { id } });
    } else {
      await this.sequelize.models[this.modelName].destroy({ where: { id } });
    }

    return true
  }
}
