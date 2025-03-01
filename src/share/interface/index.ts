import { PagingDTO } from "../models/base-model"

export interface IQueryRepository<Entity, Cond> {
  get(id: string): Promise<Entity | null>
  findByCond(cond: Cond): Promise<Entity | null>
  list(cond: Cond, paging: PagingDTO): Promise<Array<Entity>>
  listByIds(ids: string[]): Promise<Array<Entity>>
}

export interface ICommandRepository<Entity, UpdateDTO> {
  insert(data: Entity): Promise<boolean>
  update(id: string, data: UpdateDTO): Promise<boolean>
  delete(id: string, isHard: boolean): Promise<boolean>
}

export interface IRepository<Entity, UpdateDTO, Cond> extends IQueryRepository<Entity, Cond>, ICommandRepository<Entity, UpdateDTO> {}

export interface ICommandHandler<Cmd, Result> {
  execute(command: Cmd): Promise<Result>
}

export interface IQueryHandler<Query, Result> {
  query(query: Query): Promise<Result>
}

export interface IUseCase<CreateDTO, UpdateDTO, Entity, Cond> {
  create(data: CreateDTO): Promise<string>
  getDetail(id: string): Promise<Entity | null>
  update(id: string, data: UpdateDTO): Promise<boolean>
  delete(id: string): Promise<boolean>
  list(cond: Cond, paging: PagingDTO): Promise<Array<Entity>>
}

// JWT TOKEN
export enum UserRole {
  ADMIN = "admin",
  USER = "user"
}

export interface TokenPayload {
  sub: string
  role: UserRole
}

export interface Requester extends TokenPayload {}

export interface ITokenProvider {
  generateToken(payload: TokenPayload): Promise<string>
  verifyToken(token: string): Promise<TokenPayload | null>
}

// Authorization
export interface TokenIntrospectResult {
  payload: TokenPayload | null
  error?: Error
  isOk: boolean
}

export interface ITokenIntrospect {
  introspect(token: string): Promise<TokenIntrospectResult>
}
