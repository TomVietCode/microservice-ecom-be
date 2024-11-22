import { Brand } from "../model/brand";
import { BrandCondDTO, BrandCreateDTO, BrandUpdateDTO } from "../model/dto";

export interface IBrandUseCase {
  create(data: BrandCreateDTO): Promise<string>
  getDetail(id: string): Promise<Brand | null>
  list(cond: BrandCondDTO): Promise<Array<Brand>>
  update(id: string, data: BrandUpdateDTO): Promise<Boolean>
  delete(id: string): Promise<Boolean>
}

export interface IQueryRepository {
  get(id: string): Promise<Brand | null>
  list(cond: BrandCondDTO): Promise<Array<Brand>>
}

export interface ICommandRepository {
  insert(data: BrandCreateDTO): Promise<boolean>
  update(id: string, data: BrandUpdateDTO): Promise<boolean>
  delete(id: string, isHard: boolean): Promise<boolean>
}

export interface IRepository extends IQueryRepository, ICommandRepository {}