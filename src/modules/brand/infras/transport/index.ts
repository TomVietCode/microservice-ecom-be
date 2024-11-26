import { Request, Response } from "express"
import {
  CreateCommand,
  DeleteCommand,
  GetDetailQuery,
  ListQuery,
  UpdateCommand,
} from "../../interface"
import { ICommandHandler, IQueryHandler } from "../../../../share/interface"
import { Brand } from "../../model/brand.model"

export class BrandHttpService {
  constructor(
    private readonly createCmdHandler: ICommandHandler<CreateCommand, string>,
    private readonly getDetailQueryHandler: IQueryHandler<GetDetailQuery, Brand>,
    private readonly updateCmdHandler: ICommandHandler<UpdateCommand, void>,
    private readonly deleteCmdHandler: ICommandHandler<DeleteCommand, void>,
    private readonly listQueryHandler: IQueryHandler<ListQuery, Brand[]>,
  ) {}

  async createApi(req: Request, res: Response) {
    try {
      const result = await this.createCmdHandler.execute({ dto: req.body })

      res.status(200).json({
        data: result,
      })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }

  async getApi(req: Request, res: Response) {
    const { id } = req.params

    try {
      const data = await this.getDetailQueryHandler.query({ id })
      res.status(200).json({
        data: data,
      })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }

  async updateApi(req: Request, res: Response) {
    const { id } = req.params

    try {
      await this.updateCmdHandler.execute({ id, dto: req.body })

      res.status(200).json({
        data: true,
      })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }

  async deleteApi(req: Request, res: Response) {
    const { id } = req.params
    // const { isHard } = req.body
    try {
      await this.deleteCmdHandler.execute({ id, isHard: false })
      res.status(200).json({
        data: true,
      })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }

  async listApi(req: Request, res: Response) {
    const paging = {
      page: 1,
      limit: 200,
    }
    const data = await this.listQueryHandler.query({ cond: {}, paging })

    res.status(200).json({
      data,
    })
  }
}
