import { ProductCondDTO, ProductCreateDTO, ProductUpdateDTO } from "../../model/dto"
import { Product } from "../../model/model"
import { IBrandQueryRepository, ICategoryQueryRepository, IProductUseCase } from "../../interface"
import { Request, Response } from "express"
import { BaseHttpService } from '@share/transport/http-service';
import { IQueryRepository } from "@share/interface";

export class ProductHTTPService extends BaseHttpService<
  ProductCreateDTO,
  ProductUpdateDTO,
  Product,
  ProductCondDTO
> {
  constructor(
    readonly useCase: IProductUseCase,
    readonly productBrandQuery: IBrandQueryRepository,
    readonly productCategoryQuery: ICategoryQueryRepository,
    readonly productQueryRepo: IQueryRepository<Product, ProductCondDTO>
  ) {
    super(useCase)
  }

  async getDetailApi(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      const result = await this.useCase.getDetail(id)

      if (result?.brandId) {
        result.brand = await this.productBrandQuery.get(result.brandId)
      }

      if (result?.categoryId) {
        result.category = await this.productCategoryQuery.get(result.categoryId)
      }

      res.status(200).json({
        data: result,
      })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      })
    }
  }

  async listProductByIdsApi(req: Request, res: Response): Promise<void> {
    const { ids } = req.body
    const result = await this.productQueryRepo.listByIds(ids)
    res.status(200).json({ data: result })
  }
}
