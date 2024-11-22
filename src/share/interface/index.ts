export interface IQueryRepository<Entity, Cond> {
  get(id: string): Promise<Entity | null>
  list(cond: Cond): Promise<Array<Entity>>
}

export interface ICommandRepository<CreateDTO, UpdateDTO> {
  insert(data: CreateDTO): Promise<boolean>
  update(id: string, data: UpdateDTO): Promise<boolean>
  delete(id: string, isHard: boolean): Promise<boolean>
}

export interface IRepository<Entity, CreateDTO, UpdateDTO, Cond> extends IQueryRepository<Entity, Cond>, ICommandRepository<CreateDTO, UpdateDTO> {}