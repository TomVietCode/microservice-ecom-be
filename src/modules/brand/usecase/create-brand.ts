import { v7 } from "uuid";
import { ErrDataInvalid } from "../../../share/models/base-error";
import { CreateCommand, IBrandRepository } from "../interface";
import { BrandCreateSchema } from "../model/dto.model";
import { ErrBrandNameDuplicate } from "../model/errors.model";
import { ModelStatus } from "../../../share/models/base-model";
import { ICommandHandler } from "../../../share/interface";

export class CreateBrandCmdHandler implements ICommandHandler<CreateCommand, string> {
  constructor(private readonly repository: IBrandRepository) {}

  async execute(command: CreateCommand): Promise<string> {
    const { success, data: parsedData } = BrandCreateSchema.safeParse(command.dto)

    if(!success) {
      throw ErrDataInvalid
    }

    const isExist = await this.repository.findByCond({ name: parsedData.name })

    if(isExist) {
      throw ErrBrandNameDuplicate
    }

    const id = v7()

    const newBrand = {
      ...parsedData,
      id,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await this.repository.insert(newBrand)

    return id 
  }
}