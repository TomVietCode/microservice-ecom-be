import { IQueryHandler, IQueryRepository } from "../../../share/interface";
import { ErrDataNotFound } from "../../../share/models/base-error";
import { ModelStatus } from "../../../share/models/base-model";
import { GetDetailQuery } from "../interface";
import { Brand } from "../model/brand.model";
import { BrandCondDTO } from "../model/dto.model";

export class GetBrandDetailQuery implements IQueryHandler<GetDetailQuery, Brand> {
  constructor(private readonly repository: IQueryRepository<Brand, BrandCondDTO>) {}

  async query(query: GetDetailQuery): Promise<Brand> {
    const data = await this.repository.get(query.id)

    if(!data || data.status === ModelStatus.DELETED){
      throw ErrDataNotFound
    }

    return data as Brand
  }
}