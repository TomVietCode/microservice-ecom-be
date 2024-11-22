import { PagingDTO } from "../../../share/models/base-model";
import { CategoryCondDTO, CategoryCreateDTO, CategoryUpdateDTO } from "../model/dto";
import { Category } from "../model/model";

export interface ICategoryUseCase {
  createNewCategory(data: CategoryCreateDTO): Promise<string>
  getDetailCategory(id: string): Promise<Category | null>
  getListCategories(cond: CategoryCondDTO): Promise<Array<Category>>
  updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean>
  deleteCategory(id: string, isHard: boolean): Promise<boolean>
}

export interface IQueryRepository {
  get(id: string): Promise<Category | null>
  list(cond: CategoryCondDTO): Promise<Array<Category>>
}

export interface ICommandRepository {
  insert(data: CategoryCreateDTO): Promise<boolean>
  update(id: string, data: CategoryUpdateDTO): Promise<boolean>
  delete(id: string, isHard: boolean): Promise<boolean>
}

export interface IRepository extends IQueryRepository, ICommandRepository {}
