import { ICommandHandler, ICommandRepository } from "../../../share/interface";
import { ErrDataNotFound } from "../../../share/models/base-error";
import { ModelStatus } from "../../../share/models/base-model";
import { DeleteCommand, IBrandRepository } from "../interface";

export class DeleteBrandCmdHandler implements ICommandHandler<DeleteCommand, void> {
  constructor(private readonly repository: IBrandRepository) {}

  async execute(command: DeleteCommand): Promise<void> {
    const dataCheckExist = await this.repository.get(command.id)

    if (!dataCheckExist || dataCheckExist.status === ModelStatus.DELETED) {
      throw ErrDataNotFound
    }

    await this.repository.delete(command.id, command.isHard)

    return 
  }
}