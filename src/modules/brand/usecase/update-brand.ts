import { ICommandHandler, ICommandRepository, IRepository } from "../../../share/interface";
import { ErrDataInvalid, ErrDataNotFound } from "../../../share/models/base-error";
import { ModelStatus } from "../../../share/models/base-model";
import { IBrandRepository, UpdateCommand } from "../interface";
import { BrandUpdateSchema } from "../model/dto.model";

export class UpdateBrandCmdHandler implements ICommandHandler<UpdateCommand, void> {
  constructor(private readonly repository: IBrandRepository) {}

  async execute(command: UpdateCommand): Promise<void> {
    const { success, data: parsedData } = BrandUpdateSchema.safeParse(command.dto)

    if(!success) {
      throw ErrDataInvalid
    }

    const dataCheck = await this.repository.get(command.id)

    if(!dataCheck || dataCheck.status === ModelStatus.DELETED) {
      throw ErrDataNotFound
    }

    await this.repository.update(command.id, parsedData)
    return
  }
}