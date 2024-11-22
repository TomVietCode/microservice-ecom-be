import { v7 } from "uuid";
import { ModelStatus, PagingDTO } from "../../../share/models/base-model";
import { ICategoryUseCase, IRepository } from "../interface";
import { CategoryCreateDTO, CategoryCondDTO, CategoryUpdateDTO, CategoryCreateSchema, CategoryUpdateSchema } from "../model/dto";
import { Category } from "../model/model";
import { ZodError } from "zod";
import { ErrCategoryNameTooShort } from "../model/error";
import { ErrDataNotFound } from "../../../share/models/base-error";

export class CategoryUseCase implements ICategoryUseCase{
  constructor(private readonly repository: IRepository) {}
  
  async createNewCategory(data: CategoryCreateDTO): Promise<string> {
    const { data: parsedData, error } = CategoryCreateSchema.safeParse(data)

    if(error) {
      const issues = (error as ZodError).issues

      for (const issue of issues) {
        if (issue.path[0] === 'name') {
          throw ErrCategoryNameTooShort;
        }
      }
      throw error
    }

    const newId = v7()
    const category: Category = {
      id: newId,
      name: parsedData!.name,
      position: 0,
      parentId: parsedData!.parentId,
      image: parsedData!.image,
      description: parsedData!.description,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    await this.repository.insert(category)
    return newId
  }
  
  async getDetailCategory(id: string): Promise<Category | null> {
    const data = await this.repository.get(id)

    if(!data || data.status === ModelStatus.DELETED) {
      throw ErrDataNotFound
    }

    return data as Category
  }

  async getListCategories(cond: CategoryCondDTO): Promise<Array<Category>> {
    const data = await this.repository.list(cond)

    return data
  }

  async updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean> {
    const category = await this.repository.get(id)

    if(!category || category.status === ModelStatus.DELETED){
      throw ErrDataNotFound
    }

    this.repository.update(id, data)

    return true
  }
  
  async deleteCategory(id: string, isHard: boolean): Promise<boolean> {
    const category = await this.repository.get(id)

    if(!category || category.status === ModelStatus.DELETED){
      throw ErrDataNotFound
    }

    await this.repository.delete(id, isHard)
    
    return true
  }
}