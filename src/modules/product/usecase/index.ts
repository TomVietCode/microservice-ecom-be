import { ModelStatus, PagingDTO } from "@share/models/base-model";
import { IBrandQueryRepository, IProductUseCase } from "../interface";
import { Product } from "../model/model";
import { ProductCondDTO, ProductCondSchema, ProductCreateDTO, ProductCreateSchema, ProductUpdateDTO, ProductUpdateSchema } from "../model/dto"; 
import { IRepository } from "@share/interface";
import { ICategoryQueryRepository } from '@modules/product/interface';
import { ErrBrandNotFound, ErrCategoryNotFound } from "../model/error";
import { v7 } from "uuid";
import { ErrDataNotFound } from "@share/models/base-error";

export class ProductUseCase implements IProductUseCase {
  constructor(
    private readonly repository: IRepository<Product, ProductUpdateDTO, ProductCondDTO>,
    private readonly productBrandRepository: IBrandQueryRepository,
    private readonly productCategoryRepository: ICategoryQueryRepository
  ) {}
  async create(data: ProductCreateDTO): Promise<string> {
    const dto = ProductCreateSchema.parse(data)

    if(dto.brandId) {
      const brand = this.productBrandRepository.get(dto.brandId)
      if(!brand) throw ErrBrandNotFound
    }

    if(dto.categoryId) {
      const category = this.productCategoryRepository.get(dto.categoryId)
      if(!category) throw ErrCategoryNotFound
    }

    const newId = v7()
    const newProduct: Product = {
      ...dto,
      id: newId,
      saleCount: 0,
      rating: 0,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date
    }

    await this.repository.insert(newProduct)

    return newId
  }
  async getDetail(id: string): Promise<Product | null> {
    const data = await this.repository.get(id)

    if(!data || data.status === ModelStatus.DELETED) {
      throw ErrDataNotFound
    }

    return data
  }

  async update(id: string, data: ProductUpdateDTO): Promise<boolean> {
    const dto = ProductUpdateSchema.parse(data)
    console.log(dto)
    const product = await this.repository.get(id)

    if(!product || product.status === ModelStatus.DELETED) {
      throw ErrDataNotFound
    }

    await this.repository.update(id, dto)
    return true
  }

  async delete(id: string): Promise<boolean> {
    const product = await this.repository.get(id)

    if(!product || product.status === ModelStatus.DELETED) {
      throw ErrDataNotFound
    }

    await this.repository.delete(id, false)
    return true
  }

  async list(cond: ProductCondDTO, paging: PagingDTO): Promise<Product[]> {
    const parsedCond = ProductCondSchema.parse(cond)

    const datas = await this.repository.list(parsedCond, paging)

    return datas
  }
}