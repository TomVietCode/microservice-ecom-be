import { Request, Response } from "express";
import { ICategoryUseCase } from "../../interface";
import { ErrDataNotFound, ErrInvalidPaging } from "../../../../share/models/base-error";
import { PagingDTOShema } from "../../../../share/models/base-model";
import { CategoryCondSchema, CategoryUpdateSchema } from "../../model/dto";
import { Category } from "../../model/model";

export class CategoryHttpService {
  constructor(private readonly usecase: ICategoryUseCase) {}

  async createNewCategoryAPI(req: Request, res: Response) {
    try {
      const result = await this.usecase.createNewCategory(req.body)
      res.status(201).json({
        data: result
      })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message
      })
    }
  }

  async getDetailCategoryAPI(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await this.usecase.getDetailCategory(id)
      
      res.status(200).json({
        data: result
      })
    } catch (error) {
      res.status(404).json({
        message: (error as Error).message
      })
    }
  }

  async getListCategoriesAPI(req: Request, res: Response) {    
    const cond = CategoryCondSchema.parse(req.query)

    const result = await this.usecase.getListCategories(cond)

    const categories = this.buildTree(result)

    res.status(200).json({
      data: categories,
      filter: cond
    })
  }

  async updateCategoryAPI(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data = CategoryUpdateSchema.parse(req.body)

      await this.usecase.updateCategory(id, data)

      res.status(200).json({
        data: true
      })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message
      })
    }
  }

  async deleteCategoryAPI(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { isHard } = req.body || false

      await this.usecase.deleteCategory(id, isHard)

      res.status(200).json({
        data: true
      })
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message
      })
    }
  }

  private buildTree(categories: Category[]): Category[] {
    const categoryTree: Category[] = []
    const mapChildren = new Map<string, Category[]>()

    for(let i = 0; i < categories.length; i++) {
      const category = categories[i]

      if(!mapChildren.get(category.id)){
        mapChildren.set(category.id, [])
      }

      category.children = mapChildren.get(category.id)
      
      if(!category.parentId) {
        categoryTree.push(category)
      } else {
        const children = mapChildren.get(category.parentId)
        children ? children.push(category) : mapChildren.set(category.parentId, [category]) 
      }
    }
    return categoryTree
  }
}