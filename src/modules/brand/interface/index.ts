import { IRepository } from "../../../share/interface";
import { PagingDTO } from "../../../share/models/base-model";
import { Brand } from "../model/brand.model";
import { BrandCondDTO, BrandCreateDTO, BrandUpdateDTO } from "../model/dto.model";

export interface IBrandUseCase {
  create(data: BrandCreateDTO): Promise<string>
  getDetail(id: string): Promise<Brand>
  update(id: string, data: BrandUpdateDTO): Promise<Boolean>
  delete(id: string, isHard: boolean): Promise<boolean>
  list(cond: BrandCondDTO, paging: PagingDTO): Promise<Array<Brand>>
}

export interface CreateCommand {
  dto: BrandCreateDTO
}

export interface GetDetailQuery {
  id: string
}

export interface UpdateCommand {
  id: string,
  dto: BrandUpdateDTO
}

export interface DeleteCommand {
  id: string,
  isHard: boolean
}

export interface ListQuery {
  cond: BrandCondDTO,
  paging: PagingDTO
}

export interface IBrandRepository extends IRepository<Brand, BrandCondDTO, BrandUpdateDTO> {}