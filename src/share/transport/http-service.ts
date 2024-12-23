import { Request, Response } from "express"
import { IUseCase } from "../interface"
import { PagingDTOShema } from "../models/base-model"
import { ErrInvalidPaging } from "../models/base-error"

export abstract class BaseHttpService<CreateDTO, UpdateDTO, Entity, Cond> {
  constructor(readonly useCase: IUseCase<CreateDTO, UpdateDTO, Entity, Cond>) {}

  async createApi(req: Request, res: Response) {
    try {
      const result = await this.useCase.create(req.body)
      res.status(201).json({
        data: result,
      })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }

  async getDetailApi(req: Request, res: Response) {
    try {
      const { id } = req.params

      const result = await this.useCase.getDetail(id)
      res.status(200).json({
        data: result,
      })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }

  async updateApi(req: Request, res: Response) {
    try {
      const { id } = req.params

      const result = await this.useCase.update(id, req.body)
      res.status(200).json({
        data: result,
      })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }

  async deleteApi(req: Request, res: Response) {
    try {
      const { id } = req.params

      const result = await this.useCase.delete(id)
      res.status(200).json({
        data: result,
      })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }

  async listApi(req: Request, res: Response) {
    try {
      const { success, data: paging, error } = PagingDTOShema.safeParse(req.query) 

      if(!success) {
        res.status(400).json({
          message: ErrInvalidPaging,
          error: error
        })
      }

      const result = await this.useCase.list(req.query as Cond, paging!)
      
      res.status(200).json({
        data: result,
        filter: req.query as Cond,
        paging: paging
      })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message
      })
    }
  }
}
